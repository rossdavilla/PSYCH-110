# image-rescaling.md — Runbook for Optimizing a Chapter's Images

A step-by-step procedure for Claude to shrink a chapter's `img/` folder (smaller
files, web-appropriate names) **without sacrificing quality**, while preserving
every original. Written from the Chapter 12 pass (33 MB → 6.2 MB, ~81% smaller).

Follow this whenever the user asks to "downsize / optimize / rename the images"
in a chapter folder.

---

## 0. Ground truth about the toolchain

This machine has **only macOS `sips`** — no ImageMagick (`magick`/`convert`), no
`cwebp`, `avifenc`, `pngquant`, `oxipng`, or `ffmpeg`. Check first anyway:

```bash
for t in magick convert cwebp avifenc pngquant sips oxipng ffmpeg; do
  command -v $t >/dev/null 2>&1 && echo "YES $t" || echo "no  $t"
done
```

If a better tool (`cwebp`, `pngquant`) IS available, prefer it — WebP q80 / pngquant
beat JPEG on text infographics. Otherwise use `sips` as described here.

**`sips` facts that bit me:**
- Resize flag is **`-Z <maxEdge>`** (longest side becomes `maxEdge`, aspect kept).
  `--resampleWidthIfLarger` etc. do **not** exist in this build.
- `-Z` **will upscale** a smaller image. Never resize unless the longest edge
  actually exceeds the target (guard on dimensions — see script).
- JPEG quality: `-s format jpeg -s formatOptions <0-100>`.
- `sips` cannot **write** WebP/AVIF (it can read some). So we keep good WebP/AVIF
  sources as-is rather than re-encoding them.
- Convert+resize+output in one call:
  `sips -s format jpeg -s formatOptions 85 -Z 1600 "in.png" --out "out.jpg"`

---

## 1. Inventory the folder

```bash
cd ChapterN-Slug/img
for f in *.*; do
  case "$f" in
    *.svg) echo "$f : (svg, skip raster)";;
    *) d=$(sips -g pixelWidth -g pixelHeight "$f" 2>/dev/null | awk '/pixel/{print $2}' | paste -sd'x' -)
       a=$(sips -g hasAlpha "$f" 2>/dev/null | awk '/hasAlpha/{print $2}')
       echo "$f : ${d}  $(du -h "$f"|cut -f1)  alpha=$a";;
  esac
done
```

Record for each file: **dimensions, file size, format, hasAlpha**.

---

## 2. Classify each image (the core decision)

| Situation | Action | Why |
|---|---|---|
| Photo, large (`.jpg`/`.png`, >400 KB or >1600px) | **JPEG q82**, `-Z 1600` | Photos are visually lossless at q82; resize is the big win |
| Infographic / diagram / text / comic, large | **JPEG q88–90**, `-Z 1600` (1800 if very tall) | High-q JPEG keeps text crisp; validated by eye |
| Downloadable "guide" image (opened via `openImageGuide`) | **JPEG q90**, keep native size (e.g. `-Z 1536`) | It's meant to be examined/downloaded — keep it sharp |
| Already-efficient `.webp` / `.avif` | **COPY as-is** (just rename) | `sips` can't write WebP/AVIF; re-encoding to JPEG makes them **bigger** |
| Small file already web-friendly (≤ ~300 KB, efficient) | **COPY as-is** (keep its extension) | Re-encoding often **grows** it — no benefit |
| PNG with **real** transparency (alpha actually used) | Keep **PNG**, resize only | JPEG has no alpha → transparent areas turn black |

**`hasAlpha=yes` is NOT a blocker by itself.** Most AI-generated infographics
report `hasAlpha=yes` but are fully opaque (full-bleed). `sips` composites them
fine → no black background. Only keep PNG if the image has *genuine* transparency
(verify by eye after converting the first one).

**Targets:** cap the longest edge at **1600 px** for in-page figures (plenty for
the content column + retina + the lightbox). Use **1800** for very tall
comparison graphics, and keep a downloadable guide at its native size.

---

## 3. Move originals, then generate optimized versions

Preserve every original in `Original/`, then write new files into `img/`.
This script never upscales and **warns if a re-encode grew the file** (switch
those to copy-mode, keeping the original extension).

```bash
#!/bin/bash
set -e
cd "ChapterN-Slug/img"   # <-- edit path

mkdir -p Original
for f in *; do [ -f "$f" ] && mv "$f" Original/; done   # dotfiles (.DS_Store) are skipped by *

process() {              # oldname  newname  mode(J|C)  maxEdge  quality
  local src="Original/$1" new="$2" mode="$3" edge="$4" q="$5"
  [ -f "$src" ] || { echo "MISSING SOURCE: $1"; return; }
  if [ "$mode" = "C" ]; then
    cp "$src" "$new"
  else
    local W H long
    W=$(sips -g pixelWidth  "$src" 2>/dev/null | awk '/pixelWidth/{print $2}')
    H=$(sips -g pixelHeight "$src" 2>/dev/null | awk '/pixelHeight/{print $2}')
    if [ "$W" -gt "$H" ]; then long=$W; else long=$H; fi
    if [ "$long" -gt "$edge" ]; then
      sips -s format jpeg -s formatOptions "$q" -Z "$edge" "$src" --out "$new" >/dev/null 2>&1
    else
      sips -s format jpeg -s formatOptions "$q"          "$src" --out "$new" >/dev/null 2>&1
    fi
    # Safety: if the JPEG is not smaller, the original was already efficient.
    if [ "$(stat -f%z "$new")" -ge "$(stat -f%z "$src")" ]; then
      echo "  ⚠ $1 grew when re-encoded — switch it to mode C (copy, keep original extension)"
    fi
  fi
  printf "%-44s %7s -> %-40s %7s\n" "$1" "$(du -h "$src"|cut -f1)" "$new" "$(du -h "$new"|cut -f1)"
}

# ── Fill in one line per image (from the inventory + classification) ──
# process "old name.png"  "new-name.jpg"  J 1600 88
# process "photo.webp"    "photo.webp"    C
```

