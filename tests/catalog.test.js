import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { domains, methods, monthIndex, monthString, defaultState, parseState,
  serializeState, filterPapers, layoutPapers } from '../docs/assets/catalog.js';

const { papers } = JSON.parse(readFileSync(new URL('../docs/data/papers.json', import.meta.url)));
const min = Math.min(...papers.map(p => monthIndex(p.date)));
const max = Math.max(...papers.map(p => monthIndex(p.date)));

test('all entries have unique IDs, bilingual explanations and traceable sources', () => {
  assert.equal(new Set(papers.map(p => p.id)).size, papers.length);
  for (const p of papers) {
    for (const lang of ['zh', 'en']) for (const field of ['problem', 'method', 'evaluation']) {
      assert.ok(p[lang][field].length > 10, `${p.name}: ${lang}.${field}`);
    }
    assert.ok(p.sources.every(url => new URL(url).protocol.startsWith('http')));
    assert.ok(domains[p.domain]); assert.ok(p.methods.every(m => methods[m]));
  }
});
test('combined filters return the intersection and search both languages', () => {
  const s = { ...defaultState(max), domain: 'life', method: 'memory', topic: true, q: '证据' };
  const matches = filterPapers(papers, s);
  assert.ok(matches.some(p => p.name === 'ADMET-EvO'));
  assert.ok(matches.every(p => p.domain === 'life' && p.methods.includes('memory') && p.evolving));
  assert.ok(filterPapers(papers, { ...s, q: 'evidence' }).some(p => p.name === 'ADMET-EvO'));
  assert.equal(filterPapers(papers, { ...s, q: 'no-such-paper-xyz' }).length, 0);
  assert.ok(filterPapers(papers, { ...defaultState(max), code: true }).every(p => p.links.code));
});
test('dates, sorting and state round trips preserve shareable views', () => {
  for (let month = min; month <= max; month++) assert.equal(monthIndex(monthString(month)), month);
  const s = { ...defaultState(max), lang: 'en', q: '记忆 & skills', method: 'memory', code: true,
    topic: true, domain: 'life', through: min + 12, view: 'list', group: 'method', sort: 'name', paper: papers[3].id };
  assert.deepEqual(parseState(serializeState(s, max), min, max, papers), s);
  assert.ok(filterPapers(papers, s).every(p => monthIndex(p.date) <= min + 12));
  const oldest = filterPapers(papers, { ...defaultState(max), sort: 'oldest' });
  assert.ok(oldest.every((p, i) => !i || p.date >= oldest[i - 1].date));
});
test('malformed and unknown URL parameters cannot create invalid UI states', () => {
  const state = parseState('?domain=__proto__&method=constructor&lang=xx&through=2024-99&paper=missing&view=unknown', min, max, papers);
  assert.deepEqual(state, defaultState(max));
  assert.equal(parseState('?through=9999-01', min, max, papers).through, max);
  assert.equal(parseState('?through=0000-01', min, max, papers).through, min);
});
test('timeline layout preserves dates and prevents overlapping controls at responsive widths', () => {
  for (const width of [580, 760, 1050]) for (const group of ['domain', 'method']) {
    const layout = layoutPapers(papers, group, width, min, max);
    assert.equal(layout.nodes.length, papers.length);
    for (const [i, a] of layout.nodes.entries()) {
      assert.equal(a.x, layout.xFor(a.paper.date));
      assert.ok(a.x >= 145 && a.x <= width - 40);
      for (const b of layout.nodes.slice(i + 1)) {
        assert.ok(Math.abs(a.x - b.x) >= 24 || Math.abs(a.y - b.y) >= 24,
          `${width}/${group}: ${a.paper.name} overlaps ${b.paper.name}`);
      }
    }
  }
});
