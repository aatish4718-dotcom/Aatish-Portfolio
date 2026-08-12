"""
Sync photos/iec-field with whatever is currently in the Campaign on Ground
source folder.

This deliberately makes no editorial choices. It imports EVERY photograph found
under "new data college/iec/activity wise", in folder order, because the
selection now happens in that folder rather than here — delete a photograph
there and it disappears from the site the next time this runs; nothing that has
been deleted is ever brought back.

Run:  python tools-sync-campaign.py
"""

import os, glob, json, re
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = r'E:\MY PORTFOLIO WEBSITE\new data college\iec\activity wise'
OUT = os.path.join(HERE, 'photos', 'iec-field')
Image.MAX_IMAGE_PIXELS = None
TIERS = (400, 800, 1200)
MAXW = 1600


def emit(img, stem):
    img = img.convert('RGB')
    if img.width > MAXW:
        img = img.resize((MAXW, round(img.height * MAXW / img.width)), Image.LANCZOS)
    img.save(os.path.join(OUT, stem + '.jpg'), 'JPEG', quality=88,
             subsampling=0, optimize=True, progressive=True)
    w, h = img.size
    s = min(w, h)
    th = img.crop(((w - s) // 2, (h - s) // 2, (w - s) // 2 + s, (h - s) // 2 + s)) \
            .resize((400, 400), Image.LANCZOS)
    th.save(os.path.join(OUT, stem + '-t.jpg'), 'JPEG', quality=86, optimize=True)
    th.save(os.path.join(OUT, stem + '-t.webp'), 'WEBP', quality=76, method=5)
    for t in TIERS:
        if t > 800 and img.width <= 1200:
            continue
        c = img.copy()
        if c.width > t:
            c = c.resize((t, max(1, round(c.height * t / c.width))), Image.LANCZOS)
        c.save(os.path.join(OUT, '%s-%d.webp' % (stem, t)), 'WEBP', quality=78, method=5)
    return w, h


def main():
    if not os.path.isdir(SRC):
        raise SystemExit('source folder missing: ' + SRC)

    found = []
    for d in sorted(os.listdir(SRC)):
        p = os.path.join(SRC, d)
        if not os.path.isdir(p):
            continue
        for f in sorted(glob.glob(os.path.join(p, '*'))):
            if f.lower().endswith(('.jpg', '.jpeg', '.png')):
                found.append((d, f))
    if not found:
        raise SystemExit('no photographs found in ' + SRC)

    os.makedirs(OUT, exist_ok=True)
    for f in glob.glob(os.path.join(OUT, '*')):
        os.remove(f)

    rows, per = [], {}
    for i, (folder, src) in enumerate(found, 1):
        per[folder] = per.get(folder, 0) + 1
        w, h = emit(Image.open(src), '%02d' % i)
        rows.append({'n': i, 'w': w, 'h': h, 'folder': folder})

    # data.js — replace the photo list of the IEC Field category in place
    dj = os.path.join(HERE, 'data.js')
    s = open(dj, encoding='utf-8').read()
    entries = ['      { t:"photos/iec-field/%02d-t.jpg", f:"photos/iec-field/%02d.jpg", w:%d, h:%d }'
               % (r['n'], r['n'], r['w'], r['h']) for r in rows]
    m = re.search(r'(\{\s*\n\s*name: "IEC Field".*?)photos: \[.*?\n    \]', s, re.S)
    if not m:
        raise SystemExit('IEC Field block not found in data.js')
    s = s[:m.start()] + m.group(1) + 'photos: [\n' + ',\n'.join(entries) + '\n    ]' + s[m.end():]
    open(dj, 'w', encoding='utf-8').write(s)

    # content.js — the story references every imported frame, in order
    cj = os.path.join(HERE, 'content.js')
    c = open(cj, encoding='utf-8').read()
    refs = ', '.join("'iec-field/%d'" % r['n'] for r in rows)
    c2 = re.sub(r"(slug: 'the-campaign-on-the-ground'.*?refs: \[)[^\]]*(\])",
                lambda mm: mm.group(1) + '\n           ' + refs + mm.group(2),
                c, flags=re.S)
    if c2 == c:
        raise SystemExit('story refs not found in content.js')
    open(cj, 'w', encoding='utf-8').write(c2)

    print('imported %d photographs from %d folders' % (len(rows), len(per)))
    for k in sorted(per):
        print('  %-28s %d' % (k, per[k]))
    print('data.js and content.js updated')


if __name__ == '__main__':
    main()