Then fix any file the script flagged with ⚠ by re-copying the original under a
name that **keeps the original extension** (e.g. a diagram that's smaller as PNG
stays `four-horsemen.png`, not `.jpg`):

```bash
rm -f new-name.jpg && cp "Original/old name.png" new-name.png
```

---

## 4. Naming conventions for the new files

- **lowercase**, `kebab-case`, **no spaces / parentheses / apostrophes / commas**.
- **Shorten** verbose names to the concept (`john and julie gottman.png` →
  `the-gottmans.jpg`; a 200-char descriptive filename → `rejection-brain-scans.webp`).
- Keep the extension that matches the **actual** bytes (`.jpg` for JPEG output;
  keep `.webp`/`.avif`/`.png` for copied files).

---

## 5. Rewrite the HTML references

Do this **after** optimizing, so names are final. This Python maps by
URL-decoding each existing `src`, so you don't hand-type encoded strings. Fill
`M` with **decoded original filename → new filename**, then run from the chapter
folder. It also fixes any `openImageGuide('img/…','…','…')` guide call.

```bash
cd ChapterN-Slug
python3 - <<'PY'
import re, urllib.parse
path="chapterNN.html"
html=open(path,encoding='utf-8').read(); orig=html
M={
  "old name.png":"new-name.jpg",
  # ... one entry per image ...
  "SET.png":"set-guide.jpg",           # guide image, if any
}
n=[0]
def repl(m):
    dec=urllib.parse.unquote(m.group(1))
    if dec in M: n[0]+=1; return 'src="img/'+M[dec]+'"'
    print("UNMAPPED:",dec); return m.group(0)
html=re.sub(r'src="img/([^"]+)"', repl, html)
# guide opener (src + download filename both change)
html=html.replace("openImageGuide('img/SET.png','A Visual Guide to Social Exchange Theory','SET.png')",
                  "openImageGuide('img/set-guide.jpg','A Visual Guide to Social Exchange Theory','set-guide.jpg')")
open(path,'w',encoding='utf-8').write(html)
print(f"src replacements: {n[0]}  file changed: {html!=orig}")
PY
```

---

## 6. Verify (do all of these)

```bash
cd ChapterN-Slug
# a) no encoded/old paths remain
grep -o 'src="img/[^"]*"' chapterNN.html | grep -E '%20|%27|%28|%29|%2C' && echo "STILL ENCODED" || echo "OK"
# b) every referenced file exists
python3 - <<'PY'
import re,os
h=open("chapterNN.html",encoding='utf-8').read()
s=set(re.findall(r'src="(img/[^"]+)"',h))|set(re.findall(r"openImageGuide\('(img/[^']+)'",h))
[print(("OK  " if os.path.exists(p) else "MISS"),p) for p in sorted(s)]
PY
# c) originals preserved, folder shrank
echo "Original: $(find img/Original -type f ! -name .DS_Store|wc -l|tr -d ' ') files ($(du -sh img/Original|cut -f1))"
```

- **Eyeball the text-heavy infographics** with the Read tool at full size — confirm
  labels are legible and any alpha PNG converted to a solid (not black) background.
- **Browser check** (serve over HTTP; `file://` is blocked): load the page and
  confirm **0 broken images** and, if present, the guide opens + downloads:

```js
// in the Browser pane console via javascript_tool
[...document.querySelectorAll('main img')].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src)  // → []
```

Serve with `python3 -m http.server 8712 --bind 127.0.0.1` (run in background),
open `http://127.0.0.1:8712/ChapterN-Slug/chapterNN.html`, then `pkill` it.

---

## 7. Gotchas / lessons learned

- **`sips -Z` upscales** smaller images — always guard on dimensions.
- **Re-encoding small, already-efficient files makes them bigger.** In Ch. 12,
  `your brain in love.jpg` (224K→328K), `preoccupied` (152K→216K),
  `four horsemen.png` (144K→328K), `5-to-1 ratio` (160K→232K) all grew — reverted
  to copies. Classify these as mode **C** up front.
- **WebP/AVIF stay WebP/AVIF** (copy). Converting to JPEG enlarges them and
  `sips` can't write those formats anyway.
- **`hasAlpha=yes` ≠ needs PNG.** Full-bleed infographics convert cleanly; only
  genuine transparency needs to stay PNG.
- **zsh glob error**: `*.jpeg` (or any pattern with no matches) aborts a command
  with "no matches found". Use `find . -maxdepth 1 -type f` for listings instead.
- **Only `chapter12.html` referenced these images** — chapter images aren't used
  by `index.html`/`toc.html`. Confirm with a grep before assuming, but expect the
  edits to live in the one chapter file.
- Quality that looked lossless: **photos q82, infographics/text q88–90.** Don't go
  below ~q80 on text.

---

## 8. Reference outcome (Chapter 12)

25 images, `33 MB → 6.2 MB` (~81% smaller), originals in `img/Original/`.
Biggest wins: `Equity Theory.png` 8 MB → 436 KB, `john and julie gottman.png`
6.3 MB → 424 KB, `limerence` 3 MB → 332 KB, `attachment grid` 2.5 MB → 360 KB.
No visible quality loss; the downloadable SET guide kept its native 1024×1536.
