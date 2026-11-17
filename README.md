# Human Sexuality — an open online textbook

A free, open textbook by **Dr. Ross Avilla**, written for an undergraduate human sexuality course.
Fifteen chapters, each a standalone web page with pop-up definitions, embedded practice questions,
a study guide, and its own complete reference list.

**Read it:** https://rossdavilla.github.io/PSYCH-110/

Licensed **CC BY-NC-SA 4.0** — free to read, share and adapt for non-commercial use with
attribution.

## Chapters

| | Chapter |
| --- | --- |
| 1 | [Exploring Human Sexuality](https://rossdavilla.github.io/PSYCH-110/Chapter1-Intro/chapter01.html) |
| 2 | [Female Sexual Anatomy and Physiology](https://rossdavilla.github.io/PSYCH-110/Chapter2-Female/chapter02.html) |
| 3 | [Male Sexual Anatomy](https://rossdavilla.github.io/PSYCH-110/Chapter3-Male/chapter03.html) |
| 4 | [Sex and Gender](https://rossdavilla.github.io/PSYCH-110/Chapter4-Gender/chapter04.html) |
| 5 | [Fertility](https://rossdavilla.github.io/PSYCH-110/Chapter5-Fertility/chapter05.html) |
| 6 | [Contraception](https://rossdavilla.github.io/PSYCH-110/Chapter6-Contraception/chapter06.html) |
| 7 | [Conception, Pregnancy, and Childbirth](https://rossdavilla.github.io/PSYCH-110/Chapter7-Pregnancy/chapter07.html) |
| 8 | [Sexual Attraction, Arousal, and Response](https://rossdavilla.github.io/PSYCH-110/Chapter8-SexualArousal/chapter08.html) |
| 9 | [Sexual Behavior](https://rossdavilla.github.io/PSYCH-110/Chapter9-SexualBehavior/chapter09.html) |
| 10 | [Childhood Sexual Development](https://rossdavilla.github.io/PSYCH-110/Chapter10-ChildhoodDevelopment/chapter10.html) |
| 11 | [Adult Sexual Development](https://rossdavilla.github.io/PSYCH-110/Chapter11-AdultDevelopment/chapter11.html) |
| 12 | [Sexual Relationships](https://rossdavilla.github.io/PSYCH-110/Chapter12-SexualRelationships/chapter12.html) |
| 13 | [Sexual Orientation & Gender Identity](https://rossdavilla.github.io/PSYCH-110/Chapter13-SexualOrientation/chapter13.html) |
| 14 | [Kinks & Paraphilias](https://rossdavilla.github.io/PSYCH-110/Chapter14-Fetishes/chapter14.html) |
| 15 | [Pornography & Sex Work](https://rossdavilla.github.io/PSYCH-110/Chapter15-PornSexWork/chapter15.html) |

Also: the [table of contents](https://rossdavilla.github.io/PSYCH-110/toc.html), the
[author bio](https://rossdavilla.github.io/PSYCH-110/author.html), and the
[course syllabus](https://rossdavilla.github.io/PSYCH-110/syllabus.html).

## Interactive apps

Small self-contained activities that go with the chapters, under `apps/`:

| App | What it does |
| --- | --- |
| [Anatomy Point-and-Click](https://rossdavilla.github.io/PSYCH-110/apps/Anatomy-Point-and-Click/female-anatomy.html) | Click each marker to name the parts of the vulva; there is a male version alongside it |
| [Fetal Genital Development](https://rossdavilla.github.io/PSYCH-110/apps/Protogenital-Devleopment/fetalgenitals.html) | Click along a timeline to watch the genitals develop in the womb |
| [How to Use a Condom](https://rossdavilla.github.io/PSYCH-110/apps/Condoms-How-To/) | A step-by-step slideshow, starting with checking the expiration date |
| `apps/Love-Triangle/` | Sternberg's triangular theory of love, the textbook copy of the PSY157 activity |

## How it is built

Plain HTML, CSS and JavaScript — no build system, no framework, no package manager. Each chapter
is a standalone `.html` file in its own `ChapterN-Slug/` folder that links the shared
`assets/style.css` and `assets/textbook.js`; chapter images live in that chapter's own `img/`
folder. Each chapter folder also carries its source manuscripts and drafts, which are not served.

To read it locally, serve the repository root:

```bash
python3 -m http.server 8000
```

Two documents cover working on it: [`CLAUDE.md`](CLAUDE.md) for building a chapter's page (markup,
naming, navigation, image handling), and [`CHAPTER-PRODUCTION.md`](CHAPTER-PRODUCTION.md) for
writing a chapter's content (voice, reading level, chapter anatomy, and the citation protocol).
