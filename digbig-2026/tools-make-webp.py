"""Regenerate the WebP derivatives the site serves.

Run this after adding or replacing anything in photos/ or design/:

    python tools-make-webp.py

For every full-size JPEG it writes X-400.webp, X-800.webp and — when the source
is wider than 1200px — X-1200.webp beside the original. Square thumbnails
(X-t.jpg) and reel posters (X-poster.jpg) get a single X.webp. A tier wider
than the source is never upscaled; it is just the source re-encoded, which is
why app.js caps each srcset descriptor at the file's true width.

Existing files are left alone, so re-running is cheap. Delete the .webp files
you want rebuilt if you have re-exported a JPEG at the same path.

The original JPEGs stay where they are: they remain the <picture> fallback, so
the site still works if these derivatives are ever missing from a deploy.

Requires Pillow:  pip install Pillow
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
WIDTHS = (400, 800, 1200)
made = skipped = 0

for sub in ("photos", "design", "reels"):
    base = os.path.join(ROOT, sub)
    if not os.path.isdir(base):
        continue
    for r, _dirs, files in os.walk(base):
        for name in files:
            if not name.lower().endswith((".jpg", ".jpeg")):
                continue
            src = os.path.join(r, name)
            stem = os.path.splitext(name)[0]
            try:
                im = Image.open(src).convert("RGB")
            except Exception:
                continue

            # Thumbs and posters are already small; one re-encode is enough.
            if stem.endswith("-t") or stem.endswith("-poster"):
                out = os.path.join(r, stem + ".webp")
                if os.path.exists(out):
                    skipped += 1
                else:
                    im.save(out, "WEBP", quality=76, method=5)
                    made += 1
                continue

            for w in WIDTHS:
                # 400 and 800 are always written so the srcset can rely on
                # them; 1200 only where there is really that much detail.
                if w > 800 and im.width <= 1200:
                    continue
                out = os.path.join(r, "%s-%d.webp" % (stem, w))
                if os.path.exists(out):
                    skipped += 1
                    continue
                c = im.copy()
                if c.width > w:
                    c = c.resize((w, max(1, round(c.height * w / c.width))), Image.LANCZOS)
                c.save(out, "WEBP", quality=78, method=5)
                made += 1

print("written %d, already present %d" % (made, skipped))
