# Contributing to Awesome-Science-Agents

Thanks for helping curate this list! This guide explains how to add, edit, or report entries.

## Quick start

1. Fork the repo and create a branch off `main`.
2. Edit `README.md` to add or update an entry.
3. Open a Pull Request — `awesome-lint` will run automatically.

If you only want to suggest a paper without filing a PR, open an issue using the **Paper Submission** template.

## Entry format

Every entry follows this single-line template:

```
[YYYY-MM] ![tag1] ![tag2] "Title." Authors. Venue YYYY. [paper](url) | [code](url) | [project](url)
```

Rules:

- **Date**: ISO-style `[YYYY-MM]` based on the first public release (preprint date is fine). Wrap in square brackets.
- **Tags**: 1–3 shields.io badges from the taxonomy below. Order them most-specific first.
- **Title**: in double quotes, ending with a period inside the quotes.
- **Authors**: `First Last et al.` if more than three authors. Drop entirely only if truly unavailable.
- **Venue**: journal/conference name + year (e.g. `NeurIPS 2025`, `Nature 2024`). For preprints use `arXiv YYYY` or `bioRxiv YYYY`.
- **Links**: `[paper]` is required when a paper exists. Add `[code]`, `[project]`, `[platform]`, `[blog]` as available, separated by ` | `.

Example:

```markdown
[2025-12] ![Multi-Agent](https://img.shields.io/badge/Multi--Agent-1f6feb) ![Materials](https://img.shields.io/badge/Materials-2da44e) "CASCADE: Cumulative Agentic Skill Creation through Autonomous Development and Evolution." Xu Huang et al. arXiv 2025. [paper](https://arxiv.org/abs/2512.23880)
```

## Tag taxonomy

Type tags (blue, `1f6feb`):

- `Multi-Agent` — system orchestrates multiple LLM agents
- `LLM-Tool` — single agent + tool use
- `Benchmark` — evaluation suite or dataset
- `Survey` — review/survey paper
- `Framework` — reusable codebase or library
- `Platform` — hosted product / web platform

Domain tags (green, `2da44e`) — pick when relevant:

- `Materials`, `Chemistry`, `Drug-Discovery`, `Genomics`, `Clinical`, `Bioimaging`, `Simulation`

Badge URL format: `https://img.shields.io/badge/<TAG>-<COLOR>` (use `--` to escape literal hyphens, e.g. `Multi--Agent`).

## Sorting

Within each section, entries are sorted **reverse-chronologically by `YYYY-MM`**. Same-month entries: sort by arXiv id descending (or alphabetically if no arXiv id).

## Section choice

| Section | What goes here |
|---------|----------------|
| 🌐 Science General | Cross-domain agentic systems, AI scientists, research copilots |
| 📊 Benchmarks & Evaluation | Datasets, leaderboards, eval frameworks |
| ⚛️ Physical Sciences | Physics, Chemistry, Earth Sciences, Astronomy, Materials |
| 🧬 Life Science | Biology, Medicine, Neuroscience, Bioinformatics |
| 👥 Social Science & Simulation | Economics, sociology, political science, generative agent simulation |

If unsure, suggest a section in your PR description and a maintainer will help.

## PR checklist

- [ ] Entry follows the format template above
- [ ] Date is correct (`YYYY-MM`, first public release)
- [ ] Tags chosen from the taxonomy
- [ ] Placed in the correct section, in correct chronological order
- [ ] All links resolve (try them in an incognito window)
- [ ] No duplicate of an existing entry
- [ ] `awesome-lint` passes (run `npx awesome-lint` locally if possible)

## Reporting broken links

Open an issue using the **Broken Link** template. PRs that fix dead links are welcome.

## Code of conduct

Be respectful. We follow the [Contributor Covenant](https://www.contributor-covenant.org/). Submitting irrelevant content, spam, or self-promotion without scientific merit will be closed without discussion.
