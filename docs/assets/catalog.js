export const domains = {
  general: { zh: '通用科学', en: 'General science', color: '#29896a' },
  physical: { zh: '物理与材料', en: 'Physical sciences', color: '#b58745' },
  life: { zh: '生命科学', en: 'Life sciences', color: '#7a86bb' },
  social: { zh: '社会与模拟', en: 'Social & simulation', color: '#b97687' },
  benchmark: { zh: '基准与评估', en: 'Benchmarks', color: '#657f90' },
};
export const methods = {
  'multi-agent': { zh: '多智能体协作', en: 'Agent collaboration' },
  tools: { zh: '工具与执行', en: 'Tools & execution' },
  memory: { zh: '记忆与技能', en: 'Memory & skills' },
  evolution: { zh: '程序与策略演化', en: 'Program evolution' },
  training: { zh: '模型训练', en: 'Model training' },
  retrieval: { zh: '文献与知识检索', en: 'Knowledge retrieval' },
  simulation: { zh: '社会与物理模拟', en: 'Simulation' },
  evaluation: { zh: '评测与反思', en: 'Evaluation & critique' },
};
export const kinds = {
  research: { zh: '研究论文', en: 'Research paper' },
  survey: { zh: '综述', en: 'Review' },
  perspective: { zh: '观点 / 评论', en: 'Perspective / commentary' },
  study: { zh: '分析研究', en: 'Analytical study' },
  tool: { zh: '代码工具', en: 'Software tool' },
  benchmark: { zh: '评测基准', en: 'Benchmark' },
};
export function monthIndex(date) {
  const [year, month] = date.split('-').map(Number);
  return year * 12 + month - 1;
}
export function monthString(index) {
  return `${Math.floor(index / 12)}-${String(index % 12 + 1).padStart(2, '0')}`;
}
export function defaultState(maxMonth) {
  return { lang: 'zh', q: '', domain: '', method: '', topic: false, code: false,
    through: maxMonth, view: 'map', group: 'domain', sort: 'newest', paper: '' };
}
export function parseState(search, minMonth, maxMonth, papers) {
  const p = new URLSearchParams(search), s = defaultState(maxMonth);
  if (p.get('lang') === 'en') s.lang = 'en';
  s.q = (p.get('q') || '').slice(0, 250);
  if (Object.hasOwn(domains, p.get('domain'))) s.domain = p.get('domain');
  if (Object.hasOwn(methods, p.get('method'))) s.method = p.get('method');
  s.topic = p.get('topic') === 'evolving'; s.code = p.get('code') === '1';
  if (/^\d{4}-(0[1-9]|1[0-2])$/.test(p.get('through') || '')) {
    s.through = Math.min(maxMonth, Math.max(minMonth, monthIndex(p.get('through'))));
  }
  if (p.get('view') === 'list') s.view = 'list';
  if (p.get('group') === 'method') s.group = 'method';
  if (['oldest', 'name'].includes(p.get('sort'))) s.sort = p.get('sort');
  if (papers.some(row => row.id === p.get('paper'))) s.paper = p.get('paper');
  return s;
}
export function serializeState(s, maxMonth) {
  const p = new URLSearchParams({ lang: s.lang });
  for (const key of ['q', 'domain', 'method', 'paper']) if (s[key]) p.set(key, s[key]);
  if (s.topic) p.set('topic', 'evolving');
  if (s.code) p.set('code', '1');
  if (s.through !== maxMonth) p.set('through', monthString(s.through));
  if (s.view !== 'map') p.set('view', s.view);
  if (s.group !== 'domain') p.set('group', s.group);
  if (s.sort !== 'newest') p.set('sort', s.sort);
  return p.toString();
}
export function filterPapers(papers, state) {
  const terms = state.q.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return papers.filter(p => {
    if (state.domain && state.domain !== p.domain) return false;
    if (state.method && !p.methods.includes(state.method)) return false;
    if (state.topic && !p.evolving) return false;
    if (state.code && !p.links.code) return false;
    if (monthIndex(p.date) > state.through) return false;
    const searchable = [p.name, p.title, p.sourceTitle, ...p.authors,
      ...Object.values(p.zh), ...Object.values(p.en), domains[p.domain].zh, domains[p.domain].en,
      ...p.methods.flatMap(m => [methods[m].zh, methods[m].en])].join(' ').toLocaleLowerCase();
    return terms.every(term => searchable.includes(term));
  }).sort((a, b) => state.sort === 'name' ? a.name.localeCompare(b.name) :
    (state.sort === 'oldest' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)) || a.name.localeCompare(b.name));
}
// Keep x strictly tied to the catalog month. Vertical stacking only prevents collisions.
export function layoutPapers(papers, group, width, minMonth, maxMonth) {
  const keys = Object.keys(group === 'domain' ? domains : methods);
  const left = 145, right = 40, plotWidth = Math.max(100, width - left - right);
  const xFor = date => left + (monthIndex(date) - minMonth) / Math.max(1, maxMonth - minMonth) * plotWidth;
  let top = 38;
  const lanes = [], nodes = [];
  for (const key of keys) {
    const items = papers.filter(p => (group === 'domain' ? p.domain : p.methods[0]) === key)
      .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
    if (group === 'method' && !items.length) continue;
    const tracks = [], placed = [];
    for (const paper of items) {
      const x = xFor(paper.date);
      let track = tracks.findIndex(previousX => x - previousX >= 25);
      if (track < 0) track = tracks.length;
      tracks[track] = x; placed.push({ paper, x, track });
    }
    const height = Math.max(64, tracks.length * 25 + 22);
    lanes.push({ key, top, height, count: items.length });
    for (const p of placed) nodes.push({ paper: p.paper, x: p.x,
      y: top + height / 2 + (p.track - (tracks.length - 1) / 2) * 25 });
    top += height;
  }
  return { lanes, nodes, height: top + 28, xFor, left, right };
}
