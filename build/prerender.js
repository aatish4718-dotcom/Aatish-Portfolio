/* ============================================================================
   PRE-RENDER — writes every page of digbigstudio.com as real HTML.

   Why this exists
   ---------------
   The site builds its pages in the browser: index.html holds the home page and
   app.js assembles everything else from content.js. Anything that reads a page
   without running JavaScript — a search engine's first pass, a link preview,
   ChatGPT or Claude opening a URL — only ever got the home page.

   This script runs the site's own code once per page, in Node, against a
   browser-like document (jsdom), and saves the result. Nothing about how a page
   is built is duplicated here: the router in app.js renders each page exactly
   as it does for a visitor, and this file only decides which pages to render
   and what to write around them.

   Visitors still get the live site. app.js runs on top of the saved HTML and
   renders the page again from content.js, so a content edit that has not been
   pre-rendered yet is still what a visitor sees. Only readers that never run
   JavaScript would see the older copy, until the next build.

   Usage:   npm run prerender        (from the repository root)

   Reads    src/shell.html           the page shell — edit this, not the output
            digbig-2026/*.js         the site's own data and code
   Writes   digbig-2026/index.html   and <route>/index.html for every page,
            404.html, sitemap.xml, robots.txt
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');
const SITE = path.join(ROOT, 'digbig-2026');
const SHELL = path.join(ROOT, 'src', 'shell.html');
const ORIGIN = 'https://digbigstudio.com';
const LEDGER = path.join(__dirname, 'generated.json');

const shell = fs.readFileSync(SHELL, 'utf8');

/* The scripts, in the order the shell loads them. */
const scripts = [...shell.matchAll(/<script src="([^"?]+)(?:\?[^"]*)?"[^>]*><\/script>/g)]
  .map(m => ({ name: m[1], code: fs.readFileSync(path.join(SITE, m[1]), 'utf8') }));

function boot(url) {
  /* Scripts run as real <script> elements, as in a browser, so that the
     top-level constants in content.js are visible to app.js. */
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(shell, { url, runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc });
  const w = dom.window;
  const d = w.document;
  /* What jsdom does not implement, and app.js asks for. */
  w.matchMedia = () => ({ matches: false, media: '', addListener() {}, removeListener() {},
                          addEventListener() {}, removeEventListener() {} });
  w.scrollTo = () => {};
  w.HTMLElement.prototype.scrollIntoView = function () {};
  w.__PRERENDER = true;
  for (const s of scripts) {
    const el = d.createElement('script');
    el.setAttribute('data-prerender', '');
    el.textContent = s.code;
    d.body.appendChild(el);
    if (errors.length) throw new Error(url + ' — ' + s.name + ': ' + errors.join('; '));
  }
  return dom;
}

/* Every page the router knows, read off the content rather than listed here. */
function routes() {
  const w = boot(ORIGIN + '/').window;
  const slugs = name => w.eval(name).map(p => p.slug);
  return [
    '/', '/plan', '/visualisation', '/design', '/photography', '/motion', '/archive', '/about', '/contact',
    ...slugs('PLAN_PROJECTS').map(s => '/plan/' + s),
    ...slugs('VIZ_PROJECTS').map(s => '/visualisation/' + s),
    ...slugs('DESIGN_PROJECTS').map(s => '/design/' + s),
    ...slugs('PHOTO_STORIES').map(s => '/photography/' + s)
  ];
}

function text(el) { return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; }

function clip(s, n) {
  if (s.length <= n) return s;
  const cut = s.slice(0, n - 1);
  return cut.slice(0, cut.lastIndexOf(' ')) + '…';
}

