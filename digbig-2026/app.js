/* ============================================================================
   DIGBIG STUDIO — application
   ----------------------------------------------------------------------------
   A hash router over static assets. There is no build step and no framework:
   the site has to keep working when it is copied onto a plain host, or opened
   straight off disk, which both rule out history.pushState.

   Loading discipline, because the archive is 141 photographs and 17 clips:
   only the route being viewed is ever built, every image below the fold is
   native-lazy with intrinsic width/height so nothing reflows, story pages ask
   for the thumbnail first and the full frame only in the viewer, and no video
   element gets a src until the pointer is actually on it.
   ========================================================================== */
(function () {
  'use strict';

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Every JPEG in photos/ and design/ has WebP siblings generated beside it:
     "-400.webp" and "-800.webp" always, "-1200.webp" when the source was wider
     than 1200, and a single "-t.webp" for the square thumbs. A tier narrower
     than the source is a real resize; a tier wider than it is just the source
     re-encoded, which is why the descriptor below is capped at the true width.
     The JPEG stays as the fallback inside <picture>, so nothing breaks if the
     derivatives are ever missing from a deploy. */
  var TIERS = [400, 800, 1200];

  function isThumbPath(src) { return /-t\.jpe?g$|-poster\.jpe?g$/i.test(src); }

  /* Intrinsic size, looked up from the two data files rather than repeated by
     hand in content.js — they already record it for every asset. */
  var DIMS = null;
  function dimsFor(path) {
    if (!DIMS) {
      DIMS = {};
      for (var c = 0; c < PORTFOLIO_DATA.length; c++) {
        var ph = PORTFOLIO_DATA[c].photos;
        for (var p = 0; p < ph.length; p++) DIMS[ph[p].f] = { w: ph[p].w, h: ph[p].h };
      }
      for (var g = 0; g < DESIGN_DATA.length; g++) {
        var items = DESIGN_DATA[g].items;
        for (var i = 0; i < items.length; i++) {
          for (var q = 0; q < items[i].pages.length; q++) {
            var pg = items[i].pages[q];
            DIMS[pg.f] = { w: pg.w, h: pg.h };
          }
        }
      }
    }
    return DIMS[path] || null;
  }

  function webpSet(src, w) {
    var stem = src.replace(/\.jpe?g$/i, '');
    if (isThumbPath(src)) return stem + '.webp';
    var set = [];
    for (var i = 0; i < TIERS.length; i++) {
      var t = TIERS[i];
      /* 400 and 800 are always on disk; 1200 only exists for wider sources. */
      if (t > 800 && !(w > 1200)) continue;
      set.push(stem + '-' + t + '.webp ' + (w ? Math.min(t, w) : t) + 'w');
    }
    return set.join(', ');
  }

  function pic(o) {
    var thumb = isThumbPath(o.src);
    var d = o.w ? { w: o.w, h: o.h } : dimsFor(o.src);
    var w = d ? d.w : 0, h = d ? d.h : 0;
    return '<picture>' +
      '<source type="image/webp" srcset="' + esc(webpSet(o.src, w)) + '"' +
        (thumb ? '' : ' sizes="' + esc(o.sizes || '100vw') + '"') + '>' +
      '<img src="' + esc(o.src) + '" alt="' + esc(o.alt) + '"' +
        (w ? ' width="' + w + '" height="' + h + '"' : '') +
        (o.eager ? '' : ' loading="lazy"') + ' decoding="async"' +
        (o.attrs || '') + '>' +
    '</picture>';
  }

  /* ── Artwork shape ────────────────────────────────────────────────────────
     A poster is not a photograph. A photograph can be cropped to a band and
     still be the picture the photographer made; a poster cropped is simply an
     incomplete poster. So artwork is never cropped and never letterboxed —
     instead the block takes the artwork's own ratio and the column span is
     chosen to counteract it. A tall pamphlet gets a narrow column so it does
     not tower; a 3:1 banner gets the full measure so it is not a sliver.

     The real numbers in this archive fall into four families: pamphlets and
     social posts at 0.67–0.80, brochure spreads around 1.4, banners at 1.5–2.0,
     and one 2.99 strip. The thresholds below sit in the gaps between them. */
  function shapeOf(w, h) {
    var r = (w && h) ? w / h : 1;
    if (r < 0.85) return 'tall';
    if (r < 1.20) return 'square';
    if (r < 1.90) return 'wide';
    return 'pano';
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = window.matchMedia('(hover: none)').matches;

  /* ══════════════════════════════════════════════════ CONTENT RESOLVERS ══ */

  /* "heritage/2" → the second frame of the heritage plot. */
  function photoRef(ref) {
    var bits = ref.split('/');
    var cat = null;
    for (var i = 0; i < PORTFOLIO_DATA.length; i++) {
      if (PORTFOLIO_DATA[i].slug === bits[0]) { cat = PORTFOLIO_DATA[i]; break; }
    }
    if (!cat) return null;
    var p = cat.photos[parseInt(bits[1], 10) - 1];
    if (!p) return null;
    return { t: p.t, f: p.f, w: p.w, h: p.h, plot: cat.name };
  }
  function storyFrames(story) {
    var out = [];
    for (var i = 0; i < story.refs.length; i++) {
      var p = photoRef(story.refs[i]);
      if (p) out.push(p);
    }
    return out;
  }
  /* The frame a story is represented by in indexes. Defaults to the opening
     frame, but a story may nominate any frame as its cover — the sequence and
     the cover are different editorial decisions and need not be the same
     picture. */
  function storyCover(story) {
    if (story.cover) {
      var p = photoRef(story.cover);
      if (p) return p;
    }
    return storyFrames(story)[0];
  }

  function storyBySlug(slug) {
    for (var i = 0; i < PHOTO_STORIES.length; i++) {
      if (PHOTO_STORIES[i].slug === slug) return PHOTO_STORIES[i];
    }
    return null;
  }

  /* design-data.js is keyed by asset folder; index it once. */
  var DESIGN_BY_FOLDER = (function () {
    var map = {};
    for (var g = 0; g < DESIGN_DATA.length; g++) {
      var items = DESIGN_DATA[g].items;
      for (var i = 0; i < items.length; i++) {
        var first = items[i].pages[0];
        if (!first) continue;
        var folder = first.f.split('/')[1];
        map[folder] = items[i];
      }
    }
    return map;
  })();

  /* Pages addressed straight by asset folder. Planning projects carry their own
     documents — a thesis, a report, a set of studio sheets — which belong to the
     planning case and have no business appearing in the Design index. */
  function pagesFromFolders(folders) {
    var out = [];
    for (var i = 0; i < folders.length; i++) {
      var it = DESIGN_BY_FOLDER[folders[i]];
      if (!it) continue;
      for (var p = 0; p < it.pages.length; p++) {
        out.push({ page: it.pages[p], title: it.title, n: p + 1, of: it.pages.length });
      }
    }
    return out;
  }

  function designItems(project) {
    var out = [];
    for (var i = 0; i < project.folders.length; i++) {
      var it = DESIGN_BY_FOLDER[project.folders[i]];
      if (it) out.push(it);
    }
    return out;
  }
  function designPages(project) {
    var items = designItems(project), out = [];
    for (var i = 0; i < items.length; i++) {
      for (var p = 0; p < items[i].pages.length; p++) {
        out.push({ page: items[i].pages[p], title: items[i].title, n: p + 1, of: items[i].pages.length });
      }
    }
    return out;
  }
  function bySlug(list, slug) {
    for (var i = 0; i < list.length; i++) if (list[i].slug === slug) return list[i];
    return null;
  }

  function photoTotal() {
    var n = 0;
    for (var i = 0; i < PORTFOLIO_DATA.length; i++) n += PORTFOLIO_DATA[i].photos.length;
    return n;
  }
  function designTotal() {
    var n = 0;
    for (var g = 0; g < DESIGN_DATA.length; g++) n += DESIGN_DATA[g].items.length;
    return n;
  }
  function setText(sel, txt) {
    var el = $(sel);
    if (el) el.textContent = txt;
  }

  /* ═══════════════════════════════════════════════════════════ PARTIALS ══ */

  function mast(opts) {
    return '' +
      '<div class="mast">' +
        '<div class="grid mast-top">' +
          '<p class="lbl c1-6">' + esc(opts.kicker) + '</p>' +
          '<p class="lbl c10-12 ta-r hide-sm">' + esc(opts.count || '') + '</p>' +
        '</div>' +
        '<div class="grid"><h1>' + esc(opts.title) + '</h1></div>' +
        '<div class="grid mast-sub">' +
          '<p class="lede c1-6">' + esc(opts.lede) + '</p>' +
          (opts.note ? '<p class="body-sm c8-12">' + esc(opts.note) + '</p>' : '') +
        '</div>' +
      '</div>';
  }

  /* A back link that reads as an index reference rather than a button. */
  function crumb(href, label) {
    return '<div class="grid" style="padding-top:clamp(20px,3vw,44px)">' +
      '<a class="more c1-12" href="' + href + '"><span aria-hidden="true">←</span> ' + esc(label) + '</a></div>';
  }

  function pager(prev, next, base) {
    var h = '<div class="pager grid" style="grid-column:1/-1">';
    h += '<div>' + (prev
      ? '<a href="#/' + base + '/' + prev.slug + '"><span class="lbl pg-lbl">Previous</span>' +
        '<span class="pg-t">' + esc(prev.title) + '</span></a>'
      : '<span class="lbl">Start of index</span>') + '</div>';
    h += '<div class="ta-r">' + (next
      ? '<a href="#/' + base + '/' + next.slug + '"><span class="lbl pg-lbl">Next project <span aria-hidden="true">→</span></span>' +
        '<span class="pg-t">' + esc(next.title) + '</span></a>'
      : '<span class="lbl">End of index</span>') + '</div>';
    return h + '</div>';
  }

  function neighbours(list, slug) {
    var i = -1;
    for (var k = 0; k < list.length; k++) if (list[k].slug === slug) { i = k; break; }
    return { prev: i > 0 ? list[i - 1] : null, next: i > -1 && i < list.length - 1 ? list[i + 1] : null, i: i };
  }

  /* ═══════════════════════════════════════════════════════════════ HOME ══ */

  /* The home markup lives in index.html so it is crawlable, but its images are
     only ever built once the home route is actually entered. Building them at
     boot made every deep link — a shared story URL, say — pay for six covers
     and five archive thumbs it would never show. */
  var homeBuilt = false;
  function ensureHome() {
    if (homeBuilt) return;
    homeBuilt = true;
    buildHome();
  }

  function buildHome() {
    /* Attach the hero's WebP sources. This runs synchronously right after the
       router unhides #home and before the first layout of it, so the browser
       resolves the srcset and never requests the JPEG fallback. */
    var heroImg = $('#heroImg');
    if (heroImg) {
      heroImg.sizes = '92vw';
      heroImg.srcset = webpSet('photos/heritage/02.jpg', 1600);
    }

    /* Counts are read off the content, never typed twice — re-cut a story or
       add a project and the numbers on the page follow. */
    setText('#selCount', pad(SELECTED.length) + ' projects');
    setText('#statPhotos', String(photoTotal()));
    setText('#statStories', String(PHOTO_STORIES.length));

    /* Selected work. Each entry is a full editorial spread rather than a card:
       a survey-style index column carrying the number and the locator, a large
       visual, and the case for the project set beside it. The figure alternates
       margin down the page so the section never settles into a rhythm. */
    var h = '';
    for (var i = 0; i < SELECTED.length; i++) {
      var s = SELECTED[i];
      var figure, shape;

      if (s.kind === 'photo') {
        /* A photograph may be cropped to a band — that is an editorial crop. */
        shape = 'photo';
        figure = pic({ src: s.cover, alt: s.alt, eager: i === 0,
                       sizes: '(max-width:760px) 92vw, 66vw' });
      } else {
        var d = dimsFor(s.cover) || { w: 1, h: 1 };
        shape = shapeOf(d.w, d.h);
        /* Artwork is never cropped: the box takes the artwork's own ratio. */
        figure = pic({ src: s.cover, alt: s.alt, eager: i === 0,
                       sizes: shape === 'tall' ? '(max-width:760px) 88vw, 34vw'
                                               : '(max-width:760px) 92vw, 56vw',
                       attrs: ' style="aspect-ratio:' + d.w + '/' + d.h + '"' });
      }

      h += '<article class="work work-' + shape + ' rv">' +
        '<a class="work-hit" href="' + s.href + '" data-cursor="VIEW" ' +
           'aria-label="' + esc(s.title + ' — ' + s.meta) + '">' +

          '<span class="work-idx">' +
            '<span class="work-n">' + s.n + '</span>' +
            '<span class="work-where lbl">' + esc(s.where || '') + '</span>' +
          '</span>' +

          '<span class="work-head">' +
            '<h3 class="work-title">' + esc(s.title) + '</h3>' +
            '<span class="work-meta lbl">' + esc(s.meta) + '</span>' +
          '</span>' +

          '<span class="work-fig">' + figure +
            (s.caption ? '<span class="work-cap lbl">' + esc(s.caption) + '</span>' : '') +
          '</span>' +

          '<span class="work-say">' +
            '<span class="work-desc">' + esc(s.desc || '') + '</span>' +
            '<span class="work-go">View project <span aria-hidden="true">→</span></span>' +
          '</span>' +

        '</a>' +
      '</article>';
    }
    $('#selList').innerHTML = h;

    /* The three practices, as an index rather than three cards. */
    var rows = [
      ['PLAN', 'Urban planning &amp; research', PLAN_PROJECTS.length + ' projects — NIUA, AIILSG, SPA Delhi', '#/plan'],
      ['DESIGN', 'Visual communication', DESIGN_PROJECTS.length + ' case studies — ' + designTotal() + ' pieces', '#/design'],
      ['VISUAL', 'Photography &amp; film', photoTotal() + ' photographs, ' + FILMS.length + ' films, ' + REEL_DATA.length + ' short cuts', '#/photography']
    ];
    var r = '';
    for (var j = 0; j < rows.length; j++) {
      r += '<a class="pos-row rv" href="' + rows[j][3] + '">' +
        '<span class="k lbl">' + pad(j + 1) + ' / ' + pad(rows.length) + '</span>' +
        '<span class="t">' + rows[j][1] + '</span>' +
        '<span class="d lbl">' + rows[j][2] + '</span>' +
      '</a>';
    }
    $('#posIndex').innerHTML = r;

    /* Four named stories, previewed at a size that treats them as work rather
       than as thumbnails. They alternate weight so the row is not four equal
       boxes. */
    var peek = '';
    for (var k = 0; k < HOME_STORIES.length; k++) {
      var st = storyBySlug(HOME_STORIES[k]);
      if (!st) continue;
      var fr = storyCover(st);
      if (!fr) continue;
      var big = (k % 2 === 0);
      peek += '<a class="story ' + (big ? 'lg' : 'sm') + ' rv" href="#/photography/' + st.slug + '" ' +
              'data-cursor="OPEN">' +
        '<span class="story-hd">' +
          '<span class="story-n">' + pad(k + 1) + '</span>' +
          '<span class="story-t">' + esc(st.title) + '</span>' +
          '<span class="story-c lbl">' + st.refs.length + '</span>' +
        '</span>' +
        '<figure>' + pic({ src: fr.f, w: fr.w, h: fr.h,
          sizes: big ? '(max-width:760px) 92vw, 46vw' : '(max-width:760px) 92vw, 30vw',
          alt: 'Opening frame of the photography story ' + st.title + ' — ' + st.tags.toLowerCase() + '.' }) +
        '</figure>' +
        '<span class="story-f">' +
          '<span class="lbl">' + esc(st.place || st.sub) + '</span>' +
          '<span class="lbl">' + esc(st.tags) + '</span>' +
        '</span>' +
      '</a>';
    }
    $('#arcPeek').innerHTML = peek;

    /* Motion — one film, named, with its own card. Nothing is requested from
       YouTube until someone presses play. */
    var f = FILMS[0];
    if (f) {
      setText('#motCount', pad(FILMS.length) + ' films · ' + pad(REEL_DATA.length) + ' short cuts');
      $('#motFeature').innerHTML =
        '<div class="grid mot-grid rv">' +
          '<div class="c1-3 mot-idx">' +
            '<span class="work-n">01</span>' +
            '<span class="lbl">' + esc(f.kind) + '</span>' +
          '</div>' +
          '<div class="c4-12">' +
            '<h3 class="mot-title">' + esc(f.title) + '</h3>' +
            '<p class="body-sm mot-note">' + esc(f.note) + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="mot-player rv">' + filmHero(f.id, f.title, f.kind) + '</div>';
    }

    /* Capabilities, as a compact index beside the About paragraph. */
    var caps = '';
    for (var c = 0; c < CAPABILITIES.length; c++) {
      caps += '<div class="abo-cap"><h3>' + esc(CAPABILITIES[c].g) + '</h3><p class="lbl">' +
        esc(CAPABILITIES[c].items.join(' · ')) + '</p></div>';
    }
    $('#aboCaps').innerHTML = caps;
  }

  /* ═══════════════════════════════════════════════════════════════ PLAN ══ */

  /* The complete planning portfolio, grouped by where the work was done.
     A recruiter reads an institution before they read a project title, and the
     three are very different kinds of work — commissioned municipal practice,
     national-level research, and the studio sequence behind both. */
  /* One row of the planning index. Tags sit under the title where a project
     has them; the year appears only when it is actually known. */
  function planRow(p, n) {
    var tags = (p.tags && p.tags.length) ? p.tags.join(' · ') : p.category;
    return '<a class="idx-row" href="#/plan/' + p.slug + '">' +
      '<span class="n">' + pad(n) + '</span>' +
      '<span class="t">' + esc(p.title) + '</span>' +
      '<span class="m lbl">' + esc(tags) + '</span>' +
      '<span class="y lbl">' + esc(p.year || '') + '</span>' +
      '<span class="go" aria-hidden="true">→</span>' +
    '</a>';
  }

  /* One institution open at a time, and one category within it. Done with a
     toggle listener rather than the `name` attribute on <details>, which only
     lands in recent browsers — this way the exclusive behaviour is the same
     everywhere, and if the script never runs the panels simply all work
     independently instead of breaking. */
  document.addEventListener('toggle', function (e) {
    var d = e.target;
    if (!d.open || !d.matches || !d.matches('details.inst, details.cat')) return;

    var scope = d.classList.contains('inst')
      ? d.parentElement                       // siblings within the index
      : d.closest('.inst-body');              // siblings within one institution
    if (!scope) return;

    var sel = d.classList.contains('inst') ? ':scope > details.inst' : ':scope > details.cat';
    $$(sel, scope).forEach(function (other) {
      if (other !== d) other.open = false;
    });
  }, true);   // capture: the toggle event does not bubble

  /* How many documents the Archive already holds for a category, so the notice
     can say so rather than implying nothing exists. Read from ARCHIVE itself,
     which means the number can never drift from what is actually filed. */
  function archiveDocCount(key, instShort) {
    if (typeof ARCHIVE === 'undefined') return 0;
    for (var i = 0; i < ARCHIVE.length; i++) {
      if (ARCHIVE[i].key === key && ARCHIVE[i].inst === instShort) {
        return ARCHIVE[i].items.length;
      }
    }
    return 0;
  }

  function viewPlanIndex() {
    var h = mast({
      kicker: '02 — Plan',
      count: PLAN_PROJECTS.length + ' projects',
      title: 'PLANNING',
      lede: 'Urban planning, field documentation and research — the part of the work that asks the question.',
      note: 'The complete planning portfolio, grouped by institution. The curated selection lives on the home page; this is everything.'
    });

    var n = 0;
    h += '<div class="plan-tree">';
    for (var g = 0; g < INSTITUTIONS.length; g++) {
      var inst = INSTITUTIONS[g];
      var list = [];
      for (var i = 0; i < PLAN_PROJECTS.length; i++) {
        if (PLAN_PROJECTS[i].org === inst.org) list.push(PLAN_PROJECTS[i]);
      }
      if (!list.length) continue;      // never print an empty institution

      /* Every institution is a closed disclosure. The whole index arrives as
         three rows, which is the entire point on a phone — the previous version
         printed fourteen projects and seven category headings before the reader
         had asked for any of it. A closed <details> is display:none, so the
         markup inside also costs nothing to lay out. */
      h += '<details class="inst" data-inst="' + esc(inst.short) + '">' +
        '<summary class="inst-sum">' +
          '<span class="inst-n">' + pad(g + 1) + '</span>' +
          '<span class="inst-t">' + esc(inst.short) + '</span>' +
          '<span class="inst-c lbl">' + list.length + (list.length === 1 ? ' project' : ' projects') + '</span>' +
          '<span class="inst-state lbl" aria-hidden="true">Open</span>' +
          '<span class="disc-i" aria-hidden="true"></span>' +
        '</summary>' +
        '<div class="inst-body">' +
          '<div class="grid inst-meta">' +
            '<p class="c1-6 inst-full">' + esc(inst.full) + '</p>' +
            '<p class="body-sm c9-12 inst-note">' + esc(inst.note) + '</p>' +
          '</div>';

      /* An institution can name a category list — AIILSG uses its seven
         disciplines, SPA the academic sequence. Anything without one opens
         straight onto its project list, which is right for NIUA's three. */
      var catList = (inst.cats && typeof CATEGORY_SETS !== 'undefined')
        ? CATEGORY_SETS[inst.cats] : null;

      if (catList) {
        for (var c = 0; c < catList.length; c++) {
          var cat = catList[c];
          var sub = [];
          for (var z = 0; z < list.length; z++) if (list[z].cat === cat.key) sub.push(list[z]);

          /* A category with no project entry is still printed. Leaving it out
             made the sequence look incomplete — three semesters simply absent
             from the middle of a degree — when in fact the work exists and its
             documents are already in the Archive. It gets the same notice an
             archived project gets, and a way through to those documents. */
          var docs = archiveDocCount(cat.key, inst.short);

          h += '<details class="cat' + (sub.length ? '' : ' cat-empty') + '">' +
            '<summary class="cat-sum">' +
              '<span class="cat-n">' + pad(c + 1) + '</span>' +
              '<span class="cat-t">' + esc(cat.label) + '</span>' +
              '<span class="cat-c lbl">' + (sub.length ? sub.length
                  : (docs ? docs + ' docs' : '—')) + '</span>' +
              '<span class="disc-i" aria-hidden="true"></span>' +
            '</summary>';

          if (sub.length) {
            h += '<div class="idx">';
            for (var y = 0; y < sub.length; y++) { n++; h += planRow(sub[y], n); }
            h += '</div>';
          } else {
            h += '<div class="cat-note">' +
              '<p class="lbl arch-note-k">Project archive</p>' +
              '<p class="arch-note-t">Visuals being archived</p>' +
              '<p class="body-sm arch-note-b">Drawings from this semester are still being archived.' +
                (docs ? ' The written work is already in the Archive.' : '') + '</p>' +
              (docs ? '<a class="more cat-note-go" href="#/archive">' +
                        'See ' + docs + ' document' + (docs === 1 ? '' : 's') +
                        ' in the Archive <span aria-hidden="true">→</span></a>' : '') +
            '</div>';
          }
          h += '</details>';
        }
      } else {
        h += '<div class="idx">';
        for (var k = 0; k < list.length; k++) { n++; h += planRow(list[k], n); }
        h += '</div>';
      }
      h += '</div></details>';
    }
    return h + '</div>';
  }

  function viewPlanProject(slug) {
    var p = bySlug(PLAN_PROJECTS, slug);
    if (!p) return notFound();
    var nb = neighbours(PLAN_PROJECTS, slug);

    var h = crumb('#/plan', 'Planning index');
    h += '<div class="mast">' +
      '<div class="grid mast-top">' +
        '<p class="lbl c1-6"><span class="lbl--red">' + pad(nb.i + 1) + '</span> / ' + pad(PLAN_PROJECTS.length) + ' — Plan</p>' +
        '<p class="lbl c10-12 ta-r hide-sm">' + esc([p.year, p.place].filter(Boolean).join(' · ')) + '</p>' +
      '</div>' +
      '<div class="grid"><h1>' + esc(p.title) + '</h1></div>' +
      '<div class="grid mast-sub">' +
        '<p class="lede c1-6">' + esc(p.lede) + '</p>' +
        '<div class="c8-12"><dl class="facts" style="margin-top:0">' + factRows(p.facts) + '</dl></div>' +
      '</div>' +
    '</div>';

    /* Where a project has no artwork yet, the page states that plainly instead
       of leaving a hole. Drop a `cover` into the project and this disappears on
       its own — nothing else has to change. */
    if (p.cover) h += caseHero(p.cover, p.title + ' — key visual.', p.org || '');
    else h += archiveNote(p.film
          ? 'The film is below. Stills and documents from this project are still being archived.'
          : 'Drawings and documents from this project are still being archived.');

    h += '<div class="grid"><div class="c1-12">';
    h += chapter('Context', p.context);
    h += chapter('Role', p.role, p.roleLine);
    if (p.process) h += chapter('Process', p.process);
    h += '</div></div>';

    if (p.film) {
      h += '<div class="chap grid"><h2 class="c1-12">Film</h2></div>' +
        filmHero(p.film, p.title, p.category);
    }

    /* A project with no photograph yet still opens on something. The cover is
       drawn from the project's own metadata and nothing else — no stock image,
       no borrowed photograph, no invented visual. It is set as a drawing title
       block, which is what a DPR or a master plan sheet actually opens with,
       so the page reads as a document awaiting its drawings rather than as a
       gap. Pure CSS: no files, no weight, sharp at any size, follows the theme. */
    if (p.archived) h += archiveCover(p, nb.i + 1);

    if (p.archived) {
      h += '<div class="chap"><div class="grid">' +
        '<div class="c1-12 arch-note">' +
          '<p class="lbl arch-note-k">Project archive</p>' +
          '<p class="arch-note-t">Visuals being archived</p>' +
          '<p class="body-sm arch-note-b">Drawings and documents from this project are still being archived.</p>' +
        '</div></div></div>';
    }

    /* The project's own documents — drawings, sheets, report pages. */
    if (p.gallery && p.gallery.length) {
      var gp = pagesFromFolders(p.gallery);
      if (gp.length) {
        h += '<div class="chap"><div class="grid"><h2 class="c1-12">' +
             esc(p.galleryTitle || 'Documents') + '</h2></div>' + sheet(gp) + '</div>';
      }
    }

    /* A report per city, where the project studied more than one. A city with
       no document says so plainly instead of pointing at another city's. */
    if (p.cityReports && p.cityReports.length) {
      h += '<div class="chap"><div class="grid"><h2 class="c1-12">Reports</h2></div><div class="cities">';
      for (var ci = 0; ci < p.cityReports.length; ci++) {
        var cr = p.cityReports[ci];
        h += '<div class="city">' +
          '<span class="city-n lbl">' + pad(ci + 1) + '</span>' +
          '<span class="city-name">' + esc(cr.city) + '</span>' +
          (cr.href
            ? '<a class="city-go" href="' + esc(cr.href) + '" target="_blank" rel="noopener">' +
              'View full report' + (cr.pages ? ' — ' + cr.pages + ' pages' : '') +
              ' <span aria-hidden="true">↗</span></a>'
            : '<span class="city-none lbl">' + esc(cr.note || 'Report not available') + '</span>') +
        '</div>';
      }
      h += '</div></div>';
    }

    /* Offer the full document where one exists and is small enough to serve. */
    if (p.doc) {
      h += '<div class="grid sec-more"><a class="more c1-12" href="' + esc(p.doc.href) +
           '" target="_blank" rel="noopener">' + esc(p.doc.label) +
           ' <span aria-hidden="true">↗</span></a></div>';
    }

    if (p.designSlug) {
      var d = bySlug(DESIGN_PROJECTS, p.designSlug);
      if (d) {
        h += '<div class="chap"><div class="grid"><h2 class="c1-12">' + esc(p.slug === 'wuf11' ? 'Selected spreads' : 'Selected work') + '</h2></div>' +
          sheet(designPages(d).slice(0, 9)) + '</div>' +
          '<div class="grid sec-more"><a class="more c1-12" href="#/design/' + d.slug + '">See the full case study <span aria-hidden="true">→</span></a></div>';
      }
    }

    h += '<div class="grid" style="padding-top:var(--sec)">' + pager(nb.prev, nb.next, 'plan') + '</div>';
    return h;
  }

  /* The opening image of a case study. It used to be a 16:9 crop, which meant a
     portrait brochure cover arrived with its top and bottom cut off. Now the
     shape decides: wide work runs the full measure, tall work is centred in a
     column and capped by viewport height so the whole piece lands on one
     screen without scrolling. */
  function caseHero(src, alt, org) {
    var d = dimsFor(src) || { w: 16, h: 9 };
    var shape = shapeOf(d.w, d.h);
    return '<figure class="case-hero case-' + shape + ' rv">' +
      '<div class="case-hero-fig">' +
        pic({ src: src, alt: alt, eager: true,
              sizes: shape === 'tall' ? '(max-width:760px) 82vw, 42vw' : '(max-width:760px) 92vw, 80vw',
              attrs: ' style="aspect-ratio:' + d.w + '/' + d.h + '" data-lb="one" data-full="' +
                     esc(src) + '" data-cap="' + esc(alt) + '" data-cursor="ZOOM"' }) +
      '</div>' +
      '<figcaption class="grid" style="padding-top:10px">' +
        '<span class="lbl c1-6">' + esc(org) + '</span>' +
        '<span class="lbl c10-12 ta-r">Fig. 01</span>' +
      '</figcaption></figure>';
  }

  /* An intentional stand-in for work whose visuals have not been dug out yet.
     It is set in the same field-note language as the rest of the site so it
     reads as a state of the archive, not as a broken image. */
  function archiveNote(line) {
    return '<div class="arc-note grid rv">' +
      '<div class="c1-12 arc-note-in">' +
        '<span class="arc-mark" aria-hidden="true"></span>' +
        '<p class="arc-note-t">Project archive</p>' +
        '<p class="lbl">Visuals being archived</p>' +
        '<p class="body-sm arc-note-b">' + esc(line) + '</p>' +
      '</div>' +
    '</div>';
  }

  /* The title block. Everything on it is already established elsewhere on the
     page — organisation, discipline, tags, place — so it states nothing new
     and cannot drift out of step with the project it belongs to. */
  function archiveCover(p, n) {
    var inst = null;
    for (var i = 0; i < INSTITUTIONS.length; i++) {
      if (INSTITUTIONS[i].org === p.org) { inst = INSTITUTIONS[i]; break; }
    }
    var tags = (p.tags && p.tags.length) ? p.tags : (p.category ? [p.category] : []);

    return '<figure class="cover rv">' +
      '<div class="cover-in">' +

        '<div class="cover-top">' +
          '<span class="lbl">' + esc(inst ? inst.short : (p.org || '')) + '</span>' +
          '<span class="lbl">' + esc(p.place || '') + '</span>' +
        '</div>' +

        '<div class="cover-mid">' +
          '<span class="cover-n">' + pad(n) + '</span>' +
          '<h2 class="cover-t">' + esc(p.title) + '</h2>' +
        '</div>' +

        '<div class="cover-foot">' +
          '<span class="cover-disc lbl">' + esc(p.category || '') + '</span>' +
          '<span class="cover-tags">' +
            tags.map(function (t) { return '<span class="cover-tag lbl">' + esc(t) + '</span>'; }).join('') +
          '</span>' +
        '</div>' +

        /* Registration marks at the corners, as a drawing sheet carries. */
        '<span class="cover-reg cover-reg-tl" aria-hidden="true"></span>' +
        '<span class="cover-reg cover-reg-br" aria-hidden="true"></span>' +
      '</div>' +
      '<figcaption class="lbl cover-cap">Title block — drawings pending</figcaption>' +
    '</figure>';
  }

  function factRows(facts) {
    if (!facts) return '';
    var h = '';
    for (var i = 0; i < facts.length; i++) {
      h += '<div><dt>' + esc(facts[i][0]) + '</dt><dd>' + esc(facts[i][1]) + '</dd></div>';
    }
    return h;
  }

  function chapter(title, body, roleLine) {
    if (!body) return '';
    return '<section class="chap rv"><h2>' + esc(title) + '</h2>' +
      (roleLine ? '<p class="lede" style="margin-bottom:.8em">' + esc(roleLine) + '</p>' : '') +
      '<p class="body">' + esc(body) + '</p></section>';
  }

  /* ═════════════════════════════════════════════════════════════ DESIGN ══ */

  function viewDesignIndex() {
    var h = mast({
      kicker: '03 — Design',
      count: designTotal() + ' pieces',
      title: 'DESIGN',
      lede: 'Visual communication for public institutions — campaigns, publications, notices and identity.',
      note: designTotal() + ' pieces grouped into ' + DESIGN_PROJECTS.length + ' case studies. Most of it was made for Urban Local Bodies in Rajasthan, where a poster is a piece of public infrastructure.'
    });
    h += '<div class="idx">';
    for (var i = 0; i < DESIGN_PROJECTS.length; i++) {
      var p = DESIGN_PROJECTS[i];
      h += '<a class="idx-row rv" href="#/design/' + p.slug + '">' +
        '<span class="n">' + pad(i + 1) + '</span>' +
        '<span class="t">' + esc(p.title) + '</span>' +
        '<span class="m lbl">' + esc(p.category) + '</span>' +
        '<span class="y lbl">' + esc(p.year || '') + '</span>' +
        '<span class="go" aria-hidden="true">→</span>' +
      '</a>';
    }
    return h + '</div>';
  }

  function viewDesignProject(slug) {
    var p = bySlug(DESIGN_PROJECTS, slug);
    if (!p) return notFound();
    var nb = neighbours(DESIGN_PROJECTS, slug);
    var pages = designPages(p);

    var facts = [
      ['Client', p.client],
      ['Category', p.category],
      ['Year', p.year],
      ['Place', p.place],
      ['Role', p.roleLine],
      ['Pieces', designItems(p).length + (pages.length !== designItems(p).length ? ' — ' + pages.length + ' pages' : '')]
    ].filter(function (r) { return r[1]; });

    var h = crumb('#/design', 'Design index');
    h += '<div class="mast">' +
      '<div class="grid mast-top">' +
        '<p class="lbl c1-6"><span class="lbl--red">' + pad(nb.i + 1) + '</span> / ' + pad(DESIGN_PROJECTS.length) + ' — Design</p>' +
        '<p class="lbl c10-12 ta-r hide-sm">' + esc([p.year, p.place].filter(Boolean).join(' · ')) + '</p>' +
      '</div>' +
      '<div class="grid"><h1>' + esc(p.title) + '</h1></div>' +
      '<div class="grid mast-sub">' +
        '<p class="lede c1-6">' + esc(p.lede) + '</p>' +
        '<div class="c8-12"><dl class="facts" style="margin-top:0">' + factRows(facts) + '</dl></div>' +
      '</div>' +
    '</div>';

    if (pages[0]) h += caseHero(pages[0].page.f, pages[0].title + '.', pages[0].title);

    h += '<div class="grid"><div class="c1-12">';
    h += chapter('Context', p.context);
    h += chapter('Role', p.role, p.roleLine);
    if (p.process) h += chapter('Process', p.process);
    h += '</div></div>';

    h += '<div class="chap"><div class="grid"><h2 class="c1-12">The work</h2></div>' +
      sheet(pages.slice(1)) + '</div>';

    /* Further reading: the source document, a related photo story, the
       planning case behind the design. Each only appears if it exists. */
    if (p.doc) {
      h += '<div class="grid sec-more"><a class="more c1-12" href="' + esc(p.doc.href) +
        '" target="_blank" rel="noopener">' + esc(p.doc.label) + ' <span aria-hidden="true">↗</span></a></div>';
    }
    if (p.storySlug) {
      var st = storyBySlug(p.storySlug);
      if (st) {
        h += '<div class="grid sec-more"><a class="more c1-12" href="#/photography/' + p.storySlug +
          '">See the campaign photographed on the ground <span aria-hidden="true">→</span></a></div>';
      }
    }
    if (p.planSlug) {
      h += '<div class="grid sec-more"><a class="more c1-12" href="#/plan/' + p.planSlug +
        '">Read the planning case <span aria-hidden="true">→</span></a></div>';
    }

    h += '<div class="grid" style="padding-top:var(--sec)">' + pager(nb.prev, nb.next, 'design') + '</div>';
    return h;
  }

  /* The contact sheet. Every piece is shown whole, at its own proportion, and
     the column span is chosen so that the rendered height stays roughly even
     down the page: a 0.7 pamphlet on three columns and a 3:1 banner on twelve
     both come out around 450px tall. That is what stops the sheet from turning
     into a column of wildly different rectangles, without cropping anything.

     Clicking any piece opens it full size in the viewer — that is the deliberate
     zoom, rather than making the page itself carry an oversized image. */
  function sheet(pages) {
    var h = '<div class="sheet">';
    for (var i = 0; i < pages.length; i++) {
      var pg = pages[i].page;
      var shape = shapeOf(pg.w, pg.h);
      var label = pages[i].of > 1 ? pages[i].title + ' — page ' + pages[i].n + '/' + pages[i].of : pages[i].title;
      h += '<div class="sheet-item sh-' + shape + ' rv">' +
        '<figure>' + pic({ src: pg.f, alt: label, w: pg.w, h: pg.h,
          sizes: shape === 'tall'  ? '(max-width:420px) 92vw, (max-width:760px) 46vw, 23vw'
               : shape === 'pano'  ? '(max-width:760px) 92vw, 92vw'
               : shape === 'wide'  ? '(max-width:760px) 92vw, 46vw'
               : '(max-width:420px) 92vw, (max-width:760px) 46vw, 31vw',
          attrs: ' style="aspect-ratio:' + pg.w + '/' + pg.h + '"' +
                 ' data-full="' + esc(pg.f) + '" data-cap="' + esc(label) + '" data-lb="sheet" data-cursor="ZOOM"' }) +
        '</figure>' +
        '<span class="cap"><span class="lbl">' + esc(pages[i].title) + '</span>' +
        '<span class="lbl">' + (pages[i].of > 1 ? pad(pages[i].n) + '/' + pad(pages[i].of) : pad(i + 2)) + '</span></span>' +
      '</div>';
    }
    return h + '</div>';
  }

  /* ════════════════════════════════════════════════════════ PHOTOGRAPHY ══ */

  function viewPhotoIndex() {
    var h = mast({
      kicker: '04 — Photography',
      count: photoTotal() + ' photographs',
      title: 'ARCHIVE',
      lede: photoTotal() + ' photographs, cut into ' + PHOTO_STORIES.length + ' stories.',
      note: 'The archive is edited, not dumped. Each story is a sequence with a beginning and an end; open one and the frames arrive one at a time, at the size they were shot for.'
    });

    h += '<div class="stories">';
    for (var i = 0; i < PHOTO_STORIES.length; i++) {
      var st = PHOTO_STORIES[i];
      var fr = storyFrames(st);
      var cover = storyCover(st);
      if (!cover) continue;
      h += '<a class="story ' + st.weight + ' rv" href="#/photography/' + st.slug + '" data-cursor="OPEN">' +
        '<span class="story-hd">' +
          '<span class="story-n">' + pad(i + 1) + '</span>' +
          '<span class="story-t">' + esc(st.title) + '</span>' +
          '<span class="story-c lbl">' + esc(st.sub) + '</span>' +
        '</span>' +
        '<figure>' + pic({ src: cover.f, w: cover.w, h: cover.h,
          sizes: '(max-width:760px) 92vw, 44vw',
          alt: 'Opening frame of ' + st.title + ' — ' + st.tags.toLowerCase() + '.' }) + '</figure>' +
        '<span class="story-f"><span class="lbl">' + esc(st.tags) + '</span>' +
          '<span class="lbl lbl--red">' + pad(fr.length) + ' frames</span></span>' +
        '<span class="body-sm story-note">' + esc(st.note) + '</span>' +
      '</a>';
    }
    return h + '</div>';
  }

  function viewPhotoStory(slug) {
    var st = storyBySlug(slug);
    if (!st) return notFound();
    var fr = storyFrames(st);
    var nb = neighbours(PHOTO_STORIES, slug);

    var h = crumb('#/photography', 'Photography archive');
    h += '<div class="mast">' +
      '<div class="grid mast-top">' +
        '<p class="lbl c1-6"><span class="lbl--red">' + pad(nb.i + 1) + '</span> / ' + pad(PHOTO_STORIES.length) + ' — Story</p>' +
        '<p class="lbl c10-12 ta-r hide-sm">01 — ' + pad(fr.length) + '</p>' +
      '</div>' +
      '<div class="grid"><h1>' + esc(st.title) + '</h1></div>' +
      '<div class="grid mast-sub">' +
        '<div class="c1-6"><p class="lbl lbl--ink">' + esc(st.place || st.sub) + '</p>' +
          '<p class="lbl" style="margin-top:6px">' + esc(st.tags) + '</p></div>' +
        '<p class="body-sm c8-12">' + esc(st.note) + '</p>' +
      '</div>' +
    '</div>';

    /* The sequence. Layout is decided by each photograph's own proportion, not
       by its position in the list, so the page is paced the way a picture
       editor would pace it rather than as one column of equal rectangles:

         the opening frame  runs full measure, alone, as the way in
         panorama         full bleed
         landscape        large, alternating which margin it hangs from
         square           a medium block, inset
         two portraits    set side by side as a spread
         a lone portrait  narrow and offset, with the page left open beside it

       Nothing is cropped anywhere in here: every plate carries the frame's own
       aspect ratio. */
    var plate = function (p, i, cls, size) {
      var alt = 'Photograph ' + (i + 1) + ' of ' + fr.length + ' from “' + st.title +
                '” — ' + st.tags.toLowerCase() + '.';
      return '<figure class="plate-fig ' + cls + '">' +
        pic({ src: p.f, alt: alt, w: p.w, h: p.h, eager: i === 0, sizes: size,
              attrs: ' style="aspect-ratio:' + p.w + '/' + p.h + '"' +
                     ' data-lb="story" data-i="' + i + '" data-cursor="FULL"' }) +
        '<figcaption class="plate-cap">' +
          '<span class="lbl">' + esc(st.place || st.tags) + '</span>' +
          '<span class="lbl">' + pad(i + 1) + ' / ' + pad(fr.length) + '</span>' +
        '</figcaption>' +
      '</figure>';
    };

    h += '<div class="plates">';
    var big = 0;                       /* how many landscapes so far, for the swing */
    var lastWasPair = false;
    for (var i = 0; i < fr.length; i++) {
      var p = fr[i], r = p.w / p.h;
      var shape = r > 1.9 ? 'pano' : r > 1.15 ? 'land' : r < 0.87 ? 'port' : 'sq';

      if (i === 0) {
        h += '<div class="plate pl-open grid">' + plate(p, i, 'f-open', '92vw') + '</div>';
        continue;
      }

      /* Two portraits in a row become one spread rather than two lonely
         columns — which is what saves the portrait-heavy stories. But pairing
         at every opportunity just swaps one monotony for another: a story of
         twelve portraits came out as six identical two-ups. So a spread is
         never followed by a spread — the next portrait stands alone, offset,
         and the alternation itself becomes the rhythm. */
      var nx = fr[i + 1];
      if (shape === 'port' && !lastWasPair && nx && (nx.w / nx.h) < 0.87) {
        h += '<div class="plate pl-pair grid">' +
               plate(p, i, 'f-pair', '(max-width:760px) 46vw, 33vw') +
               plate(nx, i + 1, 'f-pair', '(max-width:760px) 46vw, 33vw') +
             '</div>';
        i++;
        lastWasPair = true;
        continue;
      }
      lastWasPair = false;

      if (shape === 'pano') {
        h += '<div class="plate pl-bleed grid">' + plate(p, i, 'f-bleed', '96vw') + '</div>';
      } else if (shape === 'land') {
        big++;
        /* Every third landscape takes the full measure, so the story keeps
           opening out instead of settling. */
        var cls = (big % 3 === 0) ? 'f-bleed' : (big % 2 ? 'f-large-l' : 'f-large-r');
        h += '<div class="plate ' + (cls === 'f-bleed' ? 'pl-bleed' : 'pl-large') + ' grid">' +
             plate(p, i, cls, cls === 'f-bleed' ? '96vw' : '(max-width:760px) 92vw, 76vw') + '</div>';
      } else if (shape === 'sq') {
        h += '<div class="plate pl-sq grid">' + plate(p, i, 'f-sq', '(max-width:760px) 92vw, 50vw') + '</div>';
      } else {
        h += '<div class="plate pl-port grid">' +
             plate(p, i, (i % 2 ? 'f-port-l' : 'f-port-r'), '(max-width:760px) 76vw, 34vw') + '</div>';
      }
    }
    h += '</div>';

    h += '<div class="grid" style="padding-top:var(--blk)">' + pager(nb.prev, nb.next, 'photography') + '</div>';

    /* Hand the viewer the frame list for this route. */
    LB.set(fr.map(function (p, i) {
      return { src: p.f, cap: (st.place || st.tags) + ' — ' + pad(i + 1) + ' / ' + pad(fr.length),
               alt: 'Photograph ' + (i + 1) + ' of ' + fr.length + ' from “' + st.title + '”.' };
    }), st.title);
    return h;
  }

  /* ═════════════════════════════════════════════════════════════ MOTION ══ */

  /* A title card, not a video still. The automatic YouTube thumbnail is whatever
     frame the encoder happened to land on — for these films that means burnt-in
     subtitles and a compression-smeared face. Setting the panel in type instead
     is both more honest and better looking, and it means the page makes no
     request to YouTube until someone actually asks to watch. */
  /* ── One film, one self-contained player ──────────────────────────────────
     The block owns everything it needs: its own poster, its own mount, its own
     play and fullscreen controls. Nothing is shared with the other films, so
     each is independently playable from a cold page and the order they are
     used in does not matter.

     The poster is YouTube's own default thumbnail for the video. */
  /* The single player. `data-film` says which film it currently holds; the
     poster is YouTube's own thumbnail for that film. */
  function ytThumb(id) {
    return '<img class="film-thumb" src="https://img.youtube.com/vi/' + esc(id) + '/maxresdefault.jpg" ' +
      'alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" ' +
      'onerror="this.onerror=null;this.src=\'https://img.youtube.com/vi/' + esc(id) + '/hqdefault.jpg\'">';
  }

  function filmPlayer(f) {
    return '' +
    '<div class="film-stage" id="filmStage" data-film="' + esc(f.id) + '">' +
      '<div class="film-mount"></div>' +
      '<button type="button" class="film-poster" data-play="' + esc(f.id) + '" aria-label="Play film">' +
        ytThumb(f.id) +
        '<span class="film-play" aria-hidden="true"><i></i>Play</span>' +
      '</button>' +
      '<div class="film-msg" aria-live="polite"></div>' +
    '</div>' +
    '<div class="film-bar">' +
      '<button type="button" class="film-btn" data-play="">Play</button>' +
      '<button type="button" class="film-btn" data-fs="">Fullscreen</button>' +
      '<a class="film-btn film-btn-out" id="filmOut" href="https://www.youtube.com/watch?v=' + esc(f.id) + '" ' +
         'target="_blank" rel="noopener">YouTube <span aria-hidden="true">↗</span></a>' +
    '</div>';
  }

  function filmHero(id, title, kind) {
    /* YouTube's own default thumbnail for the film, the same picture the Motion
       page uses, so the home preview and the player never disagree. */
    var poster =
      '<img src="https://img.youtube.com/vi/' + esc(id) + '/maxresdefault.jpg" ' +
        'alt="Thumbnail for ' + esc(title) + '." loading="lazy" decoding="async" ' +
        'referrerpolicy="no-referrer" ' +
        'onerror="this.onerror=null;this.src=\'https://img.youtube.com/vi/' + esc(id) + '/hqdefault.jpg\'">';

    return '<div class="film-hero rv" data-film="' + esc(id) + '" role="button" tabindex="0" ' +
      'aria-label="Play film: ' + esc(title) + '" data-cursor="PLAY">' +
      poster +
      '<div class="film-card">' +
        '<span class="film-kind lbl">' + esc(kind || 'Film') + '</span>' +
        '<span class="film-title">' + esc(title) + '</span>' +
        '<span class="play">Play</span>' +
      '</div>' +
      /* One element, three messages — whichever the hero's state selects. */
      '<div class="film-state" aria-live="polite">' +
        '<span class="s-load">Loading film…</span>' +
        '<span class="s-blocked">Tap the player to start</span>' +
        '<span class="s-error">Film unavailable — open on YouTube</span>' +
      '</div>' +
    '</div>';
  }

  function viewMotion() {
    var feature = FILMS[0];
    var h = mast({
      kicker: '05 — Motion',
      count: FILMS.length + ' films · ' + REEL_DATA.length + ' short cuts',
      title: 'MOTION',
      lede: 'Documentary, institutional film and short work — most of it grown out of planning research.',
      note: 'Nothing plays on its own. One film at a time, with sound, when you ask for it.'
    });

    /* Every film is its own player, in its own place on the page. There is no
       shared hero and no shared player object: clicking film five mounts film
       five where film five is, so nothing has to be played before anything
       else, and no film can be affected by the state of another. */
    /* One player, and a list. Picking any film loads it into that player —
       which is what this always should have been. What is different is that
       the player carries no state between films: each pick tears the old
       iframe out and builds a new one, so film five works on the first click
       whether or not anything has been played before it. */
    h += '<div class="chap">' +
      '<div class="grid"><h2 class="c1-12">Films</h2></div>' +
      filmPlayer(feature) +
      '<div class="grid film-meta">' +
        '<p class="lede c1-6" id="filmTitle">' + esc(feature.title) + '</p>' +
        '<p class="body-sm c8-12" id="filmNote">' + esc(feature.note || '') + '</p>' +
      '</div>' +
      '<div class="idx film-list">';
    for (var i = 0; i < FILMS.length; i++) {
      var f = FILMS[i];
      h += '<button type="button" class="idx-row film-pick' + (i === 0 ? ' is-current' : '') + '" ' +
              'data-pick="' + esc(f.id) + '" aria-label="Play ' + esc(f.title) + '">' +
        '<span class="n">' + pad(i + 1) + '</span>' +
        '<span class="t">' + esc(f.title) + '</span>' +
        '<span class="m lbl">' + esc(f.kind) + '</span>' +
        '<span class="go" aria-hidden="true">▶</span>' +
      '</button>';
    }
    h += '</div></div>';

    h += '<div class="chap"><div class="grid"><h2 class="c1-12">Short cuts — ' + REEL_DATA.length + '</h2></div>' +
      '<div class="reels">';
    for (var r = 0; r < REEL_DATA.length; r++) {
      var re = REEL_DATA[r];
      /* A real control, not a div that happens to react to hover: it is
         focusable, announces itself, and works from a click, a tap or the
         keyboard. Hover preview is an extra on top, never the only way in. */
      h += '<div class="reel" data-reel="' + esc(re.file) + '" data-poster="' + esc(re.poster) + '" ' +
           'role="button" tabindex="0" aria-label="Play short cut ' + pad(r + 1) + ' — ' + esc(re.category) + '">' +
        '<div class="reel-fig">' + pic({ src: re.poster, alt: re.title, w: 540, h: 960 }) +
          '<span class="reel-play" aria-hidden="true"></span>' +
        '</div>' +
        '<span class="cap"><span class="lbl">' + esc(re.category) + '</span>' +
        '<span class="lbl">' + pad(r + 1) + '</span></span>' +
      '</div>';
    }
    h += '</div><p class="lbl" style="padding-top:12px">Scroll sideways — hover or tap a frame to preview.</p></div>';
    return h;
  }

  /* ════════════════════════════════════════════════════════════ ARCHIVE ══ */

  /* Every document in the collection, grouped and readable in full. This is a
     reference shelf rather than a portfolio page: the case studies elsewhere
     make the argument, and this is where someone who wants the evidence goes. */
  function viewArchive() {
    var docs = 0, pages = 0;
    for (var g = 0; g < ARCHIVE.length; g++) {
      docs += ARCHIVE[g].items.length;
      for (var k = 0; k < ARCHIVE[g].items.length; k++) pages += ARCHIVE[g].items[k].pages;
    }

    var h = mast({
      kicker: '08 — Archive',
      count: docs + ' documents · ' + pages + ' pages',
      title: 'ARCHIVE',
      lede: 'Every report, studio document and deck, readable in full.',
      note: 'Professional reporting under Swachh Bharat Mission, then five years of planning studio at SPA New Delhi, semester by semester. Semesters are as the documents state them where they state them; the rest are placed by date and subject.'
    });

    /* Two levels: the institution, then the groups inside it. Each group is a
       <details>, closed by default — which is both the "do not show hundreds of
       pages at once" requirement and the loading one, since a closed <details>
       is display:none and its covers are never fetched. Native element, so it
       keeps keyboard and screen-reader behaviour for free. */
    var order = [], seen = {};
    for (var a = 0; a < ARCHIVE.length; a++) {
      var key = ARCHIVE[a].inst || 'Other';
      if (!seen[key]) { seen[key] = []; order.push(key); }
      seen[key].push(ARCHIVE[a]);
    }

    for (var o = 0; o < order.length; o++) {
      var instName = order[o], groups = seen[instName];
      var iDocs = 0, iPages = 0;
      for (var q = 0; q < groups.length; q++) {
        iDocs += groups[q].items.length;
        for (var r = 0; r < groups[q].items.length; r++) iPages += groups[q].items[r].pages;
      }

      h += '<section class="arc-inst">' +
        '<div class="grid arc-inst-hd">' +
          '<p class="sec-ix c1-12"><span>' + pad(o + 1) + '</span> / ' + pad(order.length) + '</p>' +
          '<h2 class="c1-6 inst-t">' + esc(instName) + '</h2>' +
          '<p class="lbl c9-12 ta-r">' + iDocs + ' documents · ' + iPages + ' pages</p>' +
        '</div>';

      for (var g2 = 0; g2 < groups.length; g2++) {
        var grp = groups[g2];
        var gPages = 0;
        for (var s2 = 0; s2 < grp.items.length; s2++) gPages += grp.items[s2].pages;

        h += '<details class="arc-grp">' +
          '<summary class="arc-sum">' +
            '<span class="arc-sum-t">' + esc(grp.label) + '</span>' +
            '<span class="arc-sum-m lbl">' + esc(grp.meta) + '</span>' +
            '<span class="arc-sum-c lbl">' + grp.items.length + ' docs · ' + gPages + ' pp</span>' +
            '<span class="arc-sum-i" aria-hidden="true"></span>' +
          '</summary>' +
          '<div class="arc-grp-in">' +
            '<p class="body-sm arc-grp-n">' + esc(grp.note) + '</p>' +
            '<div class="arc-docs">';

        for (var j = 0; j < grp.items.length; j++) {
          var it = grp.items[j];
          h += '<a class="arc-doc" href="docs/' + esc(it.stem) + '.pdf" target="_blank" rel="noopener" ' +
               'data-cursor="READ" aria-label="' + esc(it.title + ' — open the full document, ' + it.pages + ' pages') + '">' +
            '<span class="arc-doc-fig">' +
              '<picture>' +
                '<source type="image/webp" srcset="images/doc-covers/' + esc(it.stem) + '.webp">' +
                '<img src="images/doc-covers/' + esc(it.stem) + '.jpg" alt="Cover of ' + esc(it.title) + '" ' +
                     'width="' + it.w + '" height="' + it.h + '" loading="lazy" decoding="async">' +
              '</picture>' +
            '</span>' +
            '<span class="arc-doc-body">' +
              '<span class="arc-doc-t">' + esc(it.title) + '</span>' +
              (it.note ? '<span class="arc-doc-n">' + esc(it.note) + '</span>' : '') +
              '<span class="arc-doc-m lbl">' + it.pages + ' pages · ' + it.mb + ' MB' +
                (it.src === 'stated' ? ' · semester stated in document' : '') + '</span>' +
              '<span class="arc-doc-go">Read the full document <span aria-hidden="true">↗</span></span>' +
            '</span>' +
          '</a>';
        }
        h += '</div></div></details>';
      }
      h += '</section>';
    }
    return h;
  }

  /* ══════════════════════════════════════════════════════════════ ABOUT ══ */

  function viewAbout() {
    var h = mast({
      kicker: '06 — About',
      count: 'Jodhpur, Rajasthan',
      title: 'AATISH KUMAR',
      lede: 'Urban planner. Visual storyteller.',
      note: SITE.intro
    });

    h += '<div class="grid" style="row-gap:var(--blk)">' +
      '<div class="c1-6">';
    for (var i = 0; i < ABOUT_BODY.length; i++) {
      h += '<p class="' + (i === 0 ? 'lede' : 'body') + '" style="margin-top:' + (i ? '1.1em' : '0') + '">' +
        esc(ABOUT_BODY[i]) + '</p>';
    }
    h += '</div>' +
      /* The identity photograph. This slot used to hold a frame from the
         archive — a portrait of somebody else, which is the wrong thing to put
         where a reader is looking for the author. */
      '<figure class="c8-12 rv">' +
        pic({ src: 'images/aatish-portrait.jpg', w: 1024, h: 1024,
              sizes: '(max-width:760px) 92vw, 30vw',
              alt: 'Aatish Kumar, photographed beside an urban design model.',
              attrs: ' class="portrait"' }) +
        '<figcaption class="lbl" style="padding-top:10px">Aatish Kumar</figcaption></figure>' +
    '</div>';

    h += '<div class="chap"><div class="grid"><h2 class="c1-12">Path</h2></div><div class="tl">';
    for (var t = 0; t < TIMELINE.length; t++) {
      h += '<div class="tl-row rv"><span class="k lbl">' + esc(TIMELINE[t].k) + '</span>' +
        '<span class="t">' + esc(TIMELINE[t].t) + '</span>' +
        '<span class="d body-sm" style="max-width:none">' + esc(TIMELINE[t].d) + '</span></div>';
    }
    h += '</div></div>';

    h += '<div class="chap"><div class="grid"><h2 class="c1-12">Capabilities</h2></div><div class="caps">';
    for (var c = 0; c < CAPABILITIES.length; c++) {
      h += '<div class="rv"><h3>' + esc(CAPABILITIES[c].g) + '</h3><ul>';
      for (var k = 0; k < CAPABILITIES[c].items.length; k++) {
        h += '<li>' + esc(CAPABILITIES[c].items[k]) + '</li>';
      }
      h += '</ul></div>';
    }
    h += '</div></div>';

    /* Tools, set as a route rather than a résumé list: the four stages a
       project passes through, with the software named under each. Type only —
       a wall of vendor logos would wreck the page and say less. */
    h += '<div class="chap"><div class="grid"><h2 class="c1-12">Tools</h2></div>' +
         '<p class="lbl tools-route">Map <span aria-hidden="true">→</span> Design ' +
         '<span aria-hidden="true">→</span> Document <span aria-hidden="true">→</span> Image ' +
         '<span aria-hidden="true">→</span> Film</p>' +
         '<div class="tools">';
    for (var t = 0; t < TOOLS.length; t++) {
      h += '<div class="tool rv">' +
        '<span class="tool-n lbl">' + pad(t + 1) + '</span>' +
        '<h3>' + esc(TOOLS[t].g) + '</h3>' +
        '<p class="lbl tool-sub">' + esc(TOOLS[t].sub) + '</p>' +
        '<ul>';
      for (var ti = 0; ti < TOOLS[t].items.length; ti++) {
        h += '<li>' + esc(TOOLS[t].items[ti]) + '</li>';
      }
      h += '</ul></div>';
    }
    h += '</div></div>';

    h += '<div class="grid sec-more"><a class="more c1-6" href="' + SITE.cv +
      '" target="_blank" rel="noopener">Full CV <span aria-hidden="true">↗</span></a>' +
      '<a class="more c7-12 ta-r" href="#/contact">Get in touch <span aria-hidden="true">→</span></a></div>';
    return h;
  }

  /* ════════════════════════════════════════════════════════════ CONTACT ══ */

  function viewContact() {
    return mast({
      kicker: '07 — Contact',
      count: '26°14′ N / 73°01′ E',
      title: 'SAY HELLO',
      lede: 'Planning, design, photography, film — or some combination that does not have a name yet.',
      note: 'Based in Jodhpur, Rajasthan. Available for urban planning and research assignments, IEC and campaign work, editorial photography and documentary.'
    }) +
    '<div class="grid" style="row-gap:var(--blk);padding-bottom:var(--sec)">' +
      '<ul class="c1-6 ft-links" style="border-top:1px solid var(--ink);padding-top:16px">' +
        '<li><a href="mailto:' + SITE.email + '">' + SITE.email + '<span aria-hidden="true"> ↗</span></a></li>' +
        '<li><a href="' + SITE.instagram + '" target="_blank" rel="noopener">Instagram<span aria-hidden="true"> ↗</span></a></li>' +
        '<li><a href="' + SITE.linkedin + '" target="_blank" rel="noopener">LinkedIn<span aria-hidden="true"> ↗</span></a></li>' +
        '<li><a href="' + SITE.cv + '" target="_blank" rel="noopener">CV<span aria-hidden="true"> ↗</span></a></li>' +
      '</ul>' +
      '<dl class="facts c8-12" style="margin-top:0">' +
        factRows([['Based', SITE.base], ['Coordinates', SITE.coords.join(' / ')], ['Practices', 'Planning · Design · Photography · Film']]) +
      '</dl>' +
    '</div>';
  }

  function notFound() {
    return mast({
      kicker: 'Error — 404',
      title: 'NOT HERE',
      lede: 'That page is not part of this site.',
      note: 'Try the work index, the photography archive, or the planning index.'
    }) + '<div class="grid sec-more"><a class="more c1-12" href="#/">Back to selected work <span aria-hidden="true">→</span></a></div>';
  }

  /* ═════════════════════════════════════════════════════════════ ROUTER ══ */

  var home = $('#home'), view = $('#view'), nav = $('#nav');

  var ROUTES = [
    { re: /^\/?$/,                    key: 'home' },
    { re: /^\/plan$/,                 key: 'plan',        fn: viewPlanIndex },
    { re: /^\/plan\/(.+)$/,           key: 'plan',        fn: viewPlanProject },
    { re: /^\/design$/,               key: 'design',      fn: viewDesignIndex },
    { re: /^\/design\/(.+)$/,         key: 'design',      fn: viewDesignProject },
    { re: /^\/photography$/,          key: 'photography', fn: viewPhotoIndex },
    { re: /^\/photography\/(.+)$/,    key: 'photography', fn: viewPhotoStory },
    { re: /^\/motion$/,               key: 'motion',      fn: viewMotion },
    { re: /^\/archive$/,              key: 'archive',     fn: viewArchive },
    { re: /^\/about$/,                key: 'about',       fn: viewAbout },
    { re: /^\/contact$/,              key: 'contact',     fn: viewContact }
  ];

  /* The previous site was one page with plain anchors, so links shared before
     this rebuild look like "#about" or "#reels". Send them somewhere sensible
     instead of the 404 page. Replaces the entry so Back still leaves the site
     rather than bouncing off the old anchor. */
  var LEGACY = {
    /* sbm-urban was the generic SBM entry before the IEC work was split into
       one project per Urban Local Body. It is live on the deployed site, so the
       old address still has to land somewhere sensible. */
    '#/plan/sbm-urban': '#/plan/chittorgarh-iec',
    '#top': '#/', '#about': '#/about', '#work': '#/photography',
    '#design': '#/design', '#motion': '#/motion', '#reels': '#/motion',
    '#sound': '#/motion', '#contact': '#/contact'
  };
  function redirectLegacy() {
    var to = LEGACY[location.hash.toLowerCase()];
    if (!to) return false;
    location.replace(location.pathname + location.search + to);
    return true;
  }

  var lastPath = null;

  function route() {
    if (redirectLegacy()) return;
    var path = location.hash.replace(/^#/, '') || '/';
    if (path === lastPath) return;
    lastPath = path;

    LB.close();
    LB.set([], '');
    stopFilms();

    var match = null, arg = null;
    for (var i = 0; i < ROUTES.length; i++) {
      var m = path.match(ROUTES[i].re);
      if (m) { match = ROUTES[i]; arg = m[1]; break; }
    }
    if (!match) { match = { key: '404', fn: notFound }; }

    if (match.key === 'home') {
      view.hidden = true;
      view.innerHTML = '';
      home.hidden = false;
      ensureHome();
    } else {
      home.hidden = true;
      view.innerHTML = '<div class="view-in">' + match.fn(arg) + '</div>';
      view.hidden = false;
    }

    /* Mark the section, not the exact page — a project page still belongs to
       its index as far as the navigation is concerned. */
    $$('a[data-route]', nav).forEach(function (a) {
      if (a.getAttribute('data-route') === match.key) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    document.title = titleFor(match.key, arg);
    window.scrollTo(reduceMotion ? { top: 0 } : { top: 0, behavior: 'instant' });
    observeReveals();
    closeDrawer();
  }

  function titleFor(key, arg) {
    var base = ' — Aatish Kumar | DigBig Studio';
    if (key === 'home') return 'Aatish Kumar — Urban Planner & Visual Storyteller | DigBig Studio';
    if (key === 'plan' && arg) { var p = bySlug(PLAN_PROJECTS, arg); if (p) return p.title + base; }
    if (key === 'design' && arg) { var d = bySlug(DESIGN_PROJECTS, arg); if (d) return d.title + base; }
    if (key === 'photography' && arg) { var s = storyBySlug(arg); if (s) return s.title + base; }
    return key.charAt(0).toUpperCase() + key.slice(1) + base;
  }

  /* ════════════════════════════════════════════════════════════ VIEWER ══ */

  var LB = (function () {
    var el = $('#lb'), img = $('#lbImg'), cap = $('#lbCap'),
        ttl = $('#lbTitle'), cnt = $('#lbCount');
    var frames = [], title = '', at = 0, lastFocus = null;

    function paint() {
      var f = frames[at];
      if (!f) return;
      img.src = f.src;
      img.alt = f.alt || '';
      cap.textContent = f.cap || '';
      cnt.textContent = pad(at + 1) + ' / ' + pad(frames.length);
      $('#lbPrev').disabled = frames.length < 2;
      $('#lbNext').disabled = frames.length < 2;
    }
    function open(i) {
      if (!frames.length) return;
      at = Math.max(0, Math.min(i || 0, frames.length - 1));
      lastFocus = document.activeElement;
      ttl.textContent = title;
      paint();
      el.hidden = false;
      document.body.style.overflow = 'hidden';
      $('#lbClose').focus();
    }
    function close() {
      if (el.hidden) return;
      el.hidden = true;
      img.removeAttribute('src');
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    function step(d) {
      if (frames.length < 2) return;
      at = (at + d + frames.length) % frames.length;
      paint();
    }

    $('#lbClose').addEventListener('click', close);
    $('#lbPrev').addEventListener('click', function () { step(-1); });
    $('#lbNext').addEventListener('click', function () { step(1); });
    el.addEventListener('click', function (e) {
      if (e.target === el || e.target.classList.contains('lb-fig')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (el.hidden) return;
      if (e.key === 'Escape') { close(); }
      else if (e.key === 'ArrowLeft') { step(-1); }
      else if (e.key === 'ArrowRight') { step(1); }
      else if (e.key === 'Tab') {
        /* Keep focus inside the dialog while it is open. */
        var f = $$('button:not([disabled])', el);
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    /* Swipe: horizontal to move, vertical to dismiss. */
    var sx = 0, sy = 0;
    el.addEventListener('touchstart', function (e) {
      sx = e.touches[0].clientX; sy = e.touches[0].clientY;
    }, { passive: true });
    el.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
      else if (dy < -70) close();
    }, { passive: true });

    return {
      set: function (list, name) { frames = list || []; title = name || ''; at = 0; },
      one: function (src, capText, altText, name) {
        frames = [{ src: src, cap: capText, alt: altText }];
        title = name || '';
        open(0);
      },
      open: open,
      close: close
    };
  })();

  /* ═══════════════════════════════════════════════════════════ BEHAVIOUR ══ */

  /* Click delegation — one listener for the whole document. */
  document.addEventListener('click', function (e) {
    var lb = e.target.closest ? e.target.closest('[data-lb]') : null;
    if (lb) {
      e.preventDefault();
      if (lb.getAttribute('data-lb') === 'story') LB.open(parseInt(lb.getAttribute('data-i'), 10));
      else LB.one(lb.getAttribute('data-full'), lb.getAttribute('data-cap'), lb.alt, 'Design');
      return;
    }
    /* Fullscreen first: it sits inside a film block, so it has to be matched
       before the play handler claims the click. */
    var fsBtn = e.target.closest ? e.target.closest('[data-fs]') : null;
    if (fsBtn) { e.preventDefault(); goFullscreen(fsBtn.getAttribute('data-fs')); return; }

    var pick = e.target.closest ? e.target.closest('[data-pick]') : null;
    if (pick) { e.preventDefault(); selectFilm(pick.getAttribute('data-pick')); return; }

    var playBtn = e.target.closest ? e.target.closest('[data-play]') : null;
    if (playBtn) {
      e.preventDefault();
      var stage = $('#filmStage');
      mountFilm(playBtn.getAttribute('data-play') ||
                (stage && stage.getAttribute('data-film')));
      return;
    }

    /* The old single-hero player, still used by the home page preview. */
    var film = e.target.closest ? e.target.closest('.film-hero[data-film]') : null;
    if (film) { e.preventDefault(); playFilm(film); return; }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var film = e.target.closest ? e.target.closest('.film-hero[data-film]') : null;
    if (film) { e.preventDefault(); playFilm(film); }
  });

  /* ── Independent film players ─────────────────────────────────────────────
     One iframe per film, mounted into that film's own block. Deliberately a
     plain iframe rather than the YouTube IFrame API: the API keeps a single
     player object, and a single player object is exactly what made films two
     through seven depend on film one having been played first. A plain iframe
     has no shared state to get into a bad order. */
  /* Load a film into the single player. Every call rebuilds the iframe from
     scratch — that is the whole fix. The previous version kept one YT.Player
     object alive and swapped its source, and a player that had never been
     created could not be swapped, which is why nothing worked until film one
     had been played. There is no object to be in the wrong state now. */
  function mountFilm(id) {
    var block = $('#filmStage');
    if (!block || !id) return;

    stopOtherMedia(null);          // a film starting silences the short cuts

    var mount = block.querySelector('.film-mount');
    if (!mount) return;

    block.setAttribute('data-film', id);
    setActiveFilm(id);

    var msg = block.querySelector('.film-msg');
    if (msg) msg.textContent = 'Loading…';

    var frame = document.createElement('iframe');
    frame.src = 'https://www.youtube-nocookie.com/embed/' + id +
                '?autoplay=1&playsinline=1&rel=0&modestbranding=1';
    frame.title = 'Film player';
    frame.setAttribute('frameborder', '0');
    frame.setAttribute('allow',
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen');
    frame.setAttribute('allowfullscreen', '');       // the YouTube control needs this
    frame.addEventListener('load', function () { if (msg) msg.textContent = ''; });

    mount.innerHTML = '';
    mount.appendChild(frame);
    block.classList.add('is-playing');
  }

  /* Fullscreen on the stage, so the picture and YouTube's own controls both go
     full-screen together. iOS Safari does not implement the element Fullscreen
     API on arbitrary elements, so it falls back to the webkit method and then
     to opening the film on YouTube, which does go fullscreen there. */
  function goFullscreen(id) {
    var stage = $('#filmStage');
    if (!stage) return;
    id = id || stage.getAttribute('data-film');
    if (!stage.classList.contains('is-playing')) mountFilm(id);

    var req = stage.requestFullscreen || stage.webkitRequestFullscreen ||
              stage.webkitRequestFullScreen || stage.msRequestFullscreen;
    if (req) {
      try {
        var r = req.call(stage);
        if (r && r.catch) r.catch(function () { fullscreenFallback(id); });
        return;
      } catch (e) { /* fall through */ }
    }
    fullscreenFallback(id);
  }

  function fullscreenFallback(id) {
    var stage = $('#filmStage');
    var msg = stage && stage.querySelector('.film-msg');
    if (msg) msg.textContent = 'Fullscreen is not available here — opening on YouTube';
    window.open('https://www.youtube.com/watch?v=' + id, '_blank', 'noopener');
  }

  /* Picking a film from the list: load it, and bring the title, the outbound
     link and the highlighted row along with it. */
  function selectFilm(id) {
    var f = null;
    for (var i = 0; i < FILMS.length; i++) if (FILMS[i].id === id) { f = FILMS[i]; break; }

    var stage = $('#filmStage');
    if (stage) {
      var poster = stage.querySelector('.film-poster');
      if (poster) poster.setAttribute('data-play', id);
      var thumb = stage.querySelector('.film-thumb');
      if (thumb) thumb.src = 'https://img.youtube.com/vi/' + id + '/maxresdefault.jpg';
    }
    if (f) {
      setText('#filmTitle', f.title);
      setText('#filmNote', f.note || '');
      var out = $('#filmOut');
      if (out) out.href = 'https://www.youtube.com/watch?v=' + id;
    }
    $$('.film-pick').forEach(function (b) {
      b.classList.toggle('is-current', b.getAttribute('data-pick') === id);
    });

    mountFilm(id);

    /* Keep the player on screen, instantly — a smooth scroll here is what used
       to make the following click land on the wrong element. */
    if (stage) {
      var box = stage.getBoundingClientRect();
      if (box.top < 0 || box.bottom > window.innerHeight) {
        stage.scrollIntoView({ behavior: 'auto', block: 'center' });
      }
    }
  }

  /* ── Films ────────────────────────────────────────────────────────────────
     Two things were wrong here and both are fixed by the same rewrite.

     1. Switching films tore the iframe out and built a new one, then called
        scrollIntoView with smooth behaviour. That animation takes half a second
        during which the whole page is sliding under the pointer, so the next
        click landed on whatever had moved into that spot — often the player
        itself, which just toggles YouTube's own pause. The film appeared not to
        change while the previous soundtrack carried on. Switching now goes
        through the player API instead: loadVideoById swaps the source and the
        picture in one operation, so an old soundtrack over a new picture is not
        a state the player can be in. Any scrolling is instant and only happens
        when the player is actually off-screen.

     2. On iOS the embed was mounted with autoplay=1 and nothing happened —
        no picture, no sound — because mobile Safari refuses unmuted autoplay
        and the old code had no way of knowing. The API reports state, so a clip
        that will not start on its own now says "Tap to play" instead of sitting
        there dead. */

  var YT_API = 'https://www.youtube.com/iframe_api';
  var ytState = 'idle';     // idle | loading | ready | failed
  var ytQueue = [];
  var player = null;
  var playerReady = false;
  var pendingId = null;

  function ytReady(cb) {
    if (ytState === 'ready') return cb(true);
    if (ytState === 'failed') return cb(false);
    ytQueue.push(cb);
    if (ytState === 'loading') return;
    ytState = 'loading';

    var done = function (ok) {
      ytState = ok ? 'ready' : 'failed';
      var q = ytQueue; ytQueue = [];
      q.forEach(function (fn) { fn(ok); });
    };
    /* If the API is blocked we must not hang forever showing a spinner. */
    var timer = setTimeout(function () { if (ytState === 'loading') done(false); }, 8000);
    window.onYouTubeIframeAPIReady = function () { clearTimeout(timer); done(true); };

    var s = document.createElement('script');
    s.src = YT_API;
    s.async = true;
    s.onerror = function () { clearTimeout(timer); done(false); };
    document.head.appendChild(s);
  }

  function heroState(hero, state) {
    hero.classList.remove('is-loading', 'is-error', 'is-blocked');
    if (state) hero.classList.add(state);
  }

  function setActiveFilm(id) {
    $$('.idx-row[data-film]').forEach(function (r) {
      if (r.getAttribute('data-film') === id) r.setAttribute('aria-current', 'true');
      else r.removeAttribute('aria-current');
    });
    var film = null;
    for (var i = 0; i < FILMS.length; i++) if (FILMS[i].id === id) { film = FILMS[i]; break; }
    if (!film) return;
    var t = $('#filmTitle'), n = $('#filmNote'), k = $('#filmKind');
    if (t) t.textContent = film.title;
    if (n) n.textContent = film.note;
    if (k) k.textContent = film.kind;
    var fb = $('.film-fallback');
    if (fb) fb.href = 'https://www.youtube.com/watch?v=' + id;
  }

  /* The plain-embed path, used when the API cannot be reached at all. */
  function mountPlainEmbed(hero, id) {
    var mount = hero.querySelector('.film-mount');
    if (!mount) return;
    mount.innerHTML = '';
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + id +
            '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
    f.title = 'Film player';
    f.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    mount.appendChild(f);
    heroState(hero, null);
  }

  function playFilm(el) {
    var id = el.getAttribute('data-film');
    if (!id) return;
    var hero = el.classList.contains('film-hero') ? el : $('.film-hero');
    if (!hero) return;

    stopOtherMedia(null);          // a film starting silences every short cut
    setActiveFilm(id);

    /* Bring the player into view BEFORE anything mounts, and do it instantly.
       The smooth version is what caused clicks to land on the wrong element. */
    var box = hero.getBoundingClientRect();
    if (box.top < 0 || box.bottom > window.innerHeight) {
      hero.scrollIntoView({ behavior: 'auto', block: 'center' });
    }

    var card = hero.querySelector('.film-card');
    if (card) card.remove();
    hero.removeAttribute('data-cursor');
    hero.classList.add('is-playing');
    heroState(hero, 'is-loading');

    if (!hero.querySelector('.film-mount')) {
      var m = document.createElement('div');
      m.className = 'film-mount';
      hero.appendChild(m);
    }
    if (!hero.querySelector('.film-fallback')) {
      var fb = document.createElement('a');
      fb.className = 'film-fallback';
      fb.href = 'https://www.youtube.com/watch?v=' + id;
      fb.target = '_blank'; fb.rel = 'noopener';
      fb.innerHTML = '<span class="lbl" data-role="msg">Loading the film</span>' +
                     '<span class="film-fallback-go">Watch on YouTube <span aria-hidden="true">↗</span></span>';
      hero.appendChild(fb);
    }

    /* Already have a live player: one call swaps source and picture together. */
    if (player && playerReady) {
      try { player.loadVideoById(id); return; } catch (e) { /* fall through */ }
    }
    pendingId = id;

    ytReady(function (ok) {
      if (!ok) { mountPlainEmbed(hero, pendingId || id); return; }
      if (player && playerReady) { try { player.loadVideoById(pendingId || id); } catch (e) {} return; }

      var mount = hero.querySelector('.film-mount');
      if (!mount) return;
      mount.innerHTML = '<div id="ytplayer"></div>';
      try {
        player = new YT.Player('ytplayer', {
          videoId: pendingId || id,
          playerVars: { autoplay: 1, rel: 0, modestbranding: 1, playsinline: 1 },
          host: 'https://www.youtube-nocookie.com',
          events: {
            onReady: function (e) {
              playerReady = true;
              heroState(hero, null);
              try { e.target.playVideo(); } catch (err) {}
              /* Mobile refuses unmuted autoplay. If nothing is running shortly
                 after ready, say so rather than showing a dead rectangle. */
              setTimeout(function () {
                try {
                  if (e.target.getPlayerState && e.target.getPlayerState() !== 1) {
                    heroState(hero, 'is-blocked');
                  }
                } catch (err) {}
              }, 1400);
            },
            onStateChange: function (e) {
              // 1 playing, 3 buffering, -1 unstarted, 2 paused, 0 ended
              if (e.data === 1) heroState(hero, null);
              else if (e.data === 3) heroState(hero, 'is-loading');
              else if (e.data === -1) heroState(hero, 'is-blocked');
            },
            onError: function () {
              heroState(hero, 'is-error');
              var msg = hero.querySelector('[data-role="msg"]');
              if (msg) msg.textContent = 'This film could not be played here';
            }
          }
        });
      } catch (e) {
        mountPlainEmbed(hero, pendingId || id);
      }
    });
  }

  function stopFilms() {
    if (player && playerReady) { try { player.stopVideo(); } catch (e) {} }
    $$('.film-mount').forEach(function (m) { m.innerHTML = ''; });
    $$('.film-fallback').forEach(function (f) { f.remove(); });
    $$('.film-hero').forEach(function (h) {
      h.classList.remove('is-playing', 'is-loading', 'is-error', 'is-blocked');
    });
    $$('.idx-row[data-film]').forEach(function (r) { r.removeAttribute('aria-current'); });
    player = null; playerReady = false;
  }

  /* Reels: no src until the pointer arrives, and it is dropped on the way out
     so seventeen clips never sit in memory at once. */
  /* Only one thing is ever allowed to be making noise. Starting anything stops
     everything else — the other clips and the film player both. */
  function stopOtherMedia(except) {
    $$('.reel').forEach(function (r) {
      if (r === except) return;
      r.classList.remove('pinned', 'muted-fallback');
      reelOff(r);
    });
  }

  /* `sound` is true only when the visitor actually asked for this clip by
     clicking or tapping it. A hover preview stays silent — nobody wants audio
     to start because a cursor crossed a thumbnail — but a deliberate play gets
     the audio the clip was shot with. */
  function reelOn(reel, sound) {
    var existing = reel.querySelector('video');
    if (existing) {
      if (sound) { existing.muted = false; existing.removeAttribute('muted');
                   existing.volume = 1; existing.play().catch(function () {}); }
      return;
    }
    var poster = reel.getAttribute('data-poster') || '';
    var v = document.createElement('video');

    /* Attributes, not just properties. Setting v.muted / v.playsInline alone is
       unreliable in Safari and in iOS web views: if `muted` has not landed by
       the time play() is called the clip is blocked outright, and without
       `playsinline` iOS yanks it fullscreen. Both must be on the element
       before the source is attached. */
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    v.setAttribute('aria-hidden', 'true');
    v.loop = true; v.playsInline = true; v.preload = 'metadata';

    if (sound) {
      /* A click is a user gesture, so unmuted playback is permitted. */
      v.muted = false; v.volume = 1;
    } else {
      /* Silent preview. muted is set as an attribute as well as a property —
         as a property alone Safari and iOS apply it late or not at all, which
         is how a hover once started making noise. volume 0 is the backstop. */
      v.setAttribute('muted', '');
      v.muted = true; v.defaultMuted = true; v.volume = 0;
    }
    if (poster) v.poster = poster;
    v.src = reel.getAttribute('data-reel');

    /* Only reveal the video once a frame actually exists.
       play() resolves as soon as playback *starts*, which can be before a
       single frame has been decoded — and if the video track then fails while
       the audio track keeps going, the poster has already been hidden and you
       get sound over an empty box. Waiting for videoWidth makes that state
       unreachable: no picture means the poster simply stays up. */
    function reveal() {
      if (v.videoWidth > 0 && v.readyState >= 2) reel.classList.add('playing');
    }
    v.addEventListener('loadeddata', reveal);
    v.addEventListener('canplay', reveal);
    v.addEventListener('error', function () { reelOff(reel); });

    reel.querySelector('.reel-fig').appendChild(v);
    var p = v.play();
    if (p && p.catch) p.catch(function () {
      /* Unmuted playback refused (no gesture recognised, or a strict autoplay
         policy). Fall back to a silent play rather than showing nothing. */
      if (!v.muted) {
        v.muted = true; v.volume = 0;
        reel.classList.add('muted-fallback');
        v.play().catch(function () { /* blocked outright: the poster stays */ });
      }
    });
  }
  function reelOff(reel) {
    var v = reel.querySelector('video');
    if (!v) return;
    reel.classList.remove('playing');
    v.pause(); v.removeAttribute('src'); v.load(); v.remove();
  }
  /* Hover is a preview, not the mechanism. It used to be the only way to start
     a clip on a desktop, so clicking one — the obvious thing to do, and the
     only thing available on a hybrid laptop that reports a coarse pointer —
     did nothing at all. Now a click works everywhere and hover merely gets
     there first. `pinned` marks a clip the visitor actually asked for, so
     moving the mouse away does not stop it. */
  /* ══════════════════════════════════════════════════════ REEL VIEWER ══
     The short cuts had no way to be seen properly: hover gave a thumbnail-sized
     silent preview and that was all — no fullscreen, nothing usable on a phone.
     This is a real player. The clips are 9:16, so the frame is fitted rather
     than filled: portrait composition is preserved and never cropped. */
  var RVhint = function () {};
  var RV = (function () {
    var el = $('#rv'), v = $('#rvVideo'), stage = $('#rvStage'),
        cat = $('#rvCat'), cnt = $('#rvCount'), spin = $('#rvSpin'), err = $('#rvErr');
    if (!el) return { open: function () {} };
    var at = 0, lastFocus = null;

    function paint() {
      var r = REEL_DATA[at];
      if (!r) return;
      err.hidden = true;
      spin.hidden = false;
      cat.textContent = r.category;
      cnt.textContent = pad(at + 1) + ' / ' + pad(REEL_DATA.length);
      v.poster = r.poster;
      v.src = r.file;
      v.muted = false;
      v.volume = 1;
      v.load();
      var p = v.play();
      if (p && p.catch) p.catch(function () {
        /* A phone will refuse unmuted playback that it did not attribute to a
           gesture. Rather than showing a frozen poster, start it silently and
           say so on the button. */
        v.muted = true;
        v.play().catch(function () {});
        syncButtons();
      });
      syncButtons();
    }
    function syncButtons() {
      var pb = $('#rvPlay'), mb = $('#rvMute');
      pb.setAttribute('aria-label', v.paused ? 'Play' : 'Pause');
      pb.querySelector('em').textContent = v.paused ? 'Play' : 'Pause';
      pb.querySelector('span').className = v.paused ? 'ic-play' : 'ic-pause';
      mb.setAttribute('aria-label', v.muted ? 'Unmute' : 'Mute');
      mb.querySelector('em').textContent = v.muted ? 'Muted' : 'Sound';
      mb.querySelector('span').className = v.muted ? 'ic-mute' : 'ic-snd';
    }
    function open(i) {
      stopOtherMedia(null);
      stopFilms();
      at = Math.max(0, Math.min(i || 0, REEL_DATA.length - 1));
      lastFocus = document.activeElement;
      el.hidden = false;
      document.body.style.overflow = 'hidden';
      paint();
      $('#rvClose').focus();
      RVhint(true);
    }
    function close() {
      if (el.hidden) return;
      exitFull();
      v.pause();
      v.removeAttribute('src');
      v.load();
      el.hidden = true;
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    function step(d) {
      at = (at + d + REEL_DATA.length) % REEL_DATA.length;
      paint();
    }

    /* Fullscreen. Desktop and Android take the element; iOS Safari refuses to
       fullscreen an arbitrary element and only offers it on the video itself,
       so that is the fallback rather than leaving the button dead. */
    function isFull() {
      return !!(document.fullscreenElement || document.webkitFullscreenElement);
    }
    function enterFull() {
      var t = stage;
      if (t.requestFullscreen) return t.requestFullscreen().catch(iosFull);
      if (t.webkitRequestFullscreen) return t.webkitRequestFullscreen();
      iosFull();
    }
    function iosFull() {
      if (v.webkitEnterFullscreen) { try { v.webkitEnterFullscreen(); } catch (e) {} }
      else if (v.webkitSupportsPresentationMode) {
        try { v.webkitSetPresentationMode('fullscreen'); } catch (e) {}
      }
    }
    function exitFull() {
      if (document.exitFullscreen && document.fullscreenElement) document.exitFullscreen().catch(function () {});
      else if (document.webkitExitFullscreen && document.webkitFullscreenElement) document.webkitExitFullscreen();
    }

    v.addEventListener('loadeddata', function () { spin.hidden = true; syncButtons(); });
    v.addEventListener('playing', function () { spin.hidden = true; syncButtons(); });
    v.addEventListener('waiting', function () { spin.hidden = false; });
    v.addEventListener('play', syncButtons);
    v.addEventListener('pause', syncButtons);
    v.addEventListener('ended', function () { step(1); });
    v.addEventListener('error', function () {
      spin.hidden = true; err.hidden = false;
    });

    $('#rvClose').addEventListener('click', close);
    $('#rvPrev').addEventListener('click', function () { step(-1); });
    $('#rvNext').addEventListener('click', function () { step(1); });
    $('#rvPlay').addEventListener('click', function () {
      if (v.paused) v.play().catch(function () {}); else v.pause();
      syncButtons();
    });
    $('#rvMute').addEventListener('click', function () {
      v.muted = !v.muted;
      if (!v.muted) v.volume = 1;
      syncButtons();
    });
    $('#rvFull').addEventListener('click', function () {
      if (isFull()) exitFull(); else enterFull();
    });
    /* Tapping the picture toggles playback, the way a video is expected to. */
    stage.addEventListener('click', function (e) {
      if (e.target !== v) return;
      if (v.paused) v.play().catch(function () {}); else v.pause();
      syncButtons();
    });

    document.addEventListener('keydown', function (e) {
      if (el.hidden) return;
      if (e.key === 'Escape') { if (isFull()) exitFull(); else close(); }
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === ' ') {
        e.preventDefault();
        if (v.paused) v.play().catch(function () {}); else v.pause();
        syncButtons();
      }
    });

    /* Swiping is how you move between clips on a phone — the arrows are a
       desktop affordance and are hidden there. Vertical is the gesture people
       expect from a stack of vertical video (up for the next one), and
       horizontal is accepted too so a diagonal flick is never ignored.
       `swiped` suppresses the click the browser synthesises after a drag, which
       would otherwise pause the clip you just swiped to. */
    var sx = 0, sy = 0, st = 0, swiped = false;
    el.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) return;
      sx = e.touches[0].clientX; sy = e.touches[0].clientY;
      st = Date.now(); swiped = false;
    }, { passive: true });

    el.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      var dy = e.changedTouches[0].clientY - sy;
      var dt = Date.now() - st;
      var far = Math.max(Math.abs(dx), Math.abs(dy));
      /* A short, fast flick counts as much as a long slow drag. */
      if (far < 45 && !(far > 24 && dt < 250)) return;
      swiped = true;
      if (Math.abs(dy) >= Math.abs(dx)) step(dy < 0 ? 1 : -1);   // up = next
      else step(dx < 0 ? 1 : -1);                                 // left = next
      hint(false);
    }, { passive: true });

    /* Swallow the click that follows a swipe. */
    el.addEventListener('click', function (e) {
      if (swiped) { e.stopPropagation(); e.preventDefault(); swiped = false; }
    }, true);

    /* One-time nudge so the gesture is discoverable. */
    var hinted = false;
    function hint(show) {
      var h = $('#rvHint');
      if (!h) return;
      if (show && !hinted && coarse) {
        hinted = true;
        h.hidden = false;
        setTimeout(function () { h.hidden = true; }, 2600);
      } else if (!show) { h.hidden = true; }
    }
    RVhint = hint;

    return { open: open, close: close };
  })();

  /* A click opens the clip properly rather than enlarging it in place: the
     viewer is where sound, fullscreen and next/previous live. */
  function toggleReel(r) {
    var list = $$('.reel');
    var i = list.indexOf(r);
    stopOtherMedia(null);
    RV.open(i < 0 ? 0 : i);
  }

  /* Hover is a silent thumbnail preview and nothing more; sound, fullscreen and
     next/previous all live in the viewer, which a click opens. */
  document.addEventListener('pointerover', function (e) {
    var r = e.target.closest ? e.target.closest('.reel') : null;
    if (!r || e.pointerType !== 'mouse') return;
    if (!$('#rv').hidden) return;          // the viewer is open; leave the grid alone
    reelOn(r, false);
  });
  document.addEventListener('pointerout', function (e) {
    var r = e.target.closest ? e.target.closest('.reel') : null;
    if (r && !r.contains(e.relatedTarget)) reelOff(r);
  });
  document.addEventListener('click', function (e) {
    var r = e.target.closest ? e.target.closest('.reel') : null;
    if (r) toggleReel(r);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var r = e.target.closest ? e.target.closest('.reel') : null;
    if (!r) return;
    e.preventDefault();
    toggleReel(r);
  });

  /* Cursor tag — a small red label, desktop only, never a custom pointer. */
  var cursor = $('#cursor'), cursorTxt = $('#cursorTxt'), cx = 0, cy = 0, tick = false;
  if (!coarse && !reduceMotion) {
    document.addEventListener('pointermove', function (e) {
      cx = e.clientX; cy = e.clientY;
      if (!tick) {
        tick = true;
        requestAnimationFrame(function () {
          cursor.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)' +
            (cursor.classList.contains('on') ? ' scale(1)' : ' scale(.6)');
          tick = false;
        });
      }
      var t = e.target.closest ? e.target.closest('[data-cursor]') : null;
      if (t) { cursorTxt.textContent = t.getAttribute('data-cursor'); cursor.classList.add('on'); }
      else { cursor.classList.remove('on'); }
    }, { passive: true });
  }

  /* Reveals */
  var io = null;
  function observeReveals() {
    if (reduceMotion) { $$('.rv').forEach(function (n) { n.classList.add('in'); }); return; }
    if (!('IntersectionObserver' in window)) { $$('.rv').forEach(function (n) { n.classList.add('in'); }); return; }
    if (io) io.disconnect();
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 });
    $$('.rv').forEach(function (n) { io.observe(n); });
  }

  /* Drawer */
  var burger = $('#burger'), drawer = $('#drawer');
  function openDrawer() {
    drawer.hidden = false;
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    if (drawer.hidden) return;
    drawer.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  }
  burger.addEventListener('click', function () {
    if (drawer.hidden) openDrawer(); else closeDrawer();
  });
  drawer.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeDrawer();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !drawer.hidden) { closeDrawer(); burger.focus(); }
  });

  /* Header hides on the way down, returns on the way up. */
  var lastY = 0;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    var hd = $('#hd');
    if (y > 140 && y > lastY) hd.style.transform = 'translateY(-104%)';
    else hd.style.transform = '';
    lastY = y;
  }, { passive: true });
  $('#hd').style.transition = 'transform .4s cubic-bezier(.22,.61,.36,1)';

  /* ══════════════════════════════════════════════════════════════ THEME ══ */
  /* The attribute is already set by the inline script in <head> — this only
     keeps the control in sync and records the choice for the rest of the
     session. The site always opens white; see the note in index.html. */
  (function () {
    var btn = $('#theme');
    if (!btn) return;
    var root = document.documentElement;
    var meta = document.querySelector('meta[name="theme-color"]');

    function paint() {
      var dark = root.getAttribute('data-theme') === 'dark';
      var label = dark ? 'Switch to light mode' : 'Switch to dark mode';
      btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
      if (meta) meta.setAttribute('content', dark ? '#0B0B0B' : '#FAFAF8');
    }

    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      /* sessionStorage, not localStorage: the choice lasts as long as this
         visit and no longer, so the site always opens on white. */
      try { sessionStorage.setItem('db-theme', next); } catch (e) {}
      paint();
    });

    paint();
  })();

  /* ═══════════════════════════════════════════════════════════════ BOOT ══ */

  /* Dismiss the boot screen. This can only ever make it leave sooner — the
     inline keyframes already guarantee it goes at 2.4s no matter what happens
     in here, which is what keeps a script error from leaving a blank page.

     It waits for the two things that would otherwise be visibly missing on
     arrival: the grotesk (so the display type does not reflow a beat later)
     and the hero image. Both are raced against a 1.2s cap, because a slow
     connection is exactly when someone least wants to be held at a door. */
  function releaseBoot() {
    var boot = $('#boot');
    if (!boot || boot.hidden) return;

    var done = false;
    function go() {
      if (done) return;
      done = true;
      boot.classList.add('go');
      /* Take it out of the layer tree once the fade is over. */
      setTimeout(function () { boot.classList.add('gone'); }, 500);
    }

    var waits = [];
    if (document.fonts && document.fonts.ready) waits.push(document.fonts.ready);

    var hero = $('#heroImg');
    if (hero && !hero.complete) {
      waits.push(new Promise(function (res) {
        hero.addEventListener('load', res, { once: true });
        hero.addEventListener('error', res, { once: true });
      }));
    }

    var cap = new Promise(function (res) { setTimeout(res, reduceMotion ? 300 : 1200); });

    if (window.Promise && waits.length) Promise.race([Promise.all(waits), cap]).then(go);
    else cap.then ? cap.then(go) : setTimeout(go, 1200);
  }

  window.addEventListener('hashchange', route);
  route();
  observeReveals();
  releaseBoot();
})();
