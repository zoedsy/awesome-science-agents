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

    def test_all_readme_entries_are_covered(self):
        result = builder.build(self.readme, self.notes)
        self.assertEqual(len(result['papers']), len(builder.read_catalog(self.readme)))

    def test_missing_notes_are_not_silently_omitted(self):
        notes = copy.deepcopy(self.notes)
        notes['entries'].pop(next(iter(notes['entries'])))
        with self.assertRaisesRegex(ValueError, 'Missing notes'):
            builder.build(self.readme, notes)

    def test_untranslated_and_unsafe_entries_fail(self):
        for field, value in [('sources', ['javascript:alert(1)']), ('zh', {})]:
            notes = copy.deepcopy(self.notes)
            notes['entries'][next(iter(notes['entries']))][field] = value
            with self.assertRaises(ValueError):
                builder.build(self.readme, notes)

    def test_ids_survive_readme_reordering(self):
        original = builder.build(self.readme, self.notes)['papers']
        # Within-section bibliography order must not affect a paper's permalink.
        lines = self.readme.splitlines()
        first = [i for i, line in enumerate(lines) if line.startswith('[2026-')][:2]
        lines[first[0]], lines[first[1]] = lines[first[1]], lines[first[0]]
        changed = builder.build('\n'.join(lines), self.notes)['papers']
        self.assertEqual({p['title']: p['id'] for p in original}, {p['title']: p['id'] for p in changed})


if __name__ == '__main__':
    unittest.main()
