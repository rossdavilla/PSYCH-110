# Chapter Production Guide — writing the prose

This is the brief Ross wrote for drafting new textbook chapters: voice, reading level, chapter
anatomy, the Fun Fact / MCQ / Study Guide / Key Terms features, and the two-pass citation
protocol. It governs **writing a chapter's content**. `CLAUDE.md` governs **building the chapter's
web page** once the content exists. Read both.

It was written for the Chapters 10–15 run, which is now done — those chapters are in
`Chapter10-ChildhoodDevelopment/` … `Chapter15-PornSexWork/`, each with its `Drafts/` folder. It
is kept here because it is still the spec for revising a chapter or drafting a new one.

**Two things in it are specific to the environment it was written for:**

- **Source files.** It refers to `TH_-_*.docx`, `Hyde_-_*.docx` and `Lecture___*.pdf` in
  `/mnt/project/`. Those are not in this repository. Locally they live in
  `~/GitHub/PSYCH-110 Sources/`, and `Chapter9-SexualBehavior/Drafts/Sources/` holds one example.
  If you do not have them, ask Ross for the chapter's sources rather than drafting without them.
- **Output path.** `/mnt/user-data/outputs/` was that environment's output folder. Working in this
  repository, put the draft in the chapter's own `Drafts/` folder (`.md` plus the `.docx`), the
  way Chapters 10–15 did.

Everything else — the voice rules, the two-pass citation protocol, the self-review checklist —
applies as written.

---

# Human Sexuality OER — Chapter Production Guide

**Audience for this document:** Fable (the model that will draft the chapters).
**Author of the textbook:** Ross (the professor). Ross makes every final editorial call.

Read this whole document before starting. Then produce **one chapter per run**, deliver the `.docx` for Ross to review, and stop. Do not begin the next chapter until Ross asks.

---

## 1. What you are doing

You are writing new chapters for an existing open-source undergraduate **Human Sexuality** textbook. Chapters 1–8 are already published as web pages, and Chapter 9 is being finished by Ross. Your job is to draft **Chapters 10 through 15** so they read as if they came from the same book: same voice, same depth, same reading level, same set of features.

Your deliverable for each chapter is a **clean, content-focused Word document (`.docx`)** that Ross will proofread before it is later converted into a styled web page. "Clean review draft" means readable Word formatting (real heading styles, bold key terms, simple boxed callouts) — **not** a pixel-match of the web design. Do **not** try to reproduce the site's purple header bars, gold section numbers, amber Fun Fact boxes, or interactive popups. Those are added later.

**Do not create or list images/figures.** Ross handles all figures separately. You may refer to a concept in prose, but do not insert figure placeholders, captions, or "insert image here" notes.

---

## 2. Chapters to create, and their sources

Produce these six chapters. **Chapter 9 (Sexual Behavior) is NOT yours — skip it.**

| Ch. | Title | Primary source (TH) | Supplement (Hyde) | Lecture outline |
|----|-------|--------------------|-------------------|-----------------|
| 10 | Childhood Sexual Development | `TH_-_Sexual_Development_from_Childhood_through_Adolescence.docx` | `Hyde_-_Sexuality_and_the_Life_Cycle-_Childhood_and_Adolescence.docx` | `Lecture___Childhood_Sexual_Development.pdf` |
| 11 | Adult Sexual Development | `TH_-_Sexual_Development_from_Adulthood_Through_Old_Age.docx` | `Hyde_-_Sexuality_and_the_Life_Cycle-_Adulthood.docx` | `Lecture___Adult_Sexual_Development.pdf` |
| 12 | Sexual Relationships | `TH_-_Sexual_Relationships.docx` | `Hyde_-_Attraction_and_Love.docx` | `Lecture___Sexual_Relationships.pdf` |
| 13 | Sexual Orientation | `TH_-_Sexual_Orientation.docx` | `Hyde_-_Sexual_Orientation_and_Identity-_Gay__Lesbian__Bi__Straight__or_Asexual.docx` | `Lecture___Sexual_Orientation.pdf` |
| 14 | Kinks & Fetishes | `TH_-_Fetishes__Kinks__and_Paraphilias.docx` | `Hyde_-_Variations_in_Sexual_Behaviour.docx` | `Lecture___Fetishes_Kinks_and_Paraphilias.pdf` |
| 15 | Pornography & Sex Work | `TH_-_Sex_Work.docx` | `Hyde_-_Sex_for_Sale.docx` | `Lecture__Sex_Work.pdf` |

Source files live in the project files directory (e.g. `/mnt/project/`). If you are given a different path, use that.

### 2a. How to actually read the source files (important quirks)

