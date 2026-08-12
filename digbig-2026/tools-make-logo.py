"""
Build the site's logo assets from the master artwork.

The original mark is navy (#263C4A) and orange (#FC6B10). This site runs on a
strict black / off-white / one-red system, and orange sitting next to that red
is the single worst colour clash available, so the mark is re-tinted into the
site palette rather than dropped in as-is. The form is untouched — this only
swaps the two flat brand colours, so the artwork stays exactly the artwork.

The master files in images/ are not modified. This writes new derivatives.

Run:  python tools-make-logo.py
Needs: Pillow
"""

import os
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(HERE, 'images')
SRC = os.path.join(IMG, 'logo-on-light.png')

# Source brand colours, sampled from the master file.
NAVY = (38, 60, 74)
ORANGE = (252, 107, 16)

# Site palette (must match the tokens in styles.css).
INK = (11, 11, 11)
PAPER = (250, 250, 248)
RED = (216, 30, 26)

# The mark alone, without the "DigBig Studio" wordmark underneath.
MARK_BOX = (145, 0, 752, 339)


WHITE = (255, 255, 255)


def seg_dist2(c, a, b):
    """Squared distance from colour c to the segment a-b in RGB space."""
    abx, aby, abz = b[0] - a[0], b[1] - a[1], b[2] - a[2]
    acx, acy, acz = c[0] - a[0], c[1] - a[1], c[2] - a[2]
    denom = abx * abx + aby * aby + abz * abz
    t = 0.0 if denom == 0 else (acx * abx + acy * aby + acz * abz) / denom
    t = 0.0 if t < 0 else (1.0 if t > 1 else t)
    dx, dy, dz = acx - abx * t, acy - aby * t, acz - abz * t
    return dx * dx + dy * dy + dz * dz


def retint(img, navy_to, orange_to):
    """Swap the two flat colours, keeping every alpha value as it is.

    Classifying by nearest *colour* is not good enough: a half-opaque navy edge
    pixel sits somewhere on the navy-to-white line, and the midpoint of that
    line is numerically closer to orange than it is to navy. That painted a red
    fringe along every black edge. Measuring distance to the navy-to-white and
    orange-to-white *segments* instead classifies the whole blend ramp
    correctly, so the edges stay as clean as the original.
    """
    img = img.convert('RGBA')
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            c = (r, g, b)
            is_orange = seg_dist2(c, ORANGE, WHITE) < seg_dist2(c, NAVY, WHITE)
            px[x, y] = (orange_to if is_orange else navy_to) + (a,)
    return img


def save(img, name, width):
    out = img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)
    path = os.path.join(IMG, name)
    out.save(path, optimize=True)
    print('  %-26s %4d x %-4d  %5.1f KB' % (name, out.width, out.height,
                                            os.path.getsize(path) / 1024))


def main():
    if not os.path.exists(SRC):
        raise SystemExit('missing ' + SRC)

    master = Image.open(SRC).convert('RGBA')
    mark = master.crop(MARK_BOX)

    print('mark, for light ground:')
    ink_mark = retint(mark, INK, RED)
    save(ink_mark, 'mark-ink.png', 320)
    save(ink_mark, 'mark-ink@2x.png', 640)

    print('mark, for the inverted footer:')
    paper_mark = retint(mark, PAPER, RED)
    save(paper_mark, 'mark-paper.png', 320)
    save(paper_mark, 'mark-paper@2x.png', 640)

    print('full lockup, for sharing and the CV:')
    save(retint(master, INK, RED), 'lockup-ink.png', 900)


if __name__ == '__main__':
    main()
