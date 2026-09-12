#!/usr/bin/env python3
"""Build the static atlas from README entries and reviewed bilingual notes."""
import argparse
import hashlib
import json
from pathlib import Path
import re
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
METHODS = {'multi-agent', 'tools', 'memory', 'evolution', 'training', 'retrieval', 'simulation', 'evaluation'}
KINDS = {'research', 'survey', 'perspective', 'study', 'tool', 'benchmark'}
DOMAINS = {
    'Science General': 'general',
    'Self-Evolving Agents and Continual Learning': 'general',
    'Benchmarks & Evaluation': 'benchmark',
    'Physical Sciences': 'physical',
    'Life Science': 'life',
    'Social Science & Simulation': 'social',
}


def read_catalog(text):
    section = ''
    rows = []
    for line in text.splitlines():
        if line.startswith('##'):
            section = line.lstrip('# ').strip()
        if not re.match(r'^\[\d{4}-\d{2}\]', line):
            continue
        title = re.search(r'"([^"]+)"', line)
        if not title or section not in DOMAINS:
            raise ValueError(f'Unrecognized bibliography entry: {line}')
        links = dict(re.findall(r'(?<!!)\[([^\]]+)\]\(([^)]+)\)', line))
        primary = links.get('paper') or links.get('code')
        if not primary:
            raise ValueError(f'Missing primary source: {line}')
        rows.append({'title': title.group(1).rstrip('.'), 'date': line[1:8],
                     'domain': DOMAINS[section], 'section': section,
                     'links': links, 'primary': primary})
    if not rows:
        raise ValueError('No dated README entries found')
    return rows


def validate_note(key, note):
    for lang in ('zh', 'en'):
        for field in ('problem', 'method', 'evaluation'):
            if not isinstance(note.get(lang, {}).get(field), str) or not note[lang][field].strip():
                raise ValueError(f'{key}: missing {lang}.{field}')
    if note.get('kind') not in KINDS or not note.get('methods') or not set(note['methods']) <= METHODS:
        raise ValueError(f'{key}: invalid kind or mechanism')
    if not note.get('name') or not isinstance(note.get('evolving'), bool):
        raise ValueError(f'{key}: missing name or topic classification')
    if note.get('basis') not in {'paper', 'project'} or not note.get('sources'):
        raise ValueError(f'{key}: missing source provenance')
    if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', note.get('reviewed', '')):
        raise ValueError(f'{key}: missing review date')
    if not isinstance(note.get('authors'), list):
        raise ValueError(f'{key}: invalid authors')


def validate_reading(key, reading):
    def public(url):
        parsed = urlparse(url)
        if parsed.scheme not in {'https', 'http'} or not parsed.netloc:
            raise ValueError(f'{key}: invalid reading source URL: {url}')

    for field in ('fullText', 'institutionSource'):
        public(reading.get(field, ''))
    institutions = reading.get('institutions')
    if not isinstance(institutions, list) or any(not isinstance(x, str) or not x.strip() for x in institutions):
        raise ValueError(f'{key}: invalid institutions')
    status = reading.get('affiliationStatus')
    if status not in {'verified', 'partial', 'not-stated'} or bool(institutions) == (status == 'not-stated'):
        raise ValueError(f'{key}: inconsistent affiliation status')
    for lang in ('zh', 'en'):
        items = reading.get('takeaways', {}).get(lang)
        if not isinstance(items, list) or not items or any(not isinstance(x, str) or not x.strip() for x in items):
            raise ValueError(f'{key}: missing {lang} takeaways')
    for kind in ('figures', 'tables'):
        if not isinstance(reading.get(kind), list):
            raise ValueError(f'{key}: missing {kind}')
        for item in reading[kind]:
            public(item.get('source', ''))
            if any(not isinstance(item.get(k), str) or not item[k].strip() for k in ('label', 'zh', 'en')):
                raise ValueError(f'{key}: missing bilingual {kind} explanation')
            if kind == 'figures':
                if not item.get('images'):
                    raise ValueError(f'{key}: figure has no image')
                sizes = item.get('sizes', [])
                if len(sizes) != len(item['images']) or any(
                    not isinstance(size, list) or len(size) != 2 or
                    any(not isinstance(n, int) or not 1 <= n <= 100000 for n in size)
                    for size in sizes
                ):
                    raise ValueError(f'{key}: missing figure dimensions')
                for image in item['images']:
                    if re.fullmatch(r'assets/paper-figures/p-[a-f0-9]{12}(?:-[a-z0-9]+)?\.png', image):
                        if not (ROOT / 'docs' / image).is_file():
                            raise ValueError(f'{key}: missing figure asset: {image}')
                    else:
                        public(image)
            else:
                if not item.get('grid') or not all(isinstance(row, list) and row for row in item['grid']):
                    raise ValueError(f'{key}: empty table')
                for row in item['grid']:
                    for cell in row:
                        if not isinstance(cell.get('text'), str) or any(
                            not isinstance(cell.get(k), int) or not 1 <= cell[k] <= 100 for k in ('colspan', 'rowspan')
                        ):
                            raise ValueError(f'{key}: malformed table cell')


def build(readme, editorial, reading):
    catalog = read_catalog(readme)
    keys = [r['primary'] for r in catalog]
    if len(set(keys)) != len(keys):
        raise ValueError('Duplicate primary source in README')
    missing = set(keys) - editorial['entries'].keys()
    stale = editorial['entries'].keys() - set(keys)
    if missing or stale:
        raise ValueError(f'Notes and README differ. Missing notes: {sorted(missing)}; stale notes: {sorted(stale)}')
    if set(keys) != set(reading['entries']):
        raise ValueError('Reading notes and README differ')
    result = []
    for row in catalog:
        key = row.pop('primary')
        note = editorial['entries'][key]
        validate_note(key, note)
        validate_reading(key, reading['entries'][key])
        for url in list(row['links'].values()) + note['sources']:
            parsed = urlparse(url)
            if parsed.scheme not in {'https', 'http'} or not parsed.netloc:
                raise ValueError(f'Invalid public URL: {url}')
        if not 1 <= int(row['date'][-2:]) <= 12:
            raise ValueError(f'Invalid month: {row["date"]}')
        result.append({'id': 'p-' + hashlib.sha256(key.encode()).hexdigest()[:12], **row, **note,
                       'reading': reading['entries'][key]})
    return {'schemaVersion': 2, 'reviewed': max(editorial['reviewed'], reading['reviewed']),
            'repository': 'https://github.com/zoedsy/awesome-science-agents', 'papers': result}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='fail if the committed snapshot is stale')
    args = parser.parse_args()
    editorial = json.loads((ROOT / 'data/paper-notes.json').read_text())
    reading = json.loads((ROOT / 'data/paper-reading.json').read_text())
    payload = build((ROOT / 'README.md').read_text(), editorial, reading)
    rendered = json.dumps(payload, ensure_ascii=False, indent=2) + '\n'
    target = ROOT / 'docs/data/papers.json'
    if args.check:
        if not target.exists() or target.read_text() != rendered:
            raise SystemExit('Dashboard data is stale. Run python3 scripts/build_dashboard.py')
        print(f'Dashboard is current: {len(payload["papers"])} bilingual entries')
    else:
        target.parent.mkdir(exist_ok=True)
        target.write_text(rendered)
        print(f'Built {target.relative_to(ROOT)}: {len(payload["papers"])} bilingual entries')


if __name__ == '__main__':
    main()
