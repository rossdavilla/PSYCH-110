# CLAUDE.md — Building New Chapters

Guidance for adding a chapter to this site without re-studying everything. Use
an existing chapter (e.g. `Chapter3-Male/chapter03.html`) as the source of truth
for exact markup.

## 1. Project overview

A static online textbook ("Human Sexuality" by Dr. Ross Avilla). Plain
HTML/CSS/JS — no build system, no framework, no package manager. Each chapter is
a standalone `.html` file that links a shared stylesheet and script. Content is
licensed CC BY-NC-SA 4.0 (not traditional copyright).

## 2. Directory structure

```
/                         project root
  index.html              splash page (chapter cards)
  toc.html                full table of contents
  author.html             author bio
  assets/
    style.css             shared styles (all chapters link this)
    textbook.js           shared script (popups, nav, MCQs, PDF)
    img/favicon/          favicons referenced by every chapter <head>
  ChapterN-Slug/          one folder per chapter
    chapterNN.html        the chapter file
    img/                  that chapter's images (relative: img/Name.png)
    *.docx                source manuscripts + glossary (not served)
```

Chapter images live in the chapter's own `img/` folder, NOT in `assets/img/`.

## 3. File naming conventions

- Chapter folder: `ChapterN-Slug` (e.g. `Chapter4-Gender`). N is unpadded.
- Chapter file: `chapterNN.html`, zero-padded two digits (e.g. `chapter04.html`).
- Top-level section IDs: `section1`, `section2`, … (drive in-page nav anchors).
- Subsection IDs: `sN-slug` where N is the parent section number
  (e.g. `s2-brain`, `s4-language`).
- Figures numbered `Figure N.M.` sequentially within the chapter.

## 4. Chapter HTML structure

Shared boilerplate (copy from an existing chapter and change the chapter
number, title, slug, prev/next hrefs, and the in-chapter TOC `<li>` list):

```html
<head>
  ...
  <title>Chapter 4 — Sex and Gender · Human Sexuality</title>
  <link rel="stylesheet" href="../assets/style.css">
  <!-- favicons all point to ../assets/img/favicon/... -->
</head>
<body>
<div class="nav-overlay" id="navOverlay" onclick="closeNav()"></div>
<nav class="nav-panel" id="navPanel" aria-label="Chapter navigation">
  <div class="nav-chapter-label">Ch. 4 · Sex and Gender</div>
  <a href="../index.html" class="nav-btn home">⌂ Back to Home</a>
  <div class="nav-btn-row">
    <a href="../toc.html" class="nav-btn">☰ Full TOC</a>
    <a href="../author.html" class="nav-btn">👤 Author</a>
  </div>
  <div class="nav-btn-row">
    <a href="../Chapter3-Male/chapter03.html" class="nav-btn">← Prev Chapter</a>
    <a href="#" class="nav-btn primary">Next Chapter →</a>   <!-- # if last -->
  </div>
  <ul class="nav-toc" id="tocList">
    <li><a href="#section1">4.1 Understanding Sex and Gender</a></li>
    <li><a href="#s1-binary" class="sub">The Gender Binary…</a></li>
    ...
  </ul>
</nav>
<button class="menu-btn" id="menuBtn" onclick="toggleNav()" ...></button>
<main class="content-wrapper">
  <div class="title-bar">Human Sexuality</div>
  <header class="chapter-hero">
    <div class="hero-chapter-num">Chapter 4</div>
    <h1 class="chapter-title">Sex and Gender</h1>
    <p class="chapter-subtitle">One-sentence description.</p>
  </header>
  <!-- intro, then numbered sections -->
</main>
<script src="../assets/textbook.js"></script>
</body>
```

H1 section (top level), with an H2 subsection nested inside:

```html
<section id="section2">
  <h1><span class="section-num">4.2</span> Prenatal Sex Differentiation</h1>
  <p>Lead paragraph…</p>

  <section id="s2-brain">
    <h2>Sex Differentiation of the Brain</h2>
    <p>…</p>
  </section>
</section>
```

Figure (omit `<figcaption>` for uncaptioned images):

```html
<figure class="textbook-figure">
  <img src="img/Hypothalamus%20and%20SDN.png" alt="Descriptive alt text.">
  <figcaption><strong>Figure 4.9.</strong> Caption text.</figcaption>
</figure>
```

Reference list (last section of the chapter; alphabetized; italics via `<em>`):

```html
<section class="references-section" aria-label="References">
  <h2 class="references-title">References</h2>
  <ol class="references-list">
    <li>Author, A. A. (Year). Title. <em>Journal, 12</em>(3), 45–67.</li>
  </ol>
</section>
```

