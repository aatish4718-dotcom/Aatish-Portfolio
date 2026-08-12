# DIGBIG STUDIO — digbigstudio.com

Portfolio of **Aatish Kumar** — urban planner and visual storyteller.

Static site. No build step, no framework, no dependencies. Upload the folder to
any host and it works. To preview locally, double-click `START.bat`.

---

## Files

| File | What it holds |
|---|---|
| `index.html` | Page shell, `<head>` metadata, header, the whole home page as real markup, footer, viewer |
| `styles.css` | The visual system — tokens, 12-column grid, every component |
| `app.js` | Hash router, all routed views, viewer, drawer, lazy media |
| `content.js` | **Everything the site says.** Photo stories, planning cases, design cases, films, About |
| `data.js` | The 141 photographs, by plot, with real pixel dimensions |
| `design-data.js` | The 39 design pieces and their pages |
| `tools-make-webp.py` | Regenerates the WebP derivatives (see below) |

`data.js` and `design-data.js` are carried over unchanged from the previous
site — they are the asset index and nothing else reads or writes them.

## Editing the site

Almost every change you will want to make is in **`content.js`**, which is
commented throughout. It has two rules written into the top of the file:

1. **Nothing is invented.** Every client, place, date, role and institution in
   it comes from the CV, from the artwork itself, or from the published film
   titles. Where a date or a location is not known it is simply absent — there
   are no placeholder years and no guessed cities. Keep it that way.
2. **Curation is editorial, not factual.** The photography story titles and the
   short descriptions group and name real frames; they do not claim anything a
   picture does not show.

Common edits:

- **Rename a photography story, or move a frame between stories** — edit
  `PHOTO_STORIES`. Frames are `"<plot-slug>/<frame number>"`, one-based, into
  `data.js`. All 141 frames are used exactly once; the counts on the site are
  computed, so they follow whatever you do here.
- **Add a planning project** — add an entry to `PLAN_PROJECTS`. Only `slug`,
  `title`, `category` and `lede` are required; `cover`, `process`, `film` and
  `facts` are all optional and simply do not render if absent.
- **Regroup design work** — `DESIGN_PROJECTS[].folders` lists asset folder
  names under `design/`. The page count, the contact sheet and the block widths
  are all derived from `design-data.js`.
- **Change what the home page leads with** — `SELECTED`.

## Images

Every JPEG under `photos/`, `design/` and `reels/` has WebP siblings generated
beside it. After adding or replacing artwork:

```
pip install Pillow          # once
python tools-make-webp.py
```

It writes `X-400.webp`, `X-800.webp` and, for sources wider than 1200px,
`X-1200.webp`; thumbnails and reel posters get one `X.webp`. Existing files are
left alone, so re-running is cheap — delete the derivatives you want rebuilt.

The original JPEGs stay put. They are the `<picture>` fallback, so the site
still renders if the derivatives are ever missing from a deploy.

## How the loading works

The archive is 141 photographs, 39 design pieces and 17 clips, so nothing loads
until it is needed:

- Only the current route is ever built. The home page's images are attached on
  first entry to the home route, so a shared link to a story or a case study
  does not pay for six covers it will never show.
- Every image below the fold is native-lazy and carries its intrinsic
  `width`/`height`, so nothing reflows as it arrives.
- Story pages request the size the layout actually needs; the viewer is the
  only place a full-resolution frame is fetched.
- No `<video>` gets a `src` until the pointer is on it, and it is dropped again
  on the way out.
- No YouTube iframe exists until a film is clicked, and it is removed when you
  navigate away.

A deep link to a case study loads a handful of images. The home page loads
about a dozen.

## Routes

```
#/                      Home — selected work
#/plan                  Planning index
#/plan/<slug>           Planning case study
#/design                Design index
#/design/<slug>         Design case study
#/photography           The archive — 12 stories
#/photography/<slug>    One story, paced as plates
#/motion                Films and short cuts
#/about                 About, path, capabilities
#/contact               Contact
```

Hash routing, deliberately: it needs no server rewrite rules, survives being
copied onto any host, and works from disk.

## Accessibility

Semantic markup, one `<h1>` per view, alt text on every image, full keyboard
support (the viewer traps focus, moves on arrow keys and closes on Escape),
visible red focus rings, and a reduced-motion mode that turns every transition
off. Every text colour in `styles.css` was checked against the ground it sits
on and clears WCAG AA — the metadata grey and the signal red are both a step
deeper than they look for exactly that reason. If you change a colour, check it.

## The visual system

Black, off-white and one red. Red is a signal, never decoration: active
navigation, project numbers, small labels, hover rules, the occasional square.
There is deliberately no second red, no gradient and no tint of the accent
anywhere in the stylesheet.

Type is one grotesk (Inter Tight) and one mono (IBM Plex Mono) — display,
body and technical metadata, nothing else.
