# Science Agent Atlas

**[Open the live atlas in English →](https://zoedsy.github.io/awesome-science-agents/?lang=en) · [打开中文版 →](https://zoedsy.github.io/awesome-science-agents/?lang=zh)**

Click any timeline point or paper card to open its reading guide. The public site
works directly in your browser; installation and sign-in are not required.

An interactive Chinese/English reading dashboard for every dated entry in the
repository. Select a timeline dot or card for a detailed reading guide: concrete
research setting, three method steps, experimental design and results, figure/table
walkthrough, and limitations and reusable ideas. Author affiliations, original
figures, selected result tables, and quick takeaways accompany each guide.
Search, discipline, mechanism, code-link,
topic, and month filters work together. Links preserve the current view and paper.

## Run locally

The committed site requires only a static HTTP server. It has no runtime packages,
API keys, analytics, remote fonts, or live paper-fetching dependencies. Most
figures load directly from publishers or arXiv; their source links remain available
if an image cannot load.

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory docs
```

Open [the local atlas](http://localhost:4173/). Use HTTP rather than opening the HTML
file directly, because the site loads an ES module and a JSON file.

## Maintain the collection

`README.md` remains the source for titles, catalog months, sections, and outgoing
links. `data/paper-notes.json` contains reviewed bilingual explanations and source
provenance keyed by each entry's primary paper URL (or code URL for software).
`data/paper-reading.json` adds source-backed institutions, bilingual reading guides
and takeaways, figure explanations, image URLs, and selected table values under
the same keys.
`docs/data/papers.json` is the generated, committed snapshot served by the website.

1. Add or update the dated README entry.
2. Add the corresponding record in `data/paper-notes.json`, including Chinese and
   English problem, method, and evaluation paragraphs, original sources, the
   review date, and editorial type/mechanism tags. Do not paste full abstracts.
3. Add a reading record in `data/paper-reading.json`. Verify affiliations in the
   source, label incomplete information, select useful figures and tables, and
   explain them in both languages. Preserve table units and comparison conditions.
   Each `guide.zh` and `guide.en` must include `context`, at least three `steps`,
   at least two `evidence` paragraphs, `visual`, and `caveat`. Explain the actual
   inputs, process, outputs, comparison conditions and meaning of results. Use
   the paper's metric definitions and distinguish ratings, accuracy, relative
   gains and percentage-point differences. Adapt evidence to the source type:
   surveys, software and qualitative studies do not all report experiments.
   Cross-check specific claims against the linked source version; say when only
   an abstract or official summary is available. Do not invent missing results.
4. Run `python3 scripts/build_dashboard.py` and commit both note files and snapshot.
5. Run `npm test` with Node.js 20+ and Python 3.9+; no `npm install` is needed.

The build fails on missing or stale notes, unsupported sections, invalid links,
duplicate primary URLs, inconsistent affiliations, unsafe figure URLs, missing
local figure assets, or incomplete translations. Run
`python3 scripts/build_dashboard.py --check` to detect drift without writing files.
Paper IDs derive from primary URLs, so changing list order does not break links.
If the primary URL itself changes, its permalink changes too.

## Read the visualization

- The horizontal position follows the month printed in the README. Existing
  entries can use preprint or journal dates; the atlas does not silently normalize
  them. Use original sources to confirm bibliographic dates.
- Vertical rows show repository disciplines or the first editorial mechanism tag.
  Points are stacked vertically only to prevent overlap. Distance is not semantic
  similarity, and point size is not a measure of quality or impact.
- Evolution and learning is a cross-disciplinary checkbox filter, combined with
  the ordinary discipline and mechanism filters. It includes selected work on persistent memory,
  skill acquisition, program evolution, and test-time learning, plus a relevant
  benchmark. Inclusion does not certify recursive self-improvement or lifelong
  retention. Read each entry's evaluation paragraph for its actual scope.
- Related-paper suggestions share editorial mechanism tags; they are not citation
  edges. The source set includes research, surveys, perspectives, benchmarks,
  analytical studies, and software. Counts describe this collection only.
- Explanations are editorial paraphrases of abstracts, paper text, or official
  project materials, not independent replications. Author metadata is included
  when retrieved from the original source. Institution search uses source-listed
  organization names. The reader distinguishes verified, partially identified, and
  unstated affiliations; it does not infer institutions from email addresses.
- Original figures retain their own language and copyright. Bilingual explanations
  sit below each figure, with links to the exact source and full-sized image.
  Twelve PDF-only figures and tables are cropped locally, with provenance recorded in
  `docs/assets/paper-figures/README.md`. Tables retain original numerical values
  and labels, omitting bibliographic citation markers.
- All 102 entries include complete Chinese and English reading guides. These
  expand on the brief catalog summaries; numerical claims retain their evaluation
  setting and original-source links. The September 2026 reading edition includes figures for 99 entries, selected
  tables for 48, and identified institutions or project teams for 100. Jacobian and
  ResearchClawBench have no selected figures; MARS currently
  links to its original publication because a usable figure was not retrieved.
  Jacobian and the four-attempt case study do not explicitly list institutions in
  the checked sources. The autonomous-research survey and MARS have partial
  institution coverage, labelled in the reader.

## GitHub Pages

The live site is [Science Agent Atlas](https://zoedsy.github.io/awesome-science-agents/).
This repository publishes from `main:/docs` through GitHub Pages. Merged changes
to the site are published automatically after the Pages build completes.

To enable the same setup in a fork, choose **Settings → Pages → Deploy from a
branch → main → /docs**. Relative asset URLs support the project subpath, and
`.nojekyll` keeps the site static without a custom build workflow. Update the
README and repository Website links to the fork's own Pages address.

## Verification

Automated tests cover bilingual completeness, all README entries, stable IDs,
institution search, nested reading-source validation, combined filters, date boundaries, malformed URL state, and collision-free graph
layout at desktop and mobile widths. Browser checks should cover both languages,
search and empty-state reset, timeline playback, modal opening and Escape, direct
paper links, browser back/forward, code-only entries, and mobile navigation. Also
check the site under a path prefix before changing its asset paths.

Browser checks for reading pages should additionally inspect image loading and
fallbacks, source links, figure crops, long author/affiliation lists, table scrolling,
keyboard section navigation, and language switching while a paper is open.
Check the method steps, evidence paragraphs and limitations in both languages,
including mobile line wrapping and navigation to the longer sections.
