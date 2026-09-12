const text = {
  zh: { institutions: '机构与团队', affiliations: '原文列示的机构；保留署名时名称', partial: '目前可从来源确认的机构', unstated: '公开资料未明确列出机构', more: n => `查看其余 ${n} 项`, authors: n => `作者 · ${n} 人`, takeaway: '先记住这两点', figures: '结合原图理解', tables: '关键表格', full: '查看原图 ↗', source: '原文出处 ↗', failed: '原图暂时未能加载，可通过出处查看。', tableNote: '保留原文数值与英文列名；横向滑动可查看完整表格。', complete: '继续阅读完整原文 ↗', excerpt: '本页选取关键图表。图像版权归原作者／出版方，文字解读为编辑整理。', noFigure: '此条目暂未收录可直接展示的原文图像。', parts: '原图分面', jump: '快速跳转', overview: '研究问题与方法' },
  en: { institutions: 'Institutions & teams', affiliations: 'Affiliations as listed in the source', partial: 'Institutions confirmed from available sources', unstated: 'No institution explicitly listed in the public source', more: n => `Show ${n} more`, authors: n => `Authors · ${n}`, takeaway: 'Two things to take away', figures: 'Read the original figure', tables: 'Key tables', full: 'Open original image ↗', source: 'View in source ↗', failed: 'The image could not load. Use the source link to view it.', tableNote: 'Original values and English column labels. Scroll horizontally for the complete table.', complete: 'Continue with the full source ↗', excerpt: 'Selected figures and tables. Images belong to their authors/publishers; explanations are editorial notes.', noFigure: 'No directly displayable source image is included for this entry yet.', parts: 'Figure panels', jump: 'Jump to section', overview: 'Question & method' },
};
const el = (tag, className, value) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value !== undefined) node.textContent = value;
  return node;
};
const external = (url, label, className) => {
  const node = el('a', className, label); node.href = url;
  node.target = '_blank'; node.rel = 'noopener noreferrer'; return node;
};
export function institutionBlock(p, lang) {
  const w = text[lang], r = p.reading, block = el('div', 'institution-block');
  block.append(el('span', 'metadata-label', w.institutions));
  const list = el('div', 'institution-list');
  const add = names => names.map(name => el('span', 'institution-pill', name));
  list.append(...add(r.institutions.slice(0, 4))); block.append(list);
  if (r.institutions.length > 4) {
    const more = el('details', 'institution-more'); more.append(el('summary', '', w.more(r.institutions.length - 4)));
    const rest = el('div', 'institution-list'); rest.append(...add(r.institutions.slice(4))); more.append(rest); block.append(more);
  }
  const note = r.affiliationStatus === 'not-stated' ? w.unstated : r.affiliationStatus === 'partial' ? w.partial : w.affiliations;
  block.append(external(r.institutionSource, note + ' ↗', 'institution-note'));
  if (p.authors.length) {
    const authors = el('details', 'author-details'); authors.append(el('summary', '', w.authors(p.authors.length)));
    authors.append(el('p', 'detail-authors', p.authors.join(' · '))); block.append(authors);
  }
  return block;
}
export function takeawayBlock(p, lang) {
  const block = el('section', 'takeaways'), items = el('ul'); block.id = 'reader-takeaways';
  block.append(el('h3', '', text[lang].takeaway));
  for (const item of [...p.reading.takeaways[lang], p[lang].evaluation]) items.append(el('li', '', item));
  block.append(items); return block;
}
export function readerNavigation(p, lang) {
  const w = text[lang], nav = el('nav', 'reader-navigation'); nav.setAttribute('aria-label', w.jump);
  const sections = [['reader-overview', w.overview]];
  if (p.reading.figures.length) sections.push(['reader-figures', w.figures]);
  if (p.reading.tables.length) sections.push(['reader-tables', w.tables]);
  sections.push(['reader-source', w.source.replace(' ↗', '')]);
  sections.forEach(([id, title]) => {
    const button = el('button', '', title);
    button.addEventListener('click', () => {
      const target = document.getElementById(id);
      target?.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      target?.focus({ preventScroll: true });
    }); nav.append(button);
  });
  return nav;
}
export function evidenceBlocks(p, lang) {
  const w = text[lang], r = p.reading, blocks = [];
  if (r.figures.length) {
    const section = el('section', 'reader-section'); section.id = 'reader-figures'; section.tabIndex = -1;
    section.append(el('h3', '', w.figures));
    r.figures.forEach(f => {
      const card = el('figure', 'figure-card'), gallery = el('div', 'figure-panels');
      for (const [i, url] of f.images.entries()) {
        const href = url.startsWith('assets/') ? new URL('../' + url, import.meta.url).href : url;
        const a = external(href, undefined, 'figure-image-link'); a.setAttribute('aria-label', `${f.label} · ${w.full}${f.images.length > 1 ? ` · ${i + 1}` : ''}`);
        const img = el('img'); img.src = href; img.loading = 'lazy'; img.decoding = 'async'; img.referrerPolicy = 'no-referrer';
        if (f.sizes?.[i]) { [img.width, img.height] = f.sizes[i]; }
        img.alt = `${p.name} · ${f.label} · ${f[lang]}${f.images.length > 1 ? ` (${i + 1}/${f.images.length})` : ''}`;
        const fallback = el('p', 'figure-fallback', w.failed); fallback.hidden = true;
        img.addEventListener('error', () => { a.hidden = true; fallback.hidden = false; });
        a.append(img); gallery.append(a, fallback);
      }
      const caption = el('figcaption'), label = el('div', 'figure-caption-label');
      label.append(el('strong', '', f.label), external(f.source, w.source));
      caption.append(label, el('p', '', f[lang])); card.append(gallery, caption); section.append(card);
    }); blocks.push(section);
  } else {
    const note = el('p', 'institution-note', w.noFigure); blocks.push(note);
  }
  if (r.tables.length) {
    const section = el('section', 'reader-section'); section.id = 'reader-tables'; section.tabIndex = -1;
    section.append(el('h3', '', w.tables));
    r.tables.forEach(t => {
      const card = el('div', 'table-card'), scroll = el('div', 'table-scroll');
      const table = el('table', 'result-table'); table.append(el('caption', 'table-title', t.label));
      const body = el('tbody');
      t.grid.forEach((row, i) => {
        const tr = el('tr');
        row.forEach(cell => {
          const td = el(i === 0 ? 'th' : 'td', '', cell.text);
          td.colSpan = cell.colspan; td.rowSpan = cell.rowspan;
          if (i === 0) td.scope = 'col'; tr.append(td);
        }); body.append(tr);
      });
      table.append(body); scroll.append(table); scroll.tabIndex = 0; scroll.setAttribute('role', 'region'); scroll.setAttribute('aria-label', t.label);
      const explanation = el('div', 'table-explainer');
      explanation.append(el('p', '', t[lang]), external(t.source, w.source));
      card.append(el('p', 'table-notes', w.tableNote), scroll, explanation); section.append(card);
    }); blocks.push(section);
  }
  return blocks;
}
export function readingSource(p, lang) {
  const block = el('div');
  block.append(external(p.reading.fullText, text[lang].complete, 'source-reading-link'), el('p', '', text[lang].excerpt));
  return block;
}
