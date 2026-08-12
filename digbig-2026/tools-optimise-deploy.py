"""
Shrink the deployable assets without touching what they show.

Two things carry almost all the weight: the PDFs in docs/ and the clips in
reels/. Neither is optimised for the web as supplied — the PDFs embed images at
print quality, and some reels are encoded at 4,856 kb/s for a 720-pixel-wide
phone video.

Nothing here changes what is on the site: same documents, same page counts,
same clips, same durations, same dimensions. Only the encoding changes.

The untouched originals live in the timestamped BACKUP folder beside this one.

Usage:
  python tools-optimise-deploy.py --dry     measure, change nothing
  python tools-optimise-deploy.py           do it
"""

import os, sys, subprocess, shutil, json

HERE = os.path.dirname(os.path.abspath(__file__))
DOCS = os.path.join(HERE, 'docs')
REELS = os.path.join(HERE, 'reels')
DRY = '--dry' in sys.argv

# PDFs: 150 dpi is generous for screen reading and well above what these
# documents need; quality 60 on the embedded JPEGs is visually clean at that
# size. Text layers are preserved — this only re-encodes images.
PDF_DPI = 150
PDF_QUALITY = 60

# Reels: constant-quality x264. CRF 25 at 720x1280 is visually clean for phone
# footage; the cap stops a busy clip spiking. Audio down to 96k AAC, which is
# transparent for speech and ambient sound.
CRF = '25'
MAXRATE = '1600k'
BUFSIZE = '3200k'
AUDIO_KBPS = '96k'


def mb(p):
    return os.path.getsize(p) / 1048576


def optimise_pdfs():
    import pymupdf
    rows = []
    for f in sorted(os.listdir(DOCS)):
        if not f.lower().endswith('.pdf'):
            continue
        src = os.path.join(DOCS, f)
        before = mb(src)
        if DRY:
            rows.append((f, before, before)); continue
        tmp = src + '.tmp'
        try:
            d = pymupdf.open(src)
            d.rewrite_images(dpi_threshold=PDF_DPI, dpi_target=PDF_DPI,
                             quality=PDF_QUALITY, lossy=True, lossless=True,
                             color=True, gray=True, bitonal=False)
            d.subset_fonts()
            d.save(tmp, garbage=4, deflate=True, deflate_images=True,
                   deflate_fonts=True, clean=True)
            d.close()
            # Only keep the new file if it is genuinely smaller.
            if os.path.getsize(tmp) < os.path.getsize(src):
                os.replace(tmp, src)
            else:
                os.remove(tmp)
        except Exception as e:
            if os.path.exists(tmp):
                os.remove(tmp)
            print('    ! %s: %s' % (f, e.__class__.__name__))
        rows.append((f, before, mb(src)))
    return rows


def optimise_reels():
    import imageio_ffmpeg
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    rows = []
    for f in sorted(os.listdir(REELS)):
        if not f.lower().endswith('.mp4'):
            continue
        src = os.path.join(REELS, f)
        before = mb(src)
        if DRY:
            rows.append((f, before, before)); continue
        tmp = src + '.tmp.mp4'
        cmd = [ff, '-y', '-loglevel', 'error', '-i', src,
               '-c:v', 'libx264', '-crf', CRF, '-preset', 'slow',
               '-maxrate', MAXRATE, '-bufsize', BUFSIZE,
               '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.0',
               '-movflags', '+faststart',        # first frame without the whole file
               '-c:a', 'aac', '-b:a', AUDIO_KBPS, '-ac', '2',
               tmp]
        try:
            subprocess.run(cmd, check=True, capture_output=True)
            if os.path.getsize(tmp) < os.path.getsize(src):
                os.replace(tmp, src)
            else:
                os.remove(tmp)
        except Exception as e:
            if os.path.exists(tmp):
                os.remove(tmp)
            print('    ! %s: %s' % (f, e.__class__.__name__))
        rows.append((f, before, mb(src)))
    return rows


def report(name, rows):
    b = sum(r[1] for r in rows)
    a = sum(r[2] for r in rows)
    print('\n%s — %d files' % (name, len(rows)))
    for f, x, y in sorted(rows, key=lambda r: -r[1])[:8]:
        pct = 0 if x == 0 else (1 - y / x) * 100
        print('   %-46s %7.1f -> %6.1f MB  (-%.0f%%)' % (f[:46], x, y, pct))
    print('   %-46s %7.1f -> %6.1f MB  (-%.0f%%)'
          % ('TOTAL', b, a, 0 if b == 0 else (1 - a / b) * 100))
    return b, a


if __name__ == '__main__':
    print('mode:', 'DRY RUN' if DRY else 'APPLYING')
    pb, pa = report('PDFs', optimise_pdfs())
    rb, ra = report('Reels', optimise_reels())
    print('\noverall: %.1f MB -> %.1f MB  (saved %.1f MB)' % (pb + rb, pa + ra, (pb + rb) - (pa + ra)))