- **The `TH_-_*.docx` and `Hyde_-_*.docx` files are plain UTF-8 text, not real Word files** (they only carry a `.docx` extension). Read them as text — `cat`, `view`, or open as a text file. Do **not** run `pandoc` or `python-docx` on them; those will fail. Bold in these files is written as `**like this**`.
- **The `Lecture___*.pdf` files are actually ZIP archives of an exported slide deck, not real PDFs.** Each one unzips to numbered slide images (`1.jpeg`, `2.jpeg`, …), a matching text file per slide (`1.txt`, `2.txt`, …), and a `manifest.json`. To read a lecture: `unzip` it to a temp folder and read the `.txt` files (that is the fastest way to get every slide's text). Open the `.jpeg` slides only if a slide's text is unclear or looks like it depends on a diagram.

### 2b. Look at the existing chapters first

Before drafting, skim two or three of the finished chapters (`chapter01.html`–`chapter08.html`) to internalize the voice, sentence rhythm, section-length, and how Fun Facts / study guides / references read. Match that. Chapter 8 (Sexual Attraction, Arousal, and Response) is the most recent and the best model for the feature set.

---

## 3. How to use the three sources for each chapter

Think of the sources in three roles:

1. **TH chapter = the spine.** The chapter should **cover the topics the TH version covers, in a similar order and to a similar depth.** TH sets scope. Follow it.
2. **Hyde chapter = the supplement.** Pull from Hyde **only when it adds an important component that TH is missing or treats too thinly** — a key theory, a landmark study, a useful statistic, a clarifying framework. Do not pad the chapter with Hyde material just because it exists. Hyde is often longer and more research-dense than the book's target level; borrow substance, not length.
3. **Lecture outline = the coverage checklist.** Ross teaches these chapters from these decks. **Every topic that appears in the lecture must appear somewhere in the chapter.** After drafting, go slide by slide and confirm each lecture topic is present. Draw the actual content for those topics from TH and Hyde (the lecture is the checklist; TH/Hyde are the material).

**Each chapter must stand completely on its own.** No cross-references to other chapters ("as we saw in Chapter 12…"). If a concept from another chapter is needed, restate it briefly in place.

**Sensitive content:** These chapters cover childhood sexual development, paraphilias, sex work, and pornography. Write about them the way a mainstream college human-sexuality textbook does: clinical, factual, respectful, non-sensational, non-judgmental, and age-appropriate for an 18–22 college audience. Cover child sexual development as developmental science (normative curiosity, milestones, socialization, education, protection) — never as anything sexualizing minors.

---

## 4. Voice, style, and reading level

Match the existing chapters exactly:

- **Reading level: no higher than 9th grade** (aim ~Flesch–Kincaid grade 8–9). Short-to-medium sentences, common words, concrete examples. But it must still read as a **professional college textbook** — accurate, substantive, and not dumbed-down or childish.
- **Authorial voice is "we."** ("Here we look at… As we will see…")
- **Warm, engaging, accessible.** Use the occasional vivid example, everyday analogy, or gentle question to pull the reader in — the way the finished chapters do.
- **Register rules (hard):** No exclamation points. No emojis. No current slang. Avoid the words *genuinely*, *honestly*, *actually* as filler.
- **Lean psychological over biological** where a topic could go either way — this book is psychology-heavier than a typical bio-focused text.
- **Define as you go.** When a technical term first appears, work its meaning into the sentence so a reader never has to leave the page to follow along.
- **Draft long, trim later.** Do not fret about word count while drafting. Get the coverage right first, then tighten.

---

## 5. Length

- Target **6,000–7,000 words** of body text per chapter. **Longer is fine** if the material needs it; do not cut required coverage to hit a number.
- Word count is body prose. The references list, study guide, glossary, and MCQ answer explanations are on top of that.

---

## 6. Chapter anatomy

Produce these parts, in this order. (This mirrors the finished chapters.)

1. **Chapter number + title** (e.g., "Chapter 10 — Childhood Sexual Development").
2. **A one-line subtitle** — a compelling, plain-language hook, like the existing chapters' subtitles. (Ch. 8's is a good model.)
3. **A short, engaging introduction** (a few paragraphs) that frames why the chapter matters and previews where it's going. **Do not print a formal "Learning Objectives" list** — the finished chapters don't. (You may use the TH learning objectives privately as a coverage checklist.)
4. **Numbered sections** that carry the body (see §7).
5. **Study Guide** (see §10).
6. **References** (see §9).
7. **Key Terms** glossary (see §8).

Woven **into** the body as you go: **bold key terms** (§8), **3–7 Fun Facts** (§8.2), and **10 embedded multiple-choice questions** (§8.3).

---

## 7. Sections and headings

