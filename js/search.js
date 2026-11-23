// Site search palette: Cmd+K / Ctrl+K, "/" or the magnifier button. Static index, no network.
(function () {
  // NetSuite glossary. Rendered on /tools.html#glossary and searchable here. [[Term]] links to another entry.
  const GLOSSARY = [
    ['Account (NetSuite account)', 'One NetSuite instance identified by an account id. Production, sandbox and release preview are separate accounts.'],
    ['Advanced PDF/HTML template', 'A FreeMarker template that renders a transaction or record as a printable PDF or HTML page.'],
    ['Assembly item', 'An item built from other items according to a [[Bill of materials]]. Work orders produce assemblies.'],
    ['Available Without Login', 'A Suitelet deployment option that exposes a public URL with no NetSuite session, used for external forms and portals.'],
    ['Bill of materials', 'The list of components and quantities needed to build one [[Assembly item]]. Can be multi-level.'],
    ['Bundle', 'A package of customisations installed from one account into another through SuiteBundler. Largely replaced by [[SuiteApp]] and [[SDF]].'],
    ['Client script', 'SuiteScript that runs in the browser on a form: field changes, validation, button clicks, before save.'],
    ['Consolidation', 'Rolling up subsidiary financials into a parent in [[OneWorld]], with currency translation and [[Elimination]] entries.'],
    ['CSV import', 'The Import Assistant for loading or updating records in bulk from CSV files, with saved mappings.'],
    ['Custom record', 'A table you define with its own fields, forms and permissions, used for anything the standard records do not cover.'],
    ['Custom segment', 'A reusable classification like Department or Class that can appear on records and transaction lines and roll into reporting.'],
    ['Custom transaction', 'A transaction type you define, with its own numbering, GL impact and forms.'],
    ['Dataset', 'The query definition behind a [[Workbook]] in SuiteAnalytics: record type, joins, fields and criteria.'],
    ['Deployment (script)', 'The record that attaches a [[Script record]] to a record type or schedule, sets its status, audience and parameters.'],
    ['Elimination', 'Journal entries that remove intercompany balances during [[Consolidation]] so group reports do not double count.'],
    ['External ID', 'A text id you set on a record to match it to another system, so integrations can upsert without knowing the [[Internal ID]].'],
    ['Field sourcing', 'Automatically filling a field from a related record, for example terms from the customer, with no script.'],
    ['Fiscal calendar', 'The set of accounting periods, with its own year start, that a subsidiary posts into.'],
    ['Formula field', 'A saved search or custom field whose value is a SQL-style expression evaluated when displayed.'],
    ['FreeMarker', 'The template language used by [[Advanced PDF/HTML template]] files, with ${} expressions and list loops.'],
    ['Governance', 'The usage-unit budget each script execution gets. Exceeding it stops the script with SSS_USAGE_LIMIT_EXCEEDED. See [[Usage units]].'],
    ['Inline editing', 'Editing a field directly in a list or search result without opening the record.'],
    ['Intercompany', 'Transactions between subsidiaries of the same [[OneWorld]] account, which must be mirrored and later eliminated.'],
    ['Internal ID', 'The numeric id NetSuite assigns to every record, field option and list value. Stable, and what scripts use.'],
    ['Item record', 'The master record for anything bought, sold, stocked or built: inventory, non-inventory, service, assembly, kit, and more.'],
    ['Journal entry', 'A manual or scripted posting of debits and credits to accounts, optionally per subsidiary and period.'],
    ['Landed cost', 'Freight, duty and other costs added to the value of received inventory so item cost reflects what it really cost to get it in.'],
    ['Map/Reduce script', 'A batch script with getInputData, map, reduce and summarize stages. Each key gets its own [[Governance]] budget, so volume is not a limit.'],
    ['Mass update script', 'A script that runs once per record over a search result from the Mass Update page.'],
    ['Multi-book accounting', 'Keeping more than one set of books, for example local GAAP and IFRS, posting the same transactions under different rules.'],
    ['Multi-currency', 'Transactions in a foreign currency with exchange rates and revaluation against the subsidiary base currency.'],
    ['OAuth 2.0', 'The newer authorization method for REST web services and RESTlets, using an integration record and client credentials or authorization code flow.'],
    ['OneWorld', 'The multi-subsidiary edition of NetSuite: separate legal entities, currencies and fiscal calendars in one account.'],
    ['Period close', 'Locking accounting periods through the Period Close checklist so posted transactions cannot change.'],
    ['Portlet', 'A dashboard panel. Custom portlets are a SuiteScript type that renders content on the home page.'],
    ['Pricing level', 'Named price tiers per item, such as Base, Wholesale or a customer-specific level.'],
    ['Records Catalog', 'The in-product reference listing every record and field available to [[SuiteQL]] and the analytics data source.'],
    ['Release preview', 'A temporary account on the next NetSuite version, available for a few weeks before the upgrade, for testing customisations.'],
    ['REST web services', 'The record-level REST API, with JSON payloads and OpenAPI definitions, used by integrations that do not need custom logic.'],
    ['RESTlet', 'A SuiteScript endpoint you write yourself. Receives GET, POST, PUT or DELETE, runs your code and returns JSON.'],
    ['Role', 'A set of permissions assigned to a user. Scripts and integrations run under a role, which limits what they can see and change.'],
    ['Routing', 'The sequence of operations and work centres, with setup and run times, used to build an [[Assembly item]].'],
    ['Sandbox account', 'A copy of production for building and testing. Refreshed from production on request.'],
    ['Saved search', 'A stored query with criteria, result columns, summaries and formulas. The workhorse of NetSuite reporting and scripting.'],
    ['Scheduled script', 'A script that runs on a schedule or on demand with a 10,000-unit budget, for batch work that fits in one run.'],
    ['Script parameter', 'A custom field on the [[Script record]] whose value is set per deployment, used to configure a script without editing code.'],
    ['Script record', 'The record for one SuiteScript file: its type, entry points, parameters and the file in the File Cabinet.'],
    ['SDF', 'SuiteCloud Development Framework. Customisations as XML and script files in a project folder, validated and deployed from the command line.'],
    ['Sublist', 'A list of lines on a record, such as items on a sales order or addresses on a customer.'],
    ['Subsidiary', 'A legal entity in a [[OneWorld]] account with its own currency, fiscal calendar and books.'],
    ['Subtab', 'A tab on a record form that groups fields and sublists.'],
    ['SuiteAnalytics', 'The analytics layer: [[Workbook]], [[Dataset]], pivots and charts, plus SuiteAnalytics Connect.'],
    ['SuiteAnalytics Connect', 'The ODBC, JDBC and ADO.NET driver that lets tools such as Power BI query NetSuite tables directly.'],
    ['SuiteApp', 'A packaged application installed from the SuiteApp Marketplace, built with [[SDF]] and managed by its publisher.'],
    ['SuiteBuilder', 'Point-and-click customisation: custom fields, records, forms, lists and centres, without code.'],
    ['SuiteCloud CLI', 'The Node.js command-line tool for [[SDF]] projects: validate, deploy, import objects, manage accounts.'],
    ['SuiteFlow', 'The workflow engine. States, transitions, conditions and actions set up on a record type without code.'],
    ['Suitelet', 'A SuiteScript that serves its own page: a form built with N/ui or raw HTML, with GET and POST handling.'],
    ['SuiteQL', 'A SQL-like query language over the analytics data source, run with N/query or the SuiteQL tool. Supports joins and paging.'],
    ['SuiteScript', 'NetSuite\'s JavaScript platform. Version 2.1 supports modern syntax and runs on the server and in the browser.'],
    ['SuiteTalk', 'The SOAP web services API. Older than REST web services, still common in legacy integrations.'],
    ['System notes', 'The audit trail on every record: who changed which field, from what to what, and when.'],
    ['Token-based authentication', 'TBA. Signed requests using a consumer key and secret plus a token id and secret, tied to a user and role.'],
    ['Transaction body field', 'A custom field on the header of a transaction, as opposed to a line (column) field on the [[Sublist]].'],
    ['Usage units', 'The cost of each API call against the [[Governance]] budget. A record load is 10 units, a save 20, a search page 10, a lookup 1.'],
    ['User Event script', 'SuiteScript that runs on the server when a record is loaded, before it is saved, or after it is saved.'],
    ['Workbook', 'A SuiteAnalytics report built on a [[Dataset]]: tables, pivots and charts that users can refine.'],
    ['Workflow Action script', 'A SuiteScript called as an action inside a [[SuiteFlow]] workflow, for the one step the workflow cannot do natively.'],
    ['Work center', 'A group of machines or a shop-floor area where a [[Routing]] operation is performed.'],
    ['Work order', 'The instruction to build a quantity of an [[Assembly item]], consuming components from its [[Bill of materials]].'],
    ['Yield (Map/Reduce)', 'The framework pausing a Map/Reduce stage and resuming it later, so long jobs are not cut off by time limits.']
  ];
  window.GLOSSARY = GLOSSARY;
  const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
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
    { g: 'Tools', t: 'Workflow or script?', s: 'Six questions, one recommendation: SuiteFlow, SuiteScript or native', u: '/tools.html#decide', k: 'decide decision helper suiteflow native', i: 'WF?' },
    { g: 'Tools', t: 'NetSuite glossary', s: 'More than 70 terms explained in a sentence or two', u: '/tools.html#glossary', k: 'terms definitions dictionary', i: 'A-Z' },
    { g: 'Notes', t: 'What a manufacturing rollout taught me about NetSuite work orders', s: '3 min read on BOMs, routings, material issue and costing', u: '/notes/manufacturing-work-orders-lessons.html', k: 'article blog manufacturing wo bom routing', i: 'N' },
    { g: 'Notes', t: 'Five governance mistakes that take down a SuiteScript', s: '4 min read on usage limits and the fix for each', u: '/notes/suitescript-governance-mistakes.html', k: 'article blog governance usage units map reduce', i: 'N' },
    { g: 'Notes', t: 'Connecting AI agents to NetSuite with MCP', s: '3 min read on narrow tools, gates and audit logs', u: '/notes/ai-agents-netsuite-mcp.html', k: 'article blog agents', i: 'N' },
    { g: 'Snippets', t: 'SuiteQL paging', s: 'Run a SuiteQL query page by page', u: '/snippets.html', k: 'query runSuiteQL', i: '{}' },
    { g: 'Snippets', t: 'RESTlet skeleton', s: 'GET/POST handler with JSON errors', u: '/snippets.html', k: 'rest api', i: '{}' },
    { g: 'Snippets', t: 'Map/Reduce skeleton', s: 'getInputData, map, reduce, summarize', u: '/snippets.html', k: 'batch', i: '{}' },
    { g: 'Snippets', t: 'Search paging', s: 'Walk a saved search in pages', u: '/snippets.html', k: 'runPaged', i: '{}' },
    { g: 'Pages', t: 'Now', s: 'What I am working on this month', u: '/now.html', k: 'current learning reading', i: 'NOW' },
    { g: 'Pages', t: 'Ask me anything', s: 'Post a NetSuite question on the board', u: '/ask.html', k: 'question ama discussion', i: 'AMA' },
    { g: 'Pages', t: 'Notes', s: 'All write-ups', u: '/notes.html', k: 'blog articles rss', i: 'N' },
    { g: 'Pages', t: 'Uses', s: 'The tools I work with and what each is for', u: '/uses.html', k: 'stack setup software sdf vscode postman', i: 'USE' },
    { g: 'Pages', t: 'Changelog', s: 'What changed on this site, by date', u: '/changelog.html', k: 'updates history releases', i: 'LOG' },
    { g: 'Pages', t: 'Snippets', s: 'SuiteScript 2.1 code you can copy', u: '/snippets.html', k: 'code', i: '{}' },
    { g: 'Pages', t: 'Résumé (PDF)', s: 'Two-page CV', u: '/assets/docs/Priyesh-Salian-Resume.pdf', k: 'cv download', i: 'PDF' },
    { g: 'Pages', t: 'RSS feed', s: 'Subscribe to new notes', u: '/feed.xml', k: 'subscribe', i: 'RSS' },
    { g: 'Actions', t: 'Switch theme', s: 'Toggle light and dark', u: '!theme', k: 'dark light mode', i: '☾' },
    { g: 'Actions', t: 'Keyboard shortcuts', s: 'Press ? on any page', u: '!keys', k: 'hotkeys help', i: '?' }
  ].concat(GLOSSARY.map(t => ({ g: 'Glossary', t: t[0], s: t[1].replace(/\[\[|\]\]/g, ''), u: '/tools.html#g-' + slugify(t[0]), k: 'glossary term definition', i: 'G' })));
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
    if (!q) return INDEX.filter(x => x.g !== 'Projects' && x.g !== 'Snippets' && x.g !== 'Glossary');
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
    if (x.u === '!keys') { window.openKeys?.(); return; }
    const here = location.pathname.replace(/index\.html$/, '');
    const [path, hash] = x.u.split('#');
    if (hash && (path === here || path === '/' && here === '/')) {
      const target = document.getElementById(hash);
      if (target) { history.replaceState(null, '', '#' + hash); if (window.showTool) { window.showTool(hash); if (hash.startsWith('g-')) window.dispatchEvent(new HashChangeEvent('hashchange')); } else target.scrollIntoView({ behavior: 'smooth' }); return; }
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

  // Keyboard shortcuts: ? opens the list, t toggles theme, g then a letter jumps to a page
  const KEYS = [
    [['⌘K', 'Ctrl K', '/'], 'Open search'], [['?'], 'This list'], [['t'], 'Switch theme'], [['Esc'], 'Close'],
    [['g', 'h'], 'Home'], [['g', 't'], 'Tools'], [['g', 'n'], 'Notes'], [['g', 's'], 'Snippets'], [['g', 'a'], 'Ask me anything'], [['g', 'w'], 'Now'], [['g', 'u'], 'Uses'], [['g', 'c'], 'Changelog']
  ];
  const GOTO = { h: '/', t: '/tools.html', n: '/notes.html', s: '/snippets.html', a: '/ask.html', w: '/now.html', u: '/uses.html', c: '/changelog.html' };
  let keysEl = null, pendingG = 0;
  const closeKeys = () => { if (keysEl) { keysEl.classList.remove('open'); keysEl.setAttribute('aria-hidden', 'true'); } };
  const openKeys = () => {
    if (!keysEl) {
      keysEl = document.createElement('div');
      keysEl.className = 'keys'; keysEl.id = 'keys'; keysEl.setAttribute('aria-hidden', 'true');
      keysEl.innerHTML = `<div class="palette-backdrop" data-kclose></div><div class="keys-box" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts"><h3>Keyboard shortcuts</h3><dl>${KEYS.map(k => `<div><dt>${k[0].map(x => `<kbd>${esc(x)}</kbd>`).join(' ')}</dt><dd>${esc(k[1])}</dd></div>`).join('')}</dl><p>Shortcuts are off while you type in a field.</p><button class="btn btn-ghost" type="button" data-kclose>Close</button></div>`;
      document.body.appendChild(keysEl);
      keysEl.querySelectorAll('[data-kclose]').forEach(b => b.addEventListener('click', closeKeys));
    }
    close();
    keysEl.classList.add('open'); keysEl.setAttribute('aria-hidden', 'false');
    keysEl.querySelector('button').focus();
    track('keys_open', {});
  };
  window.openKeys = openKeys;
  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
    if (typing || el.classList.contains('open')) return;
    if (e.key === 'Escape' && keysEl?.classList.contains('open')) { closeKeys(); return; }
    if (e.key === '?') { e.preventDefault(); keysEl?.classList.contains('open') ? closeKeys() : openKeys(); return; }
    if (keysEl?.classList.contains('open')) return;
    if (e.key === 't') { document.getElementById('themeBtn')?.click(); return; }
    if (e.key === 'g') { pendingG = Date.now(); return; }
    if (pendingG && Date.now() - pendingG < 1200 && GOTO[e.key]) { pendingG = 0; track('keys_go', { target: GOTO[e.key] }); location.href = GOTO[e.key]; return; }
    pendingG = 0;
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
