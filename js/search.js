// Site search palette: Cmd+K / Ctrl+K, "/" or the magnifier button. Static index, no network.
(function () {
  const INDEX = [
    { g: 'Sections', t: 'About', s: 'Who I am and what I work on', u: '/#about', k: 'bio profile consultant', i: '01' },
    { g: 'Sections', t: 'Experience & Education', s: 'SankalvaX, Wesco, KPI, Freelance', u: '/#experience', k: 'timeline jobs roles career', i: '02' },
    { g: 'Sections', t: 'Skills & Certifications', s: 'NetSuite platform, integrations, AI tooling', u: '/#skills', k: 'suitescript suiteql certified oracle', i: '03' },
    { g: 'Sections', t: 'Case Studies', s: 'Four worked examples with scroll-through diagrams', u: '/#work', k: 'work portfolio', i: '04' },
    { g: 'Sections', t: 'Projects', s: 'Nine builds plus latest GitHub repos', u: '/#projects', k: 'github repos', i: '05' },
    { g: 'Sections', t: 'How I can help', s: 'Services: implementation, SuiteScript, integrations, reporting, AI, training', u: '/#services', k: 'services hire consulting', i: '06' },
    { g: 'Sections', t: 'How I work', s: 'FAQ on engagement, time zones, hand-over', u: '/#how', k: 'faq retainer fixed scope ist remote', i: '07' },
    { g: 'Sections', t: 'Contact', s: 'LinkedIn, book a call, GitHub, résumé', u: '/#contact', k: 'email reach hire linkedin', i: '08' },
    { g: 'Case studies', t: 'AI agents inside NetSuite', s: 'MCP-connected assistants for reconciliation and approvals', u: '/work/ai-agents-netsuite.html', k: 'claude mcp restlet react dashboard bank', i: 'CS1' },
    { g: 'Case studies', t: 'Manufacturing module implementation', s: 'Work orders, routings, BOMs and costing', u: '/work/manufacturing-module.html', k: 'wo bom assembly discrete', i: 'CS2' },
    { g: 'Case studies', t: 'Suitelet web apps for HR processes', s: 'Timesheets, payroll and leave without NetSuite licences', u: '/work/hr-suitelet-apps.html', k: 'available without login custom records', i: 'CS3' },
    { g: 'Case studies', t: 'Power BI dashboards over ODBC', s: 'Live finance dashboards, 40% less manual reporting', u: '/work/power-bi-odbc.html', k: 'suiteanalytics connect sql', i: 'CS4' },
    { g: 'Projects', t: 'AP Invoice AI Agent', s: 'Reads vendor invoices and creates bills', u: '/#projects', k: 'ocr procure to pay', i: 'AI' },
    { g: 'Projects', t: 'Sales Order AI Agent', s: 'Customer PO PDFs to sales orders', u: '/#projects', k: 'ocr order to cash', i: 'AI' },
    { g: 'Projects', t: 'Invoice Payment Reminders', s: 'MCP server plus Claude for overdue follow-up', u: '/#projects', k: 'accounts receivable', i: 'MCP' },
    { g: 'Projects', t: 'India e-Invoice Integration', s: 'IRN, QR codes and e-way bills', u: '/#projects', k: 'gst compliance', i: 'GST' },
    { g: 'Projects', t: 'AR / AP Aging Suitelet', s: 'Aging buckets, FX, drill-down, CSV export', u: '/#projects', k: 'reporting multi subsidiary', i: 'AR' },
    { g: 'Projects', t: 'Freight & Landed Cost Suite', s: 'Inbound, outbound and duty costs per line', u: '/#projects', k: 'suiteql custom records', i: '$' },
    { g: 'Projects', t: 'One-Click Email PO Approval', s: 'Tokenised approval links, no login', u: '/#projects', k: 'suiteflow approvals', i: '✓' },
    { g: 'Projects', t: 'Order Allocation & WMS Report', s: 'Allocation and stock percentages with WMS status', u: '/#projects', k: 'inventory', i: 'WMS' },
    { g: 'Projects', t: 'Transaction Numbering Framework', s: 'Native plus scripted numbering, journal validator', u: '/#projects', k: 'user event sdf custom transactions', i: '#' },
    { g: 'Tools', t: 'Project scope estimator', s: 'Pick modules and integrations, get an effort range', u: '/tools.html#estimator', k: 'weeks cost quote estimate', i: 'EST' },
    { g: 'Tools', t: 'SuiteScript governance calculator', s: 'Units per operation against the script limit', u: '/tools.html#governance', k: 'usage limit map reduce 1000 10000', i: 'GOV' },
    { g: 'Tools', t: 'Integration map explorer', s: 'How NetSuite connects to Salesforce, Shopify, Ariba, Boomi, Power BI and more', u: '/tools.html#map', k: 'architecture diagram', i: 'MAP' },
    { g: 'Notes', t: 'Connecting AI agents to NetSuite with MCP', s: '3 min read on narrow tools, gates and audit logs', u: '/notes/ai-agents-netsuite-mcp.html', k: 'article blog agents', i: 'N' },
    { g: 'Snippets', t: 'SuiteQL paging', s: 'Run a SuiteQL query page by page', u: '/snippets.html', k: 'query runSuiteQL', i: '{}' },
    { g: 'Snippets', t: 'RESTlet skeleton', s: 'GET/POST handler with JSON errors', u: '/snippets.html', k: 'rest api', i: '{}' },
    { g: 'Snippets', t: 'Map/Reduce skeleton', s: 'getInputData, map, reduce, summarize', u: '/snippets.html', k: 'batch', i: '{}' },
    { g: 'Snippets', t: 'Search paging', s: 'Walk a saved search in pages', u: '/snippets.html', k: 'runPaged', i: '{}' },
    { g: 'Pages', t: 'Now', s: 'What I am working on this month', u: '/now.html', k: 'current learning reading', i: 'NOW' },
    { g: 'Pages', t: 'Ask me anything', s: 'Post a NetSuite question on the board', u: '/ask.html', k: 'question ama discussion', i: 'AMA' },
    { g: 'Pages', t: 'Notes', s: 'All write-ups', u: '/notes.html', k: 'blog articles rss', i: 'N' },
    { g: 'Pages', t: 'Snippets', s: 'SuiteScript 2.1 code you can copy', u: '/snippets.html', k: 'code', i: '{}' },
    { g: 'Pages', t: 'Résumé (PDF)', s: 'Two-page CV', u: '/assets/docs/Priyesh-Salian-Resume.pdf', k: 'cv download', i: 'PDF' },
    { g: 'Pages', t: 'RSS feed', s: 'Subscribe to new notes', u: '/feed.xml', k: 'subscribe', i: 'RSS' },
    { g: 'Actions', t: 'Switch theme', s: 'Toggle light and dark', u: '!theme', k: 'dark light mode', i: '☾' }
  ];
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const track = (n, p) => { if (typeof gtag === 'function') gtag('event', n, p); };

  const el = document.createElement('div');
  el.className = 'palette'; el.id = 'palette'; el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `
    <div class="palette-backdrop" data-pclose></div>
    <div class="palette-box" role="dialog" aria-modal="true" aria-label="Search the site">
      <div class="palette-input">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 20l-3.5-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <input type="text" id="paletteInput" placeholder="Search pages, case studies, tools…" autocomplete="off" spellcheck="false" aria-label="Search">
        <kbd>esc</kbd>
      </div>
      <div class="palette-list" id="paletteList"></div>
      <div class="palette-foot"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>↵</kbd> open</span><span><kbd>⌘K</kbd> / <kbd>Ctrl K</kbd> toggle</span></div>
    </div>`;
  document.body.appendChild(el);
  const input = el.querySelector('#paletteInput'), list = el.querySelector('#paletteList');
  let items = [], sel = 0, lastFocus = null;

  const search = (q) => {
    q = q.trim().toLowerCase();
    if (!q) return INDEX.filter(x => x.g !== 'Projects' && x.g !== 'Snippets');
    const words = q.split(/\s+/);
    return INDEX.map(x => {
      const hay = (x.t + ' ' + x.s + ' ' + x.k + ' ' + x.g).toLowerCase();
      if (!words.every(w => hay.includes(w))) return null;
      const t = x.t.toLowerCase();
      const score = (t.startsWith(q) ? 3 : t.includes(q) ? 2 : 0) + (x.s.toLowerCase().includes(q) ? 1 : 0);
      return { x, score };
    }).filter(Boolean).sort((a, b) => b.score - a.score).map(r => r.x);
  };
  const hl = (text, q) => {
    const safe = esc(text);
    if (!q) return safe;
    const re = new RegExp('(' + q.trim().split(/\s+/).map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'ig');
    return safe.replace(re, '<mark>$1</mark>');
  };
  const render = () => {
    const q = input.value;
    items = search(q);
    sel = 0;
    if (!items.length) { list.innerHTML = '<p class="palette-empty">Nothing matches. Try "agents", "Suitelet" or "estimate".</p>'; return; }
    let html = '', group = '';
    items.forEach((x, i) => {
      if (x.g !== group) { group = x.g; html += `<p class="palette-group">${group}</p>`; }
      html += `<a class="palette-item${i === 0 ? ' sel' : ''}" href="${x.u.startsWith('!') ? '#' : x.u}" data-i="${i}"><span class="pi">${esc(x.i)}</span><div><strong>${hl(x.t, q)}</strong><span>${hl(x.s, q)}</span></div></a>`;
    });
    list.innerHTML = html;
  };
  const go = (x) => {
    track('search_go', { target: x.u, query: input.value });
    close();
    if (x.u === '!theme') { document.getElementById('themeBtn')?.click(); return; }
    const here = location.pathname.replace(/index\.html$/, '');
    const [path, hash] = x.u.split('#');
    if (hash && (path === here || path === '/' && here === '/')) {
      const target = document.getElementById(hash);
      if (target) { target.scrollIntoView({ behavior: 'smooth' }); history.replaceState(null, '', '#' + hash); return; }
    }
    location.href = x.u;
  };
  const open = () => {
    if (el.classList.contains('open')) return;
    lastFocus = document.activeElement;
    el.classList.add('open'); el.setAttribute('aria-hidden', 'false'); document.body.classList.add('palette-open');
    input.value = ''; render(); setTimeout(() => input.focus(), 20);
    track('search_open', {});
  };
  const close = () => {
    el.classList.remove('open'); el.setAttribute('aria-hidden', 'true'); document.body.classList.remove('palette-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };
  const move = (d) => {
    const nodes = list.querySelectorAll('.palette-item');
    if (!nodes.length) return;
    nodes[sel].classList.remove('sel');
    sel = (sel + d + nodes.length) % nodes.length;
    nodes[sel].classList.add('sel');
    nodes[sel].scrollIntoView({ block: 'nearest' });
  };
  input.addEventListener('input', render);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); if (items[sel]) go(items[sel]); }
  });
  list.addEventListener('click', (e) => { const a = e.target.closest('.palette-item'); if (!a) return; e.preventDefault(); go(items[+a.dataset.i]); });
  list.addEventListener('mousemove', (e) => { const a = e.target.closest('.palette-item'); if (!a || +a.dataset.i === sel) return; list.querySelectorAll('.palette-item')[sel]?.classList.remove('sel'); sel = +a.dataset.i; a.classList.add('sel'); });
  el.querySelectorAll('[data-pclose]').forEach(b => b.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); el.classList.contains('open') ? close() : open(); }
    else if (e.key === '/' && !typing && !el.classList.contains('open')) { e.preventDefault(); open(); }
    else if (e.key === 'Escape' && el.classList.contains('open')) { close(); }
  });

  // Magnifier button in the nav (added here so every page gets it)
  const right = document.querySelector('.nav-right');
  if (right) {
    const b = document.createElement('button');
    b.className = 'search-btn'; b.id = 'searchBtn'; b.type = 'button';
    b.setAttribute('aria-label', 'Search the site'); b.title = 'Search · ⌘K / Ctrl+K';
    b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 20l-3.5-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    b.addEventListener('click', open);
    right.insertBefore(b, right.firstChild);
  }
  window.openSearch = open;
})();