function render(route, notFound) {
  const url = ORIGIN + (notFound ? '/__not-found' : route);
  const dom = boot(url);
  const d = dom.window.document;
  const home = d.getElementById('home');
  const view = d.getElementById('view');
  const isHome = route === '/' && !notFound;

  /* Leave the document as a visitor's browser should first meet it, not as
     the script left it after running. */
  d.querySelectorAll('script[data-prerender]').forEach(el => el.remove());
  d.documentElement.removeAttribute('data-theme');
  d.querySelectorAll('.rv.in').forEach(el => el.classList.remove('in'));
  const bootEl = d.getElementById('boot');
  if (bootEl) { bootEl.removeAttribute('hidden'); bootEl.classList.remove('go', 'gone'); }
  const hd = d.getElementById('hd');
  if (hd) hd.removeAttribute('style');

  if (!isHome) {
    /* An inner page ships without the home page's markup, so a reader gets
       the page they asked for rather than the home page first. The router
       sees data-stripped and loads / properly when someone goes home. */
    home.innerHTML = '';
    home.setAttribute('data-stripped', '');
    home.hidden = true;
  }

  /* Head: title, description and address for this page. */
  const title = d.title;
  const lede = text(d.querySelector(isHome ? '#home .hero-say .lede' : '#view .mast .lede'));
  const note = text(d.querySelector(isHome ? '#home .hero-say .body-sm' : '#view .mast-sub .body-sm'));
  const desc = isHome
    ? d.querySelector('meta[name="description"]').getAttribute('content')
    : clip([lede, note].filter(Boolean).join(' '), 300);
  const canonical = ORIGIN + (route === '/' ? '/' : route);
  const set = (sel, attr, val) => { const el = d.querySelector(sel); if (el) el.setAttribute(attr, val); };
  set('meta[name="description"]', 'content', desc);
  set('link[rel="canonical"]', 'href', canonical);
  set('meta[property="og:url"]', 'content', canonical);
  if (!isHome) {
    set('meta[property="og:title"]', 'content', title.replace(' | DigBig Studio', ''));
    set('meta[name="twitter:title"]', 'content', title.replace(' | DigBig Studio', ''));
    set('meta[property="og:description"]', 'content', clip(desc, 200));
    set('meta[name="twitter:description"]', 'content', clip(desc, 200));
  }
  if (notFound) {
    const robots = d.createElement('meta');
    robots.setAttribute('name', 'robots');
    robots.setAttribute('content', 'noindex');
    d.head.appendChild(robots);
  }

  const html = dom.serialize().replace(/^<!DOCTYPE html>/i,
    '<!DOCTYPE html>\n<!-- Generated by build/prerender.js from src/shell.html. Edit those, not this file. -->');
  return { html, title, words: text(isHome ? home : view).split(' ').length };
}

function outFile(route) {
  return route === '/' ? path.join(SITE, 'index.html') : path.join(SITE, ...route.slice(1).split('/'), 'index.html');
}

function main() {
  const list = routes();
  const previous = fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, 'utf8')) : [];
  const written = [];

  for (const r of list) {
    const { html, title, words } = render(r);
    if (words < 40) throw new Error(r + ' rendered almost nothing (' + words + ' words) — refusing to write it');
    const f = outFile(r);
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, html);
    written.push(path.relative(SITE, f).split(path.sep).join('/'));
    console.log(String(words).padStart(5) + ' words  ' + r.padEnd(46) + title.replace(' — Aatish Kumar | DigBig Studio', ''));
  }

  const nf = render('/', true);
  fs.writeFileSync(path.join(SITE, '404.html'), nf.html);
  written.push('404.html');

  const today = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(path.join(SITE, 'sitemap.xml'),
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    list.map(r => '  <url><loc>' + ORIGIN + (r === '/' ? '/' : r) + '</loc><lastmod>' + today + '</lastmod></url>').join('\n') +
    '\n</urlset>\n');
  fs.writeFileSync(path.join(SITE, 'robots.txt'), 'User-agent: *\nAllow: /\n\nSitemap: ' + ORIGIN + '/sitemap.xml\n');
  written.push('sitemap.xml', 'robots.txt');

  /* Pages that existed last time but not now — a renamed or removed project. */
  const stale = previous.filter(f => !written.includes(f));
  for (const f of stale) {
    const abs = path.join(SITE, f);
    if (fs.existsSync(abs)) fs.unlinkSync(abs);
    let dir = path.dirname(abs);
    while (dir !== SITE && fs.existsSync(dir) && fs.readdirSync(dir).length === 0) { fs.rmdirSync(dir); dir = path.dirname(dir); }
    console.log('removed stale  ' + f);
  }
  fs.writeFileSync(LEDGER, JSON.stringify(written, null, 1) + '\n');
  console.log('\n' + list.length + ' pages, 404.html, sitemap.xml and robots.txt written.');
}

main();