A glossary ("Key Terms") section may precede References (alphabetize the terms).
Each `<dt>` carries an `id="term-slug"` anchor (slug = the term lowercased and
hyphenated, e.g. `Kinsey Scale` → `term-kinsey-scale`):
`<section class="glossary-section" id="glossary"><h2 class="glossary-title">Key Terms</h2>`
`<dl class="glossary-list"><div class="g-term"><dt id="term-slug">Term</dt><dd>Def.</dd></div>…`

Inline key-term and citation popups are driven by `togglePopup(this)` in
`textbook.js`; copy the exact `<span class="key-term">…` / `<span class="citation">…`
markup from an existing chapter when needed (Chapter7 / the template show the full
pattern). End each key-term popup with a "View in glossary" link whose href matches
that term's `<dt id>` in the glossary above:
`…<strong>Term</strong>Definition.<a class="glossary-link" href="#term-slug" onclick="event.stopPropagation()">View in glossary &rarr;</a></span></span>`
Only add the link for terms that actually have a glossary entry.

A "Study Guide" section (`id="study-guide"`) goes **before** Key Terms (so the
back-matter order is Study Guide → Key Terms → References). Group the questions
under `<h3>` subheads — plain topic titles, or mirror the chapter's numbered
sections with `<h3><span class="section-num">1.1</span> Title</h3>`. Number the
questions **continuously** across groups using `start="N"` on each `<ol>` after the
first. If the source includes an answer key, put it in a collapsible `<details
class="answer-guide">` at the end (omit if there are no answers):

```html
<section class="study-guide-section" id="study-guide">
  <h2 class="study-guide-title">Study Guide</h2>
  <p class="study-guide-intro">After reading this chapter, you should be able to answer…</p>
  <h3>Topic Group</h3>
  <ol class="study-guide-list"><li>Question…</li></ol>
  <h3>Next Group</h3>
  <ol class="study-guide-list" start="2"><li>Question…</li></ol>
  <details class="answer-guide">
    <summary>Key Points (Answer Guide)</summary>
    <div class="answer-guide-inner">
      <p class="study-guide-intro">Short model answers for self-checking…</p>
      <ol class="study-guide-list"><li>Model answer…</li></ol>
    </div>
  </details>
</section>
```

Every chapter's nav-panel `tocList` should end with `<li><a href="#study-guide">Study
Guide</a></li>` and `<li><a href="#glossary">Key Terms</a></li>`, and a quick-link
bar goes right after `</header>` (omit a pill if that section doesn't exist yet):
`<nav class="chapter-resources" aria-label="Chapter resources"><a class="resource-link" href="#study-guide">📝 Study Guide</a><a class="resource-link" href="#glossary">🔑 Key Terms</a></nav>`

## 5. Navigation — files to edit when adding a chapter

1. `index.html` — add a `.chapter-item` `<a>` card inside `.chapter-list`
   (copy the last card, bump number/title/href).
2. `toc.html` — add a `.toc-chapter` block inside `<nav class="toc-list">`
   (copy the last block; update `id="chN"`, the `toggleChapter('chN')` calls,
   number, title, Read → href, and one `.toc-section-link` per section).
3. Previous chapter's file — change its nav-panel "Next Chapter →" `<a>` href
   from `#` to the new chapter (`../ChapterN-Slug/chapterNN.html`).
4. New chapter's "Next Chapter →" stays `#` until a later chapter exists.

## 6. Image handling

- Reference images relative to the chapter folder: `src="img/Name.png"`.
- Filenames with spaces MUST be URL-encoded in `src` (space → `%20`),
  e.g. `img/Hypothalamus%20and%20SDN.png`. The actual file keeps the space.
- Source manuscripts mark image spots with markers like
  `[Insert filename.png, with caption: ...]` or `[Insert filename.png, with no
  caption]`. Convert each into the real `<figure class="textbook-figure">`
  markup above — include a `<figcaption>` only when the marker gives a caption,
  and assign the next sequential `Figure N.M.` number.
- Confirm every referenced file exists in the chapter `img/` folder before
  finishing; flag any that are missing rather than inventing them.

## Build workflow

- Source chapters arrive as `.docx`. Convert to Markdown from the shell FIRST:
  `pandoc "Source.docx" -t markdown -o /tmp/chapter.md`. Never read a `.docx`
  into context directly.
- Build the chapter ONE H1 section at a time, appending to the file, rather than
  generating the whole chapter in a single turn (avoids output-length limits).
  A working pattern: write `<head>`→intro plus an `<!-- ===END=== -->` marker
  before `</main>`, then repeatedly replace the marker with one more section +
  the marker again. Remove the marker when done.
- After the chapter is built, update the navigation files in section 5 above.
