import { institutionBlock, takeawayBlock, readerNavigation, evidenceBlocks, readingSource, guideBlocks, caveatBlock } from './reader.js';
import { domains, methods, kinds, monthIndex, monthString, defaultState, parseState,
  serializeState, filterPapers, layoutPapers } from './catalog.js';

const words = {
  zh: {
    exploreLabel: '探索 / EXPLORE', allPapers: '全部条目', evolving: '自我演化与持续学习',
    domainsLabel: '研究领域 / DISCIPLINES', sidebarNote: '让论文之间的脉络，比论文数量更清晰。',
    library: '研究文库', atlas: '论文图谱', readingGuide: '专题阅读指南 ↗',
    heroTitle: '看见科学智能体的演进。', heroSubtitle: '从协作研究到自我演化。探索每篇论文解决的问题、采用的方法与验证的边界。',
    edition: '文献快照', metricPapers: '论文与研究工具', metricEvolving: '演化与学习专题', metricYears: '研究时间跨度',
    landscapeTitle: '一张地图，读懂研究脉络。', mapView: '时间图谱', listView: '论文列表',
    methodFilter: '筛选研究机制', allMethods: '全部研究机制', hasCode: '有代码链接', clearFilters: '清除筛选',
    mapHint: '横轴为文库标注月份，点按类别排列。点击任意一点，阅读研究解读。',
    groupBy: '分组', byDomain: '按研究领域', byMethod: '按主要机制', play: '播放演进', pause: '暂停',
    publishedThrough: '时间截至', papersTitle: '从一篇论文开始', sortLabel: '排序', newest: '最新优先', oldest: '最早优先', byName: '按名称排序',
    noResults: '没有匹配的条目', noResultsHint: '试试更短的关键词，或放宽领域、机制与时间范围。', resetAll: '查看全部条目',
    footerNote: '解读依据论文正文、摘要与官方资料，领域与机制为编辑归类。横轴沿用 README 标注月份；所有计数仅代表本库收录，非领域总体。',
    contribute: '补充一篇论文 ↗', paperDetail: 'PAPER NOTES / 论文解读', search: '搜索论文、作者、机构或问题…',
    count: n => `${n} 个匹配条目`, more: n => `再看 ${Math.min(n, 24)} 篇 · 还有 ${n} 个条目`,
    question: '解决什么问题', approach: '具体怎么做', evidence: '在哪里验证 · 如何理解', mechanism: '研究机制',
    original: '阅读原文 ↗', code: '查看代码 ↗', project: '项目主页 ↗', source: '解读来源',
    sourcePaper: '依据论文摘要或正文整理；中文与英文均为编辑解读。', sourceProject: '依据官方项目资料整理；中文与英文均为编辑解读。',
    reviewed: '资料核对', dateLabel: '文库标注月份', authors: '作者', copy: '复制当前链接', copied: '已复制，可分享这篇论文与当前筛选',
    copyFallback: '请复制浏览器地址栏中的链接', related: '沿着同一机制继续读', relatedHint: '按共同机制推荐，不表示论文间存在引用关系。',
    close: '关闭论文详情', navigation: '打开导航', paperGrid: '研究条目', timeline: '交互式研究时间轴',
    swipe: '横向滑动，查看完整时间轴 →',
    topicFilter: '只看自我演化与持续学习', topicHint: '跨领域专题，可与其他筛选组合',
  },
  en: {
    exploreLabel: 'EXPLORE', allPapers: 'All entries', evolving: 'Evolution & learning', domainsLabel: 'DISCIPLINES',
    sidebarNote: 'A clearer view of the ideas connecting scientific agents.', library: 'Library', atlas: 'Research atlas', readingGuide: 'Reading guide ↗',
    heroTitle: 'Mapping the next scientific mind.', heroSubtitle: 'From collaboration to self-evolution. Explore the questions, methods and evidence behind every paper.',
    edition: 'COLLECTION SNAPSHOT', metricPapers: 'Papers & research tools', metricEvolving: 'Evolution & learning', metricYears: 'Years of research',
    landscapeTitle: 'A landscape of connected ideas.', mapView: 'Timeline', listView: 'Paper list',
    methodFilter: 'Filter by mechanism', allMethods: 'All mechanisms', hasCode: 'Code linked', clearFilters: 'Clear filters',
    mapHint: 'The x-axis follows catalog months; rows group entries. Select any dot to read its research notes.',
    groupBy: 'Group', byDomain: 'By discipline', byMethod: 'By primary mechanism', play: 'Play timeline', pause: 'Pause',
    publishedThrough: 'Through', papersTitle: 'Start with a paper', sortLabel: 'Sort papers', newest: 'Newest first', oldest: 'Oldest first', byName: 'By name',
    noResults: 'No matching entries', noResultsHint: 'Try a shorter query, or broaden the discipline, mechanism or date range.', resetAll: 'View all entries',
    footerNote: 'Notes draw on paper texts, abstracts and official materials. Disciplines and mechanisms are editorial categories. Dates follow README months; counts describe this collection, not the entire field.',
    contribute: 'Contribute a paper ↗', paperDetail: 'PAPER NOTES', search: 'Search papers, authors, institutions or questions…',
    count: n => `${n} matching ${n === 1 ? 'entry' : 'entries'}`, more: n => `Load ${Math.min(n, 24)} more · ${n} remaining`,
    question: 'The research question', approach: 'How it works', evidence: 'Evidence & scope', mechanism: 'Research mechanisms',
    original: 'Read paper ↗', code: 'View code ↗', project: 'Visit project ↗', source: 'About these notes',
    sourcePaper: 'Editorial explanations based on the paper abstract or text, available in Chinese and English.',
    sourceProject: 'Editorial explanations based on official project materials, available in Chinese and English.',
    reviewed: 'Sources reviewed', dateLabel: 'Catalog month', authors: 'Authors', copy: 'Copy current link', copied: 'Link copied, including this paper and your filters',
    copyFallback: 'Copy the link from your browser address bar', related: 'Follow the same mechanism', relatedHint: 'Suggestions share editorial tags; they do not imply a citation relationship.',
    close: 'Close paper details', navigation: 'Open navigation', paperGrid: 'Research entries', timeline: 'Interactive research timeline',
    swipe: 'Swipe to explore the full timeline →',
    topicFilter: 'Evolution & learning only', topicHint: 'A cross-disciplinary topic; combine with other filters',
  },
};
const $ = id => document.getElementById(id);
const element = (tag, className, text) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
};
const link = (url, label) => {
  const a = element('a', '', label); a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; return a;
};
let papers = [], state, minMonth, maxMonth, visibleLimit = 24, timer = null, snapshot;
let shown = [], toastTimer, layoutFrame, returnFocus;
const t = key => words[state.lang][key];
const label = (collection, key) => collection[key][state.lang];
const tooltip = $('map-tooltip');
const dialog = $('paper-dialog');

