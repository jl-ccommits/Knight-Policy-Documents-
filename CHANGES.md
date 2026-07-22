# Template Font Uniformity — Change Report

Updated templates (root of this branch):

| File | Pages | What changed |
|---|---|---|
| `TEMPLATE_GL_5.pdf` | 66 | Fonts normalized on 50 pages (837 lines re-set); "COMMERCIAL GENERAL LIABILITY" → "COMMERCIAL LIABILITY" (41 instances) |
| `TEMPLATE_PL_4.pdf` | 21 | Fonts normalized on 21 pages (108 lines re-set) |
| `TEMPLATE_PROPERTY_4.pdf` | 49 | Fonts normalized on 49 pages (536 lines re-set) |

The files as received are preserved unmodified in `originals/`.

## Formatting rules applied (per Zim's email)

- **Arial** for all text. Every re-set line is set in genuine embedded Arial
  (ArialMT / Arial-BoldMT / Arial-ItalicMT). Calibri (GL pp. 54–55), Helvetica
  (Property p. 46), Aptos (display titles), and mixed legacy "Arial"-named fonts
  were all converted. Bold/italic emphasis was preserved exactly as it was.
- **Headers/footers: 9 pt.** Header stacks (line of business + form number) are
  bold 9 pt right-aligned, matching the convention on the GL pages Zim had
  already finished (pp. 1–23).
- **Titles: 12 pt bold.** Oversized display titles (14–20 pt) were reduced to
  12 pt bold; non-bold titles were bolded.
- **General text: 10 pt.** 11 pt and 12 pt body sections, schedule tables, and
  off-sizes (9.9–10.7 pt from scaled page inserts) normalized to 10 pt.
  Justified paragraphs were re-justified to their original measure; list
  hanging indents were preserved.
- **Notice line** ("THIS ENDORSEMENT CHANGES THE POLICY. PLEASE READ IT
  CAREFULLY.") is 10 pt bold centered — matching the finished GL reference
  pages (this is also standard ISO practice; the form title below it is the
  12 pt element). On GL p. 65 the notice had wrapped onto two lines because of
  the old 14 pt size; it now fits on one line.

## GL rename: COMMERCIAL GENERAL LIABILITY → COMMERCIAL LIABILITY

All 41 all-caps occurrences were changed — form headers and the
"This endorsement modifies insurance provided under the following:" lists
(GL pp. 1, 25, 27–29, 32–36, 39, 40, 42, 44–46, 48, 50–52, 57, 59, 61–63).
Zero all-caps instances remain.

**Left unchanged (needs Zim's confirmation):** two mixed-case prose references
on GL pp. 29–30 — "…attached to **Commercial General Liability** Coverage Form
**CG 00 01/CG 00 02**…". These cite ISO coverage forms by name and number, so
renaming the words while keeping the ISO form numbers could create a mismatch.
Happy to update them too if desired.

## Intentional exceptions (unchanged by design)

- Property pp. 1–2 (Coverage Part Declarations): the dense fill-in grid keeps
  its compact 7–8 pt field labels — enlarging to 10 pt would collide with
  adjacent columns and fill-in rules. The page title/header/footer follow the
  rules.
- PL pp. 17–20: italic 9 pt "Includes copyrighted material…" footer lines were
  already at footer size and remain italic 9 pt.
- Checkbox/glyph marks (Wingdings/Symbol/one Lucida Console box) untouched.
- Form fields: all 263 fill-in fields already use Arial 10 for typed text; they
  are byte-for-byte unchanged.

## Pre-existing source issues spotted during the work (not fixed — content edits beyond the font scope)

1. GL pp. 9–10 footers both read "Page 6 of 13", and pp. 14–18 all read
   "Page 9 of 13" — the C 05 GL 300 form's internal page numbering is off.
2. GL p. 36 title typo "Affiliated **Entites**" (should be "Entities").
3. GL p. 42 footer form number reads "C 05 GL **51212 25**" (missing space).
4. Property p. 24 footer form number "C 05 CP 201 **5 1225**" doesn't match its
   header "C 05 CP 201 **6 12 25**".
5. GL coverage-form section headings are inconsistently weighted in the source
   (COVERAGE A bold, COVERAGE B/C not bold). Weights were preserved as-is since
   the rules cover font/size only.
6. GL p. 45 contains a stray single-character line "I" (looks like a leftover).

## Verification performed

- **Text fidelity:** word-by-word comparison of every page before/after —
  byte-identical (including punctuation and invisible Unicode) except the 41
  intended GENERAL removals. Verified with two independent PDF text extractors.
- **Copy/search integrity:** ToUnicode maps for the embedded Arial fonts were
  normalized so copied/searched text yields standard characters (regular
  spaces, hyphens, semicolons — not lookalike codepoints).
- **Form fields:** field names, types, positions, and appearance identical.
- **Visual QA:** all 136 pages rendered and compared before/after in two
  review rounds; layout, alignment, tables, and graphics verified.
- Two cosmetic notes: (a) a few paragraphs converted from larger/non-Arial
  type (e.g., Property p. 46 items 2–3) now end short of the right margin with
  normal spacing, because 10 pt Arial is narrower than the type it replaced;
  (b) two-line titles reduced from very large type (e.g., GL p. 63) keep their
  original line spacing, so the pair sits slightly airier than a native 12 pt
  title. Content and readability are unaffected.

## Suggested follow-ups

- Bump template version numbers/filenames if these enter your document
  management flow as a new revision.
- Decide on the two mixed-case CG 00 01/CG 00 02 references (above).
- The pre-existing footer pagination and typos (list above) are quick fixes if
  wanted — say the word.
