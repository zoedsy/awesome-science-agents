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


def build(readme, editorial):
    catalog = read_catalog(readme)
    keys = [r['primary'] for r in catalog]
    if len(set(keys)) != len(keys):
        raise ValueError('Duplicate primary source in README')
    missing = set(keys) - editorial['entries'].keys()
    stale = editorial['entries'].keys() - set(keys)
    if missing or stale:
        raise ValueError(f'Notes and README differ. Missing notes: {sorted(missing)}; stale notes: {sorted(stale)}')
    result = []
    for row in catalog:
        key = row.pop('primary')
        note = editorial['entries'][key]
        validate_note(key, note)
        for url in list(row['links'].values()) + note['sources']:
            parsed = urlparse(url)
            if parsed.scheme not in {'https', 'http'} or not parsed.netloc:
                raise ValueError(f'Invalid public URL: {url}')
        if not 1 <= int(row['date'][-2:]) <= 12:
            raise ValueError(f'Invalid month: {row["date"]}')
        result.append({'id': 'p-' + hashlib.sha256(key.encode()).hexdigest()[:12], **row, **note})
    return {'schemaVersion': 1, 'reviewed': editorial['reviewed'],
            'repository': 'https://github.com/zoedsy/awesome-science-agents', 'papers': result}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='fail if the committed snapshot is stale')
    args = parser.parse_args()
    editorial = json.loads((ROOT / 'data/paper-notes.json').read_text())
    payload = build((ROOT / 'README.md').read_text(), editorial)
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