function saveURL(push = false) {
  const url = new URL(location.href); url.search = serializeState(state, maxMonth); url.hash = '';
  if (url.href !== location.href) history[push ? 'pushState' : 'replaceState']({}, '', url);
}
function setLanguage(lang) {
  state.lang = lang;
  try { localStorage.setItem('science-atlas-language', lang); } catch { /* Storage can be disabled. */ }
  render(); saveURL();
  if (dialog.open) renderDetail(papers.find(p => p.id === state.paper));
}
function translate() {
  document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : 'en';
  document.title = state.lang === 'zh' ? '科学智能体图谱 · Science Agent Atlas' : 'Science Agent Atlas';
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  for (const lang of ['zh', 'en']) {
    $(`lang-${lang}`).setAttribute('aria-pressed', state.lang === lang);
    $(`detail-lang-${lang}`).setAttribute('aria-pressed', state.lang === lang);
  }
  $('search').placeholder = t('search'); $('search').setAttribute('aria-label', t('search'));
  $('close-detail').setAttribute('aria-label', t('close'));
  $('menu-toggle').setAttribute('aria-label', t('navigation'));
  $('paper-grid').setAttribute('aria-label', t('paperGrid'));
  $('research-map').setAttribute('aria-label', t('timeline'));
  $('mechanism-filter').replaceChildren(new Option(t('allMethods'), ''),
    ...Object.keys(methods).map(key => new Option(label(methods, key), key)));
  $('mechanism-filter').value = state.method;
  syncPlay();
}
function badge(p) {
  const b = element('span', 'domain-badge');
  b.style.setProperty('--domain', domains[p.domain].color);
  b.append(element('span', 'domain-dot'), document.createTextNode(label(domains, p.domain)));
  return b;
}
function setSidebar(open) {
  $('sidebar').classList.toggle('open', open); $('menu-toggle').setAttribute('aria-expanded', open);
  const hidden = matchMedia('(max-width: 680px)').matches && !open;
  $('sidebar').inert = hidden;
  if (hidden) $('sidebar').setAttribute('aria-hidden', 'true');
  else $('sidebar').removeAttribute('aria-hidden');
  if (open) $('nav-all').focus();
}
function change(patch, { stop = true } = {}) {
  if (stop) stopPlay(); Object.assign(state, patch); visibleLimit = 24;
  render(); saveURL(); setSidebar(false);
}
function reset() { change({ ...defaultState(maxMonth), lang: state.lang, paper: state.paper }); }
function renderNav() {
  $('nav-all').classList.toggle('active', !state.domain);
  $('nav-all').setAttribute('aria-pressed', !state.domain);
  $('domain-nav').replaceChildren(...Object.keys(domains).map(key => {
    const button = element('button', `nav-item${state.domain === key ? ' active' : ''}`);
    button.dataset.domain = key; button.setAttribute('aria-pressed', state.domain === key);
    const dot = element('span', 'domain-dot'); dot.style.background = domains[key].color;
    button.append(dot, element('span', '', label(domains, key)),
      element('span', 'nav-count', papers.filter(p => p.domain === key).length));
    button.addEventListener('click', () => change({ domain: state.domain === key ? '' : key }));
    return button;
  }));
}
function renderFilters() {
  $('result-count').textContent = t('count')(shown.length);
  $('search').value = state.q; $('code-filter').checked = state.code;
  $('topic-filter').checked = state.topic;
  $('group-by').value = state.group; $('sort').value = state.sort;
  $('timeline').value = state.through - minMonth;
  const date = monthString(state.through).replace('-', '.');
  $('timeline-date').value = date; $('timeline').setAttribute('aria-valuetext', date);
  const tags = [];
  for (const [key, text, value] of [
    ['domain', state.domain && label(domains, state.domain), ''],
    ['method', state.method && label(methods, state.method), ''],
    ['topic', state.topic && t('evolving'), false],
    ['code', state.code && t('hasCode'), false],
    ['through', state.through < maxMonth && `${t('publishedThrough')} ${date}`, maxMonth],
  ]) if (text) {
    const button = element('button', 'filter-chip', `${text} ×`);
    button.addEventListener('click', () => change({ [key]: value })); tags.push(button);
  }
  $('filter-tags').replaceChildren(...tags); $('reset').hidden = !tags.length && !state.q;
  for (const view of ['map', 'list']) $(`view-${view}`).setAttribute('aria-pressed', state.view === view);
  $('map-panel').hidden = state.view !== 'map';
}
function showTooltip(p, event) {
  tooltip.replaceChildren(element('strong', '', p.name), element('p', '', p[state.lang].problem));
  tooltip.hidden = false;
  const rect = event.currentTarget.getBoundingClientRect();
  const x = event.clientX || rect.x + rect.width / 2, y = event.clientY || rect.y;
  tooltip.style.left = `${Math.max(10, Math.min(x + 12, innerWidth - tooltip.offsetWidth - 12))}px`;
  tooltip.style.top = `${Math.max(8, y - tooltip.offsetHeight - 12)}px`;
}
function renderMap() {
  if (state.view !== 'map') return;
  tooltip.hidden = true;
  const map = $('research-map'), width = Math.max(580, map.clientWidth);
  const layout = layoutPapers(shown, state.group, width, minMonth, maxMonth);
  map.style.height = `${layout.height}px`;
  const content = [];
  const startYear = Math.floor(minMonth / 12), endYear = Math.floor(maxMonth / 12);
  for (let year = startYear; year <= endYear; year++) {
    const x = layout.xFor(`${year}-01`);
    if (x < layout.left) continue;
    const line = element('span', 'map-gridline'); line.style.left = `${x}px`;
    const tick = element('span', 'map-axis-tick', year); tick.style.left = `${x}px`;
    content.push(line, tick);
  }
  const collection = state.group === 'domain' ? domains : methods;
  for (const lane of layout.lanes) {
    const line = element('span', 'map-lane-line'); line.style.top = `${lane.top + lane.height}px`;
    const name = element('span', 'map-lane-label'); name.style.top = `${lane.top + lane.height / 2}px`;
    name.append(document.createTextNode(label(collection, lane.key)), element('small', '', lane.count));
    content.push(line, name);
  }
  for (const node of layout.nodes) {
    const p = node.paper, button = element('button', 'paper-node');
    button.dataset.paper = p.id; button.style.setProperty('--domain', domains[p.domain].color);
    button.style.setProperty('--x', `${node.x}px`); button.style.setProperty('--y', `${node.y}px`);
    button.setAttribute('aria-label', `${p.name} · ${p.date} · ${p[state.lang].problem}`);
    button.addEventListener('click', () => openPaper(p.id));
    button.addEventListener('pointerenter', event => showTooltip(p, event));
    button.addEventListener('focus', event => showTooltip(p, event));
    button.addEventListener('pointerleave', () => { tooltip.hidden = true; });
    button.addEventListener('blur', () => { tooltip.hidden = true; });
    content.push(button);
  }
  map.replaceChildren(...content);
}
function renderCards() {
  $('paper-grid').replaceChildren(...shown.slice(0, visibleLimit).map(p => {
    const button = element('button', 'paper-card'); button.dataset.paper = p.id;
    button.setAttribute('aria-label', `${p.name} — ${p[state.lang].problem}`);
    const top = element('div', 'card-top'); top.append(badge(p), element('span', 'card-date', p.date.replace('-', '.')));
    const bottom = element('div', 'card-bottom');
    bottom.append(element('span', 'method-label', label(methods, p.methods[0])), element('span', 'card-open', '↗'));
    button.append(top, element('h4', '', p.name), element('p', 'card-title', p.title),
      element('p', 'card-summary', p[state.lang].problem), bottom);
    button.addEventListener('click', () => openPaper(p.id)); return button;
  }));
  $('empty-state').hidden = shown.length > 0;
  $('load-more').hidden = visibleLimit >= shown.length;
  $('load-more').textContent = t('more')(Math.max(0, shown.length - visibleLimit));
}
function render() {
  translate(); shown = filterPapers(papers, state);
  renderNav(); renderFilters(); renderMap(); renderCards();
}
function section(number, title, body) {
  const block = element('section', 'detail-section'), heading = element('h3');
  heading.append(element('span', 'section-number', number), document.createTextNode(title));
  block.append(heading, element('p', '', body)); return block;
}
function renderDetail(p) {
  if (!p) return;
  const root = $('detail-content'); root.replaceChildren();
  const heading = element('h2', 'detail-title', p.name); heading.id = 'detail-title';
  const meta = element('div', 'detail-meta', `${t('dateLabel')} ${p.date}  /  ${label(kinds, p.kind)}`);
  root.append(badge(p), heading, element('p', 'detail-fulltitle', p.title), meta);
  root.append(institutionBlock(p, state.lang));
  const links = element('div', 'detail-links');
  if (p.links.paper) links.append(link(p.links.paper, t('original')));
  if (p.links.code) links.append(link(p.links.code, t('code')));
  const project = p.links.project || p.links.platform || p.links.website || p.links.blog;
  if (project && project !== p.links.code) links.append(link(project, t('project')));
  const overview = section('01', t('question'), p[state.lang].problem);
  overview.id = 'reader-overview'; overview.tabIndex = -1;
  root.append(links, takeawayBlock(p, state.lang), readerNavigation(p, state.lang), overview,
    ...(p.reading.guide ? guideBlocks(p, state.lang) : [section('02', t('approach'), p[state.lang].method)]),
    ...evidenceBlocks(p, state.lang), ...caveatBlock(p, state.lang));
  const mechanism = element('section', 'detail-section'); mechanism.append(element('h3', '', t('mechanism')));
  const tags = element('div', 'detail-methods');
  for (const method of p.methods) {
    const tag = element('button', 'filter-chip', label(methods, method));
    tag.addEventListener('click', () => { closePaper(); change({ method }); }); tags.append(tag);
  }
  mechanism.append(tags); root.append(mechanism);
  const source = element('section', 'detail-source'); source.id = 'reader-source'; source.tabIndex = -1;
  source.append(element('strong', '', t('source')), element('p', '', p.basis === 'project' ? t('sourceProject') : t('sourcePaper')));
  source.append(readingSource(p, state.lang));
  p.sources.forEach((url, i) => source.append(link(url, `${i + 1}. ${new URL(url).hostname.replace(/^www\./, '')} ↗`)));
  source.append(element('p', '', `${t('reviewed')}: ${p.reviewed}`));
  const share = element('button', 'detail-share', t('copy')); share.addEventListener('click', copyLink);
  root.append(source, share);
  const related = papers.filter(other => other.id !== p.id && other.methods.includes(p.methods[0]))
    .sort((a, b) => (b.domain === p.domain) - (a.domain === p.domain) || b.date.localeCompare(a.date)).slice(0, 3);
  if (related.length) {
    const block = element('section', 'detail-related');
    block.append(element('h3', '', t('related')), element('p', 'related-note', t('relatedHint')));
    related.forEach(other => {
      const button = element('button', 'related-button', `${other.name}  ↗`);
      button.addEventListener('click', () => openPaper(other.id)); block.append(button);
    }); root.append(block);
  }
}
function openPaper(id, push = true) {
  const p = papers.find(paper => paper.id === id); if (!p) return;
  stopPlay(); tooltip.hidden = true;
  if (!dialog.open) returnFocus = document.activeElement;
  state.paper = id; renderDetail(p); saveURL(push);
  if (!dialog.open) { dialog.showModal(); document.body.classList.add('detail-open'); }
  dialog.querySelector('.detail-scroll').scrollTop = 0; $('close-detail').focus();
}
function closePaper() {
  state.paper = ''; saveURL();
  if (dialog.open) dialog.close();
  document.body.classList.remove('detail-open');
  if (returnFocus?.isConnected) returnFocus.focus();
  else $('search').focus();
}
async function copyLink() {
  let message = t('copied');
  try { await navigator.clipboard.writeText(location.href); } catch { message = t('copyFallback'); }
  dialog.querySelector('.detail-share').textContent = message;
  $('toast').textContent = message; $('toast').hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { $('toast').hidden = true; }, 3000);
}
function syncPlay() {
  $('play-symbol').textContent = timer ? 'Ⅱ' : '▶'; $('play-label').textContent = t(timer ? 'pause' : 'play');
  $('play').setAttribute('aria-label', t(timer ? 'pause' : 'play')); $('play').setAttribute('aria-pressed', Boolean(timer));
}
function stopPlay() { if (timer) clearInterval(timer); timer = null; if (state) syncPlay(); }
function play() {
  if (timer) { stopPlay(); return; }
  if (state.through >= maxMonth) state.through = minMonth;
  visibleLimit = 24;
  timer = setInterval(() => {
    state.through = Math.min(maxMonth, state.through + 1);
    if (state.through === maxMonth) stopPlay();
    render(); saveURL();
  }, 600);
  render(); saveURL();
}
function bind() {
  setSidebar(false);
  window.addEventListener('resize', () => setSidebar(false));
  const langControls = element('div', 'language-switch');
  langControls.setAttribute('role', 'group'); langControls.setAttribute('aria-label', 'Language');
  for (const lang of ['zh', 'en']) {
    const button = element('button', '', lang === 'zh' ? '中' : 'EN'); button.id = `detail-lang-${lang}`;
    langControls.append(button); button.addEventListener('click', () => setLanguage(lang));
    $(`lang-${lang}`).addEventListener('click', () => setLanguage(lang));
  }
  $('close-detail').before(langControls);
  $('nav-all').addEventListener('click', () => change({ domain: '', topic: false }));
  $('topic-filter').addEventListener('change', event => change({ topic: event.target.checked }));
  $('search').addEventListener('input', event => change({ q: event.target.value }));
  $('mechanism-filter').addEventListener('change', event => change({ method: event.target.value }));
  $('code-filter').addEventListener('change', event => change({ code: event.target.checked }));
  $('group-by').addEventListener('change', event => change({ group: event.target.value }));
  $('sort').addEventListener('change', event => change({ sort: event.target.value }));
  $('timeline').addEventListener('input', event => change({ through: minMonth + Number(event.target.value) }));
  $('play').addEventListener('click', play);
  ['reset', 'empty-reset'].forEach(id => $(id).addEventListener('click', reset));
  ['map', 'list'].forEach(view => $(`view-${view}`).addEventListener('click', () => change({ view })));
  $('load-more').addEventListener('click', () => {
    const next = visibleLimit; visibleLimit += 24; renderCards();
    $('paper-grid').children[next]?.focus({ preventScroll: true });
  });
  $('menu-toggle').addEventListener('click', () => setSidebar(!$('sidebar').classList.contains('open')));
  document.addEventListener('click', event => {
    if (!$('sidebar').contains(event.target) && !$('menu-toggle').contains(event.target)) setSidebar(false);
  });
  $('close-detail').addEventListener('click', closePaper);
  dialog.addEventListener('cancel', event => { event.preventDefault(); closePaper(); });
  dialog.addEventListener('click', event => {
    const r = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) closePaper();
  });
  document.addEventListener('keydown', event => {
    if (event.key === '/' && !dialog.open && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      event.preventDefault(); $('search').focus();
    }
    if (event.key === 'Escape') {
      if ($('sidebar').contains(document.activeElement)) $('menu-toggle').focus();
      setSidebar(false); tooltip.hidden = true;
    }
  });
  window.addEventListener('popstate', () => {
    stopPlay(); state = parseState(location.search, minMonth, maxMonth, papers); visibleLimit = 24; render();
    if (state.paper) openPaper(state.paper, false);
    else if (dialog.open) { dialog.close(); document.body.classList.remove('detail-open'); }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopPlay(); });
  new ResizeObserver(() => { cancelAnimationFrame(layoutFrame); layoutFrame = requestAnimationFrame(renderMap); }).observe($('map-viewport'));
  window.addEventListener('scroll', () => { tooltip.hidden = true; }, { passive: true });
}
async function init() {
  const response = await fetch(new URL('../data/papers.json', import.meta.url));
  if (!response.ok) throw new Error(`Collection request failed: ${response.status}`);
  snapshot = await response.json();
  if (snapshot.schemaVersion !== 2 || !Array.isArray(snapshot.papers) || !snapshot.papers.length) throw new Error('Invalid collection');
  papers = snapshot.papers;
  minMonth = Math.min(...papers.map(p => monthIndex(p.date))); maxMonth = Math.max(...papers.map(p => monthIndex(p.date)));
  state = parseState(location.search, minMonth, maxMonth, papers);
  if (!new URLSearchParams(location.search).has('lang')) {
    try { if (localStorage.getItem('science-atlas-language') === 'en') state.lang = 'en'; } catch { /* Optional preference only. */ }
  }
  $('metric-total').textContent = papers.length; $('all-count').textContent = papers.length;
  $('metric-evolving').textContent = papers.filter(p => p.evolving).length;
  $('metric-years').textContent = `${Math.floor(minMonth / 12)}—${Math.floor(maxMonth / 12)}`;
  $('edition-date').textContent = snapshot.reviewed.replaceAll('-', '.');
  $('timeline').max = maxMonth - minMonth; $('timeline-end').textContent = Math.floor(maxMonth / 12);
  bind(); render(); if (state.paper) openPaper(state.paper, false);
}
init().catch(error => {
  console.error(error); $('load-error').hidden = false;
  document.querySelector('.explorer').hidden = true;
});