- Number the top-level sections after the chapter: **10.1, 10.2, 10.3 …** (for Chapter 10), **11.1, 11.2 …** for Chapter 11, and so on. Give each a short, clear title.
- Most chapters land around **4–6 numbered sections**, each with a handful of subsections. Use the TH chapter's structure as your guide and simplify where TH is over-granular.
- In the Word file, use real heading styles: **Heading 1** for the section (e.g., "10.1 …"), **Heading 2** for subsections, **Heading 3** for any sub-subsection. This keeps the document navigable and makes the later web conversion clean.

---

## 8. Features woven through the chapter

### 8.1 Key terms and the glossary

- **Bold each key term the first time it appears** in the body, right where you define it in context.
- Collect every bolded term into a **Key Terms** glossary at the end, **alphabetized**, each with a **plain-language definition** written at the same 9th-grade level (one to three sentences). Every bolded term must appear in the glossary, and every glossary term must be bolded in the body.

### 8.2 Fun Facts (3–7 per chapter)

- Include **between 3 and 7** Fun Facts per chapter.
- Format: a simple boxed/shaded callout that begins with a bold label — **"Fun Fact: [short title]."** — followed by a 2–5 sentence explanation. (In the finished book these render as amber boxes; in your clean `.docx` a lightly shaded box or a clearly labeled bordered paragraph is enough.)
- Purpose: engagement. Use them for the **weird, surprising, or delightful** corners of human sexuality — especially topics that are interesting but don't fit neatly into the main narrative. They still follow the register rules (no exclamation points, no slang).
- Anchor them in something real, and cite them like any other claim (§9).

### 8.3 Embedded multiple-choice questions (exactly 10 per chapter)

- Place **10 MCQs** across the chapter, roughly **one per major section**, at natural checkpoints (end of a section or subsection). Space them out; don't cluster them.
- Each MCQ has:
  - a **question stem** — favor *applied / scenario* stems (a short situation, then "which is most likely…?") over pure recall, matching Chapter 8's style, but a mix is good;
  - **four options labeled A–D**, with plausible distractors;
  - the **correct answer**, and
  - a **1–2 sentence explanation** of why it's right (and, where useful, why the tempting wrong answer is wrong).
- These test comprehension and application; they are **separate** from the Study Guide questions (§10) — no overlap.
- **In the review `.docx`, show the answer and explanation right under each question**, clearly labeled (e.g., *Answer: B.* then the explanation). Ross needs to see them to review; the hide-until-clicked behavior is added later at the web stage.

---

## 9. Citations, references, and fact-checking — the two-pass protocol

Citation accuracy is non-negotiable, and **you must never invent a citation.** Follow this exact two-pass process.

**Pass 1 — Draft and flag.** Write the chapter. Every time you make a factual claim, cite a study, or state a statistic that needs support, drop a **highlighted flag** at that spot rather than stopping to source it — literally write something like `[CITATION NEEDED — <what the claim is>]` and highlight it (yellow). Also highlight-flag **every statistic** (percentages, counts, dates, "studies show…") for verification, even if you think you know it.

**Pass 2 — Source and highlight.** Go back to each flag and find a citation that genuinely fits:
- **Look first in the TH and Hyde source files.** They are full of real APA author–date citations (TH has ~20 per chapter; Hyde often 150+). If the claim came from a source passage that already carries a citation, carry that citation forward.
- **Where a source citation exists but you lack the full reference details** (journal, year, volume, DOI), reconstruct the full APA 7th-edition entry and **verify it with a web search if you have web access.**
- **Verify statistics** against the source or the web. If a number can't be verified, keep it flagged and highlighted with a short note, rather than presenting it as fact.
- Insert the in-text citation in **APA author–date** form — `(Author, Year)` — and add the matching full entry to the References list.
- **If you cannot find a real, fitting citation, search for one online.** Do not fabricate an author, year, title, or DOI to fill the gap. Find a genuine primary source article to cite that backs up your claims.

**References section:**
- One **alphabetized** (by first author surname) References list per chapter, in **APA 7th edition**. Because chapters stand alone, each chapter carries its own complete list.
- Handle same-author/same-year collisions with APA `a`/`b`/`c` suffixes (e.g., `2019a`, `2019b`), and **flag** (highlight) any disambiguation you had to make so Ross can confirm it.
- Every in-text citation must have a References entry and vice versa.

**Rule of thumb:** flag, don't guess. When something is uncertain — a citation, a statistic, a disambiguation, a judgment call — surface it to Ross with a highlight rather than quietly deciding.

---

## 10. Study Guide

