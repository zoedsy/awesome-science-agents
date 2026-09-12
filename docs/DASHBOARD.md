# Science Agent Atlas

An interactive Chinese/English reading dashboard for every dated entry in the
repository. Select a timeline dot or card to read the research question, method,
evaluation scope, and original sources. Search, discipline, mechanism, code-link,
topic, and month filters work together. Links preserve the current view and paper.

## Run locally

The committed site requires only a static HTTP server. It has no runtime packages,
API keys, analytics, remote fonts, or live paper-fetching dependencies.

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory docs
```

Open [the local atlas](http://localhost:4173/). Use HTTP rather than opening the HTML
file directly, because the site loads an ES module and a JSON file.

## Maintain the collection

`README.md` remains the source for titles, catalog months, sections, and outgoing
links. `data/paper-notes.json` contains reviewed bilingual explanations and source
provenance keyed by each entry's primary paper URL (or code URL for software).
`docs/data/papers.json` is the generated, committed snapshot served by the website.

1. Add or update the dated README entry.
2. Add the corresponding record in `data/paper-notes.json`, including Chinese and
   English problem, method, and evaluation paragraphs, original sources, the
   review date, and editorial type/mechanism tags. Do not paste full abstracts.
3. Run `python3 scripts/build_dashboard.py` and commit both the notes and snapshot.
4. Run `npm test` with Node.js 20+ and Python 3.9+; no `npm install` is needed.

The build fails on missing or stale notes, unsupported sections, invalid links,
duplicate primary URLs, or incomplete translations. Run
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
- The evolution-and-learning topic includes selected work on persistent memory,
  skill acquisition, program evolution, and test-time learning, plus a relevant
  benchmark. Inclusion does not certify recursive self-improvement or lifelong
  retention. Read each entry's evaluation paragraph for its actual scope.
- Related-paper suggestions share editorial mechanism tags; they are not citation
  edges. The source set includes research, surveys, perspectives, benchmarks,
  analytical studies, and software. Counts describe this collection only.
- Explanations are editorial paraphrases of abstracts, paper text, or official
  project materials, not independent replications. Author metadata is included
  when retrieved from the original source; absent metadata is left blank.

## GitHub Pages

After merging the site into `main`, configure repository **Settings → Pages →
Deploy from a branch → main → /docs**. Relative asset URLs support the project
subpath. The `.nojekyll` file makes this a plain static site; no custom workflow is
required. Then the expected address is
[Science Agent Atlas](https://zoedsy.github.io/awesome-science-agents/).
This configuration step is separate from building or merging the files.

## Verification

Automated tests cover bilingual completeness, all README entries, stable IDs,
combined filters, date boundaries, malformed URL state, and collision-free graph
layout at desktop and mobile widths. Browser checks should cover both languages,
search and empty-state reset, timeline playback, modal opening and Escape, direct
paper links, browser back/forward, code-only entries, and mobile navigation. Also
check the site under a path prefix before changing its asset paths.
