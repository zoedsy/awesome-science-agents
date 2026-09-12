import copy
import importlib.util
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('builder', ROOT / 'scripts/build_dashboard.py')
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)


class BuildTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.readme = (ROOT / 'README.md').read_text()
        cls.notes = json.loads((ROOT / 'data/paper-notes.json').read_text())
        cls.reading = json.loads((ROOT / 'data/paper-reading.json').read_text())

    def test_all_readme_entries_are_covered(self):
        result = builder.build(self.readme, self.notes, self.reading)
        self.assertEqual(len(result['papers']), len(builder.read_catalog(self.readme)))

    def test_missing_notes_are_not_silently_omitted(self):
        notes = copy.deepcopy(self.notes)
        notes['entries'].pop(next(iter(notes['entries'])))
        with self.assertRaisesRegex(ValueError, 'Missing notes'):
            builder.build(self.readme, notes, self.reading)

    def test_untranslated_and_unsafe_entries_fail(self):
        for field, value in [('sources', ['javascript:alert(1)']), ('zh', {})]:
            notes = copy.deepcopy(self.notes)
            notes['entries'][next(iter(notes['entries']))][field] = value
            with self.assertRaises(ValueError):
                builder.build(self.readme, notes, self.reading)

    def test_ids_survive_readme_reordering(self):
        original = builder.build(self.readme, self.notes, self.reading)['papers']
        # Within-section bibliography order must not affect a paper's permalink.
        lines = self.readme.splitlines()
        first = [i for i, line in enumerate(lines) if line.startswith('[2026-')][:2]
        lines[first[0]], lines[first[1]] = lines[first[1]], lines[first[0]]
        changed = builder.build('\n'.join(lines), self.notes, self.reading)['papers']
        self.assertEqual({p['title']: p['id'] for p in original}, {p['title']: p['id'] for p in changed})

    def test_missing_reading_or_untranslated_figures_fail(self):
        reading = copy.deepcopy(self.reading)
        reading['entries'].pop(next(iter(reading['entries'])))
        with self.assertRaisesRegex(ValueError, 'Reading notes'):
            builder.build(self.readme, self.notes, reading)
        reading = copy.deepcopy(self.reading)
        entry = next(r for r in reading['entries'].values() if r['figures'])
        entry['figures'][0]['zh'] = ''
        with self.assertRaisesRegex(ValueError, 'bilingual figures'):
            builder.build(self.readme, self.notes, reading)

    def test_missing_or_untranslated_guides_fail(self):
        for missing in ('guide', 'zh', 'en'):
            with self.subTest(missing=missing):
                reading = copy.deepcopy(self.reading)
                entry = next(iter(reading['entries'].values()))
                if missing == 'guide':
                    entry.pop('guide')
                else:
                    entry['guide'].pop(missing)
                with self.assertRaisesRegex(ValueError, 'reading guide'):
                    builder.build(self.readme, self.notes, reading)

    def test_incomplete_guide_sections_fail(self):
        for lang in ('zh', 'en'):
            for field, value in [('context', ''), ('visual', ' '), ('caveat', None),
                                 ('steps', 'Not a list'), ('steps', ['Only one step']),
                                 ('steps', ['Step one', '', 'Step three']),
                                 ('evidence', []), ('evidence', ['Result', 42])]:
                with self.subTest(lang=lang, field=field, value=value):
                    reading = copy.deepcopy(self.reading)
                    entry = next(iter(reading['entries'].values()))
                    entry['guide'][lang][field] = value
                    with self.assertRaisesRegex(ValueError, f'guide {lang}.{field}'):
                        builder.build(self.readme, self.notes, reading)

    def test_unsafe_images_and_inconsistent_affiliations_fail(self):
        for bad_image in ['javascript:alert(1)', '../../private.png', 'data:image/svg+xml,unsafe']:
            reading = copy.deepcopy(self.reading)
            entry = next(r for r in reading['entries'].values() if r['figures'])
            entry['figures'][0]['images'] = [bad_image]
            with self.assertRaisesRegex(ValueError, 'source URL'):
                builder.build(self.readme, self.notes, reading)
        reading = copy.deepcopy(self.reading)
        entry = next(r for r in reading['entries'].values() if r['institutions'])
        entry['affiliationStatus'] = 'not-stated'
        with self.assertRaisesRegex(ValueError, 'affiliation status'):
            builder.build(self.readme, self.notes, reading)


if __name__ == '__main__':
    unittest.main()