- Place a **Study Guide** after the body. Open with one short instructional line (see Ch. 8 for the tone: "After reading this chapter, you should be able to answer each of the questions below…").
- **15–20 open-ended questions**, **organized by section** (use the section titles as subheadings), with **continuous numbering** across the whole guide (1, 2, 3 … not restarting per section).
- **Mix question types:** recall, mechanism/explain-how, compare-and-contrast, applied scenario, and myth-busting.
- **Do NOT include an answer key.** (Per Ross.) These are open-ended prompts for students; leave them unanswered.

---

## 11. Producing the `.docx`

1. **Write the chapter in Markdown first.** The Markdown draft is your working/canonical copy; you regenerate the `.docx` from it if edits are needed rather than hand-editing the Word file.
2. **Convert to a clean `.docx`.** Use the environment's `docx` skill / document tooling (docx-js via npm is the reliable path). Formatting spec:
   - **US Letter** page size; standard margins; a readable serif or clean sans body font at a normal size with comfortable line spacing.
   - **Heading 1/2/3** styles for sections/subsections (§7).
   - **Bold** for key terms on first use.
   - **Fun Facts and MCQs** as lightly shaded or clearly bordered boxes so they stand out from body text (use `ShadingType.CLEAR`, not `SOLID`, to avoid black fills).
   - **Yellow highlight** for every inserted citation, every reference entry you added, every remaining `[CITATION NEEDED]` flag, any unverified statistic, and any APA a/b/c disambiguation — everything Ross needs to eyeball.
   - No figures, no image placeholders.
3. **Verify the output visually.** Render the `.docx` to PDF and look at the pages (e.g., `soffice --headless --convert-to pdf`, then `pdftoppm -jpeg`), checking that headings, boxes, and highlights render correctly and nothing is malformed.
4. **Output location & naming:** save to `/mnt/user-data/outputs/`, using a clear per-chapter name, e.g. `Chapter10-ChildhoodSexualDevelopment.docx` (keep the `.md` source alongside it).
5. **Present the file to Ross and stop.** One chapter per run.

---

## 12. Self-review before delivering (do this every time)

Re-read the full chapter and confirm all of the following. Fix, then re-check.

- **Coverage:** every topic in the **lecture deck** is present; the chapter tracks the **TH** scope; Hyde was used only where it added something needed.
- **Accuracy:** claims are correct; statistics are verified or flagged; nothing is overstated.
- **Reading level:** spot-check that it reads at ~8th–9th grade; simplify dense sentences and jargon.
- **Voice/register:** "we" voice; no exclamation points, emojis, or slang; warm but professional; consistent with Chapters 1–8.
- **Length:** ~6,000–7,000 words of body (longer OK), not padded.
- **Features present and correct:**
  - 3–7 **Fun Facts**, properly boxed and labeled;
  - exactly **10 MCQs**, each with four options, a marked correct answer, and an explanation, spaced across the chapter, distinct from the study guide;
  - **Study Guide** of 15–20 questions, by section, continuously numbered, **no answer key**;
  - **Key Terms** glossary — alphabetized, every bolded term defined, every glossary term bolded in text;
  - **References** — alphabetized, APA 7th, complete, matched one-to-one with in-text citations.
- **Citations highlighted:** every inserted citation, every added reference entry, every unresolved flag, every unverified stat, and every a/b/c disambiguation is highlighted for Ross.
- **Self-contained:** no cross-references to other chapters.
- **No figures** or image placeholders.

---

## 13. Editorial stance (how to handle judgment calls)

- **Flag, don't decide.** For citation gaps, uncertain facts, disambiguation, or genuine voice/style choices, surface the issue to Ross (via a highlight or a short note) rather than quietly resolving it.
- **Show options, don't unilaterally rewrite.** When there's a real choice about scope or wording, present the alternatives for Ross to pick.
- **Ross makes all final editorial calls.** Your job is a strong, accurate, engaging draft with every uncertainty made visible.

---

## 14. Quick runbook for one chapter

1. Read this guide. Skim 2–3 finished chapters for voice.
2. Read the chapter's **TH** file (as text), its **Hyde** file (as text), and its **lecture deck** (unzip, read the `.txt` slides).
3. Build a topic outline: TH structure as the spine, lecture topics as the must-cover checklist, Hyde noted where it fills a gap. Number the sections.
4. Draft the chapter in Markdown — intro, numbered sections, weaving in bold key terms, 3–7 Fun Facts, and 10 MCQs. **Pass 1:** highlight-flag every citation/statistic as you go.
5. **Pass 2:** source each flag (TH/Hyde first, then web), insert and **highlight** APA citations, build the alphabetized References list, verify stats.
6. Add the Study Guide (no key) and the alphabetized Key Terms glossary.
7. Run the §12 self-review; fix issues.
8. Convert Markdown → clean `.docx`; render to PDF and eyeball it.
9. Save to `/mnt/user-data/outputs/`, present it to Ross, and stop.
