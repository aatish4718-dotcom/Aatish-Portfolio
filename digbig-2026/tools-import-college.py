"""
Import the "new data college" archive into the site's asset folders.

Source material is PDFs, PowerPoint decks and phone photographs — none of it
web-ready. This renders the documents to images, curates the field photography,
and writes the same derivative set the rest of the site already uses
(-400/-800/-1200 WebP plus a square -t thumbnail), so imported material behaves
exactly like the material that was already here.

Re-runnable: everything is written to fresh folders and overwritten in place.

Run:  python tools-import-college.py
Needs: Pillow, PyMuPDF        (deck slides are pre-exported by tools-export-decks.ps1)
"""

import os, shutil, glob, json
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = r'E:\MY PORTFOLIO WEBSITE\new data college'
DECKS = (r'C:\Users\kfare\AppData\Local\Temp\claude'
         r'\e--MY-PORTFOLIO-WEBSITE\9ea68cf1-839e-47d6-aa53-099eb6ac380d\scratchpad\review')

TIERS = (400, 800, 1200)
MAXW = 1600          # master width; nothing needs to be larger on this site
Image.MAX_IMAGE_PIXELS = None


# ── derivative writer, matching the existing pipeline ────────────────────────
def emit(img, outdir, stem):
    os.makedirs(outdir, exist_ok=True)
    img = img.convert('RGB')
    if img.width > MAXW:
        img = img.resize((MAXW, round(img.height * MAXW / img.width)), Image.LANCZOS)
    master = os.path.join(outdir, stem + '.jpg')
    img.save(master, 'JPEG', quality=88, subsampling=0, optimize=True, progressive=True)

    w, h = img.size
    s = min(w, h)
    th = img.crop(((w - s) // 2, (h - s) // 2, (w - s) // 2 + s, (h - s) // 2 + s)) \
            .resize((400, 400), Image.LANCZOS)
    th.save(os.path.join(outdir, stem + '-t.jpg'), 'JPEG', quality=86, optimize=True)
    th.save(os.path.join(outdir, stem + '-t.webp'), 'WEBP', quality=76, method=5)

    for t in TIERS:
        if t > 800 and img.width <= 1200:
            continue
        c = img.copy()
        if c.width > t:
            c = c.resize((t, max(1, round(c.height * t / c.width))), Image.LANCZOS)
        c.save(os.path.join(outdir, '%s-%d.webp' % (stem, t)), 'WEBP', quality=78, method=5)
    return w, h


def from_pdf(pdf, pages, outdir, dpi=150):
    """Render chosen 1-based pages of a PDF."""
    import pymupdf
    doc = pymupdf.open(os.path.join(SRC, pdf))
    out = []
    for i, pno in enumerate(pages, 1):
        pg = doc[pno - 1]
        pix = pg.get_pixmap(dpi=dpi)
        img = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
        w, h = emit(img, outdir, '%02d' % i)
        out.append((i, w, h))
    doc.close()
    return out


def from_deck(deckdir, slides, outdir):
    """Copy chosen 1-based slides from a PowerPoint export."""
    files = {}
    for f in glob.glob(os.path.join(DECKS, deckdir, '*')):
        b = os.path.basename(f).lower()
        if not b.endswith('.png'):
            continue
        n = ''.join(ch for ch in b if ch.isdigit())
        if n:
            files[int(n)] = f
    out = []
    for i, sn in enumerate(slides, 1):
        if sn not in files:
            print('    ! slide %s missing in %s' % (sn, deckdir)); continue
        w, h = emit(Image.open(files[sn]), outdir, '%02d' % i)
        out.append((i, w, h))
    return out


def from_photos(pairs, outdir):
    """pairs: list of (relative source path, output stem number)."""
    out = []
    for i, rel in enumerate(pairs, 1):
        src = os.path.join(SRC, 'iec', 'activity wise', rel)
        if not os.path.exists(src):
            print('    ! missing', rel); continue
        w, h = emit(Image.open(src), outdir, '%02d' % i)
        out.append((i, w, h))
    return out


# ── what gets imported ──────────────────────────────────────────────────────
# Page and slide numbers were chosen by reviewing contact sheets of every
# document: maps, diagrams, matrices and photographs, skipping running text.

MANIFEST = {}

def run():
    print('IEC field photography — 24 curated frames')
    iec = [
        r'safai mitra\WhatsApp Image 2025-12-09 at 8.43.04 PM (4).jpeg',
        r'cleaning\WhatsApp Image 2025-12-18 at 2.31.02 PM (2).jpeg',
        r'rangoli school\WhatsApp Image 2025-12-13 at 6.19.58 PM.jpeg',
        r'school\WhatsApp Image 2026-01-01 at 8.14.15 PM (2).jpeg',
        r'2years\WhatsApp Image 2025-12-16 at 7.01.55 PM.jpeg',
        r'msk distribution drive sup\WhatsApp Image 2025-12-15 at 6.06.43 PM (4).jpeg',
        r'msk distribution drive sup\WhatsApp Image 2025-12-15 at 6.06.43 PM (5).jpeg',
        r'msk distribution drive sup\WhatsApp Image 2025-12-16 at 7.01.54 PM (1).jpeg',
        r'beauti\WhatsApp Image 2025-12-14 at 3.42.37 PM (1).jpeg',
        r'jhaki\WhatsApp Image 2026-01-05 at 11.51.22 AM (1).jpeg',
        r'jhaki\WhatsApp Image 2026-01-05 at 11.51.23 AM (1).jpeg',
        r'painting\WhatsApp Image 2025-12-15 at 3.06.04 PM (5).jpeg',
        r'painting\WhatsApp Image 2025-12-15 at 3.06.04 PM (6).jpeg',
        r'2years\WhatsApp Image 2025-12-18 at 6.42.10 PM (2).jpeg',
        r'school\WhatsApp Image 2025-12-19 at 12.31.21 PM (11).jpeg',
        r'school\WhatsApp Image 2025-12-24 at 2.21.25 PM.jpeg',
        r'cleaning\WhatsApp Image 2025-12-14 at 11.39.55 AM.jpeg',
        r'cleaning\WhatsApp Image 2025-12-14 at 11.39.56 AM.jpeg',
        r'cleaning\WhatsApp Image 2025-12-14 at 11.39.57 AM (2).jpeg',
        r'cleaning\WhatsApp Image 2025-12-14 at 11.39.49 AM.jpeg',
        r'safai mitra\WhatsApp Image 2025-12-11 at 2.02.17 PM (2).jpeg',
        r'sup\WhatsApp Image 2026-01-05 at 6.12.37 PM.jpeg',
        r'ward\WhatsApp Image 2025-12-19 at 1.02.39 PM (1).jpeg',
        r'ward\WhatsApp Image 2025-12-26 at 6.44.08 PM (1).jpeg',
    ]
    MANIFEST['photos/iec-field'] = from_photos(iec, os.path.join(HERE, 'photos', 'iec-field'))

    print('Har Ghar Tiranga — activities report')
    MANIFEST['design/har-ghar-tiranga'] = from_pdf(
        'iec/Har_Ghar_Tiranga_PRESENTATION.pdf',
        [1, 2, 4, 5, 7, 8, 9, 11, 12, 14, 16, 17, 18, 19],
        os.path.join(HERE, 'design', 'har-ghar-tiranga'))

    print('Thesis — Planning for Persons with Disabilities')
    MANIFEST['design/thesis-disability'] = from_pdf(
        'FINAL THESIS PRINT .pdf',
        [1, 25, 61, 62, 63, 64, 65, 66, 67, 69, 73, 96, 97, 98],
        os.path.join(HERE, 'design', 'thesis-disability'))

    print('Kathputli Colony — draft report')
    MANIFEST['design/kathputli-report'] = from_pdf(
        'Aatish -Draft Report final , Kathputli colony.pdf',
        [1, 2, 3, 5, 7, 9],
        os.path.join(HERE, 'design', 'kathputli-report'))

    print('Land Pooling Policy — Zone L, Delhi')
    MANIFEST['design/land-pooling'] = from_deck(
        'landpool', [1, 6, 23, 24, 31, 33, 48, 49, 55, 57, 58, 62, 63, 64],
        os.path.join(HERE, 'design', 'land-pooling'))

    print('COVID / pandemic internship assignment')
    MANIFEST['design/pandemic-study'] = from_pdf(
        'internship assin.pdf', [1, 3, 5, 7, 9, 11],
        os.path.join(HERE, 'design', 'pandemic-study'))

    print('Studio — Noida Sector 21-A')
    MANIFEST['design/studio-noida'] = from_deck(
        'noida', [1, 4, 7, 10, 14, 18, 22, 27, 33, 38],
        os.path.join(HERE, 'design', 'studio-noida'))

    print('Studio — physical infrastructure & water')
    MANIFEST['design/studio-water'] = from_deck(
        'water', [1, 2, 3, 4, 5, 6, 7, 8, 9],
        os.path.join(HERE, 'design', 'studio-water'))

    out = os.path.join(HERE, 'imported-manifest.json')
    json.dump(MANIFEST, open(out, 'w'), indent=1)
    print('\nmanifest ->', out)
    for k, v in MANIFEST.items():
        print('  %-30s %2d images' % (k, len(v)))


if __name__ == '__main__':
    run()
