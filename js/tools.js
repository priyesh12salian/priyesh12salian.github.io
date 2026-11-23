// Tools page: project scope estimator, SuiteScript governance calculator, integration map explorer, decision helper, glossary.

/* ================= 0. Tabs: one tool at a time, chosen by the URL hash ================= */
(function () {
  const bar = document.getElementById('toolTabs');
  if (!bar) return;
  const tabs = [...bar.querySelectorAll('[role="tab"]')];
  const ids = tabs.map(t => t.getAttribute('aria-controls'));
  const fromHash = (h) => { h = (h || '').replace(/^#/, ''); if (h.startsWith('g-')) return 'glossary'; return ids.includes(h) ? h : ids[0]; };
  let current = null;
  const show = (id, { scroll = false, focus = false } = {}) => {
    tabs.forEach((t, i) => {
      const on = ids[i] === id;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(ids[i]);
      if (panel) panel.hidden = !on;
    });
    const changed = current !== id;
    current = id;
    const tab = tabs[ids.indexOf(id)];
    if (bar.scrollWidth > bar.clientWidth) bar.scrollTo({ left: Math.max(0, tab.offsetLeft - 24), behavior: changed ? 'smooth' : 'auto' });
    if (scroll) {
      const top = bar.getBoundingClientRect().top + window.scrollY - 84;
      if (Math.abs(window.scrollY - top) > 40 || changed) window.scrollTo({ top, behavior: 'auto' });
    }
    if (focus) tabs[ids.indexOf(id)].focus();
    if (changed && typeof gtag === 'function') gtag('event', 'tool_tab', { tool: id });
  };
  bar.addEventListener('click', (e) => {
    const t = e.target.closest('[role="tab"]');
    if (!t) return;
    e.preventDefault();
    const id = t.getAttribute('aria-controls');
    if (location.hash !== '#' + id) history.pushState(null, '', location.pathname + location.search + '#' + id);
    show(id, { scroll: true });
  });
  bar.addEventListener('keydown', (e) => {
    const i = ids.indexOf(current);
    const next = e.key === 'ArrowRight' ? (i + 1) % ids.length : e.key === 'ArrowLeft' ? (i - 1 + ids.length) % ids.length : e.key === 'Home' ? 0 : e.key === 'End' ? ids.length - 1 : -1;
    if (next < 0) return;
    e.preventDefault();
    history.replaceState(null, '', location.pathname + location.search + '#' + ids[next]);
    show(ids[next], { focus: true });
  });
  const onHash = () => show(fromHash(location.hash), { scroll: true });
  window.addEventListener('hashchange', onHash);
  window.addEventListener('popstate', onHash);
  // Initial tab: the hash wins (a shared estimate link, a glossary term, a search result), else the first tool
  show(fromHash(location.hash), { scroll: !!location.hash && !location.hash.startsWith('#g-') });
  window.showTool = (id) => show(fromHash(id), { scroll: true });
})();
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const track = (n, p) => { if (typeof gtag === 'function') gtag('event', n, p); };
  const fmt = n => (Math.round(n * 2) / 2).toString().replace(/\.0$/, '');

  /* ================= 1. Project scope estimator ================= */
  const SCOPE = {
    engagement: [
      ['new', 'New implementation', 'Discovery, configuration, UAT and go-live support', 3, 5],
      ['enh', 'Enhancement of a live account', 'Scoped change on an account already in use', 0.5, 1]
    ],
    modules: [
      ['o2c', 'Order to Cash', 2, 4], ['p2p', 'Procure to Pay', 2, 4], ['inv', 'Inventory', 2, 3],
      ['mfg', 'Manufacturing (WO, BOM, routing)', 4, 8], ['wms', 'WMS', 3, 6], ['ic', 'Intercompany / OneWorld', 3, 6],
      ['proj', 'Project management', 2, 3], ['fa', 'Fixed assets', 1, 2]
    ],
    integrations: [
      ['sf', 'Salesforce', 2, 4], ['shop', 'Shopify', 2, 3], ['edi', 'EDI partner (each)', 3, 5], ['ariba', 'SAP Ariba (cXML)', 3, 5],
      ['boomi', 'Boomi flows', 2, 4], ['sftp', 'SFTP / file exchange', 1, 2], ['pbi', 'Power BI over ODBC', 1, 2], ['einv', 'India e-Invoice (IRN, e-way bill)', 3, 5]
    ],
    ai: [
      ['ap', 'AP invoice reading agent', 3, 5], ['so', 'Sales order reading agent', 3, 5], ['mcp', 'MCP assistant (reconciliation, approvals)', 4, 8]
    ],
    migration: [['none', 'None', 0, 0], ['basic', 'Basic (masters only)', 1, 2], ['full', 'Full (masters + open transactions + history)', 3, 5]],
    subs: [['1', '1 subsidiary', 1], ['2', '2 to 5', 1.2], ['6', '6 or more', 1.4]]
  };
  const est = $('#estimator');
  if (est) {
    const checks = (name, rows) => rows.map(([id, label, lo, hi]) => `<label class="check"><input type="checkbox" name="${name}" value="${id}"> ${esc(label)}<small>${lo}–${hi} wk</small></label>`).join('');
    const seg = (name, rows, checkedIdx = 0) => `<div class="seg">${rows.map(([id, label], i) => `<label><input type="radio" name="${name}" value="${id}"${i === checkedIdx ? ' checked' : ''}>${esc(label)}</label>`).join('')}</div>`;
    $('#estForm').innerHTML = `
      <div class="field"><span class="lbl">Engagement</span>${seg('eng', SCOPE.engagement)}</div>
      <div class="field"><span class="lbl">Modules to set up</span><div class="checks">${checks('mod', SCOPE.modules)}</div></div>
      <div class="field"><span class="lbl">Integrations</span><div class="checks">${checks('int', SCOPE.integrations)}</div></div>
      <div class="field"><span class="lbl">AI automation</span><div class="checks">${checks('ai', SCOPE.ai)}</div></div>
      <div class="field"><label class="lbl" for="nScripts">Custom scripts (User Event, Client, Map/Reduce, Suitelet…)</label><input type="number" id="nScripts" min="0" max="50" value="0"></div>
      <div class="field"><label class="lbl" for="nReports">Reports, saved searches and dashboards</label><input type="number" id="nReports" min="0" max="50" value="0"></div>
      <div class="field"><span class="lbl">Data migration</span>${seg('mig', SCOPE.migration)}</div>
      <div class="field"><span class="lbl">Subsidiaries</span>${seg('subs', SCOPE.subs)}</div>
      <div class="field"><span class="lbl">Training and SOPs</span><div class="seg"><label><input type="radio" name="train" value="0" checked>Not needed</label><label><input type="radio" name="train" value="1">Include (1–2 wk)</label></div></div>`;
    const out = $('#estOut');
    // Selections live in ?est=... so an estimate can be shared as a link
    const GROUPS = ['eng', 'mod', 'int', 'ai', 'mig', 'subs', 'train'];
    const state = () => GROUPS.map(g => [...est.querySelectorAll(`input[name="${g}"]:checked`)].map(i => i.value).join('.')).join('|') + '|' + (+$('#nScripts').value || 0) + '|' + (+$('#nReports').value || 0);
    const restore = (v) => {
      const parts = v.split('|');
      GROUPS.forEach((g, i) => { const vals = (parts[i] || '').split('.'); est.querySelectorAll(`input[name="${g}"]`).forEach(inp => { inp.checked = vals.includes(inp.value); }); });
      $('#nScripts').value = Math.min(50, Math.max(0, +parts[7] || 0)); $('#nReports').value = Math.min(50, Math.max(0, +parts[8] || 0));
      GROUPS.forEach(g => { if (!est.querySelector(`input[name="${g}"]:checked`) && est.querySelector(`input[name="${g}"][type="radio"]`)) est.querySelector(`input[name="${g}"]`).checked = true; });
    };
    const shared = new URLSearchParams(location.search).get('est');
    if (shared) restore(shared);
    let touched = !!shared;
    const shareUrl = () => location.origin + '/tools.html?est=' + encodeURIComponent(state()) + '#estimator';
    const calc = () => {
      if (touched) { try { history.replaceState(null, '', '/tools.html?est=' + encodeURIComponent(state()) + '#estimator'); } catch (e) {} }
      const lines = [];
      let lo = 0, hi = 0;
      const pick = (name) => [...est.querySelectorAll(`input[name="${name}"]:checked`)].map(i => i.value);
      const eng = SCOPE.engagement.find(e => e[0] === pick('eng')[0]);
      lines.push([eng[1], eng[3], eng[4]]); lo += eng[3]; hi += eng[4];
      [['mod', SCOPE.modules], ['int', SCOPE.integrations], ['ai', SCOPE.ai]].forEach(([name, rows]) => {
        pick(name).forEach(id => { const r = rows.find(x => x[0] === id); lines.push([r[1], r[2], r[3]]); lo += r[2]; hi += r[3]; });
      });
      const ns = +$('#nScripts').value || 0, nr = +$('#nReports').value || 0;
      if (ns) { lines.push([`${ns} custom script${ns > 1 ? 's' : ''}`, ns * 0.5, ns * 1]); lo += ns * 0.5; hi += ns; }
      if (nr) { lines.push([`${nr} report${nr > 1 ? 's' : ''} / dashboard${nr > 1 ? 's' : ''}`, nr * 0.25, nr * 0.5]); lo += nr * 0.25; hi += nr * 0.5; }
      const mig = SCOPE.migration.find(m => m[0] === pick('mig')[0]);
      if (mig[2]) { lines.push(['Data migration: ' + mig[1].split(' (')[0].toLowerCase(), mig[2], mig[3]]); lo += mig[2]; hi += mig[3]; }
      if (pick('train')[0] === '1') { lines.push(['Training and SOPs', 1, 2]); lo += 1; hi += 2; }
      const sub = SCOPE.subs.find(s => s[0] === pick('subs')[0]);
      if (sub[2] > 1) { lines.push([`${sub[1]}: ×${sub[2]} on everything`, 0, 0]); lo *= sub[2]; hi *= sub[2]; }
      const model = hi <= 4 ? 'Fixed-scope sprint' : hi <= 12 ? 'Fixed-scope project with weekly demos' : 'Phased delivery, or a monthly retainer';
      const months = hi > 8 ? ` (about ${fmt(lo / 4.3)}–${fmt(hi / 4.3)} months)` : '';
      const summary = `Scope estimate: ${fmt(lo)}–${fmt(hi)} weeks${months}. ` + lines.filter(l => l[2]).map(l => `${l[0]} (${fmt(l[1])}–${fmt(l[2])} wk)`).join('; ') + '.';
      out.innerHTML = `
        <h3>Indicative effort</h3>
        <p class="big">${fmt(lo)}–${fmt(hi)} <small>weeks${months}</small></p>
        <ul class="lines">${lines.map(l => `<li><span>${esc(l[0])}</span><span>${l[2] ? fmt(l[1]) + '–' + fmt(l[2]) + ' wk' : ''}</span></li>`).join('')}<li class="total"><span>Suggested model</span><span>${model}</span></li></ul>
        <div class="hero-actions"><a class="btn btn-primary" href="/#contact" data-book>Discuss this scope</a><button class="btn btn-ghost" type="button" id="copyEst">Copy summary</button><button class="btn btn-ghost" type="button" id="shareEst">Copy link</button></div>
        <p class="note">Ranges are for one experienced consultant working in your sandbox, and assume a decision-maker on your side. They are a starting point for a conversation, not a quote. A written scope follows a discovery call. <em>Copy link</em> gives you a URL with these selections to send along.</p>`;
      $('#copyEst').addEventListener('click', (e) => {
        navigator.clipboard?.writeText(summary).then(() => { e.target.textContent = 'Copied'; setTimeout(() => e.target.textContent = 'Copy summary', 1500); });
        track('estimate_copy', { weeks_hi: hi });
      });
      $('#shareEst').addEventListener('click', (e) => {
        navigator.clipboard?.writeText(shareUrl()).then(() => { e.target.textContent = 'Link copied'; setTimeout(() => e.target.textContent = 'Copy link', 1500); });
        track('estimate_share', { weeks_hi: hi });
      });
    };
    est.addEventListener('change', () => { touched = true; calc(); });
    est.addEventListener('input', () => { touched = true; calc(); });
    calc();
  }

  /* ================= 2. SuiteScript governance calculator ================= */
  const LIMITS = [
    ['client', 'Client script', 1000], ['ue', 'User Event script', 1000], ['suitelet', 'Suitelet', 1000], ['restlet', 'RESTlet', 5000],
    ['portlet', 'Portlet', 1000], ['wfa', 'Workflow Action script', 1000], ['mu', 'Mass Update (per record)', 1000],
    ['sched', 'Scheduled script', 10000], ['mrin', 'Map/Reduce · getInputData', 10000], ['mrmap', 'Map/Reduce · map (per key)', 1000],
    ['mrred', 'Map/Reduce · reduce (per key)', 5000], ['mrsum', 'Map/Reduce · summarize', 10000], ['bundle', 'Bundle Installation script', 10000]
  ];
  // Units from the SuiteScript 2.x governance reference. Record operations depend on the record category.
  const OPS = [
    { id: 'load', name: 'record.load / create / copy / transform', rec: { tx: 10, custom: 2, other: 4 }, per: 'rec', n: 1 },
    { id: 'save', name: 'record.save', rec: { tx: 20, custom: 4, other: 8 }, per: 'rec', n: 1 },
    { id: 'delete', name: 'record.delete', rec: { tx: 20, custom: 4, other: 8 }, per: 'rec', n: 0 },
    { id: 'submit', name: 'record.submitFields', rec: { tx: 10, custom: 2, other: 4 }, per: 'rec', n: 0 },
    { id: 'lookup', name: 'search.lookupFields', u: 1, per: 'rec', n: 0 },
    { id: 'each', name: 'search run().each / getRange', sub: 'per page of results', u: 10, per: 'run', n: 1 },
    { id: 'paged', name: 'search.runPaged + pagedData.fetch', sub: 'per page fetched', u: 5, per: 'run', n: 0 },
    { id: 'suiteql', name: 'query.runSuiteQL', sub: 'per call', u: 10, per: 'run', n: 0 },
    { id: 'https', name: 'https.get / post / request', u: 10, per: 'rec', n: 0 },
    { id: 'email', name: 'email.send', u: 20, per: 'rec', n: 0 },
    { id: 'fileload', name: 'file.load', u: 10, per: 'run', n: 0 },
    { id: 'filesave', name: 'file.save', u: 20, per: 'run', n: 0 },
    { id: 'render', name: 'render.transaction / xmlToPdf', u: 10, per: 'rec', n: 0 },
    { id: 'task', name: 'task.create + submit', sub: 'scheduled or map/reduce task', u: 20, per: 'run', n: 0 }
  ];
  const gov = $('#governance');
  if (gov) {
    $('#govType').innerHTML = LIMITS.map(l => `<option value="${l[0]}">${esc(l[1])} · ${l[2].toLocaleString()} units</option>`).join('');
    $('#govType').value = 'sched';
    $('#opsBody').innerHTML = OPS.map(o => `<tr data-id="${o.id}">
      <td class="name">${esc(o.name)}${o.sub ? `<small>${esc(o.sub)}</small>` : ''}</td>
      <td>${o.rec ? `<select data-cat aria-label="${esc(o.name)} record type"><option value="tx">Transaction</option><option value="custom">Custom record</option><option value="other">Other (entity, item…)</option></select>` : '—'}</td>
      <td class="u" data-u>${o.rec ? o.rec.tx : o.u}</td>
      <td><input type="number" min="0" max="10000" value="${o.n}" data-n aria-label="${esc(o.name)} count"></td>
      <td><select data-per aria-label="${esc(o.name)} applies"><option value="rec"${o.per === 'rec' ? ' selected' : ''}>per record</option><option value="run"${o.per === 'run' ? ' selected' : ''}>once per run</option></select></td>
    </tr>`).join('');
    const out = $('#govOut');
    const calc = () => {
      const type = $('#govType').value, limit = LIMITS.find(l => l[0] === type)[2];
      const N = Math.max(1, +$('#govRecords').value || 1);
      let perRec = 0, perRun = 0;
      const rows = [];
      gov.querySelectorAll('#opsBody tr').forEach(tr => {
        const o = OPS.find(x => x.id === tr.dataset.id);
        const cat = tr.querySelector('[data-cat]')?.value;
        const u = o.rec ? o.rec[cat] : o.u;
        tr.querySelector('[data-u]').textContent = u;
        const n = Math.max(0, +tr.querySelector('[data-n]').value || 0);
        if (!n) return;
        const per = tr.querySelector('[data-per]').value;
        const units = n * u;
        if (per === 'rec') perRec += units; else perRun += units;
        rows.push([o.name.split(' / ')[0] + (o.rec ? ` (${cat === 'tx' ? 'transaction' : cat})` : ''), n, u, per]);
      });
      const total = perRun + perRec * N;
      const pct = total / limit;
      const state = pct > 1 ? 'over' : pct > 0.7 ? 'warn' : 'ok';
      const maxRecords = perRec ? Math.max(0, Math.floor((limit - perRun) / perRec)) : null;
      const verdict = state === 'over' ? `Exceeds the ${limit.toLocaleString()}-unit limit` : state === 'warn' ? 'Fits, but close to the limit' : 'Fits comfortably';
      let advice = '';
      if (state !== 'ok') {
        if (['client', 'ue', 'suitelet', 'portlet', 'wfa', 'restlet'].includes(type)) advice = 'Keep the trigger script light: load and save only the current record, and hand any loop over many records to a Map/Reduce (each key gets its own 1,000 units in map, 5,000 in reduce) or a Scheduled script (10,000 units) started with task.submit.';
        else if (type === 'sched') advice = 'Check runtime.getCurrentScript().getRemainingUsage() inside the loop and reschedule yourself before it runs out, or move the per-record work to a Map/Reduce so the limit applies per key instead of per run.';
        else if (type === 'mrmap' || type === 'mrred') advice = 'Do less per key: one record load and save per invocation, no searches inside map or reduce. Move lookups to getInputData and pass the values through the context, and use record.submitFields when you only change body fields.';
        else if (type === 'mrin') advice = 'Return a search or query object from getInputData instead of running it yourself; the framework pages through it without charging your usage.';
        else advice = 'Split the work into pages and resubmit the script with task.submit when the remaining usage gets low.';
      } else if (perRec && maxRecords !== null && maxRecords < 500) {
        advice = `With these operations one run can handle at most ${maxRecords.toLocaleString()} records before the limit. Plan paging or a Map/Reduce if the volume can grow.`;
      }
      out.innerHTML = `
        <h3>Units per run</h3>
        <p class="big">${total.toLocaleString()} <small>of ${limit.toLocaleString()}</small></p>
        <div class="meter ${state}"><i style="width:${Math.min(100, pct * 100)}%"></i></div>
        <p class="verdict ${state}">${verdict} · ${Math.round(pct * 100)}%</p>
        <ul class="lines">
          ${rows.map(r => `<li><span>${esc(r[0])} × ${r[1]}${r[3] === 'rec' ? ` × ${N.toLocaleString()} rec` : ''}</span><span>${(r[1] * r[2] * (r[3] === 'rec' ? N : 1)).toLocaleString()} u</span></li>`).join('')}
          <li><span>Per record</span><span>${perRec.toLocaleString()} u</span></li>
          <li><span>Once per run</span><span>${perRun.toLocaleString()} u</span></li>
          ${maxRecords !== null ? `<li class="total"><span>Max records in one run</span><span>${maxRecords.toLocaleString()}</span></li>` : ''}
        </ul>
        ${advice ? `<p class="advice">${esc(advice)}</p>` : ''}
        <p class="note">Unit values follow the SuiteScript 2.x governance reference and can change between releases. Confirm against the Help Center for your account's version, and log runtime.getCurrentScript().getRemainingUsage() in a sandbox run before relying on this.</p>`;
    };
    gov.addEventListener('change', calc);
    gov.addEventListener('input', calc);
    calc();
  }

  /* ================= 3. Integration map explorer ================= */
  const NODES = [
    { id: 'sf', name: 'Salesforce', sub: 'CRM', kind: 'Two-way · REST', what: 'Accounts and opportunities come in as customers and sales orders. Invoice and fulfilment status goes back so sales sees it without a NetSuite licence.', ns: 'RESTlet for inbound writes, Map/Reduce for the outbound sync, token-based authentication on both sides.', tags: ['REST', 'OAuth / TBA', 'Map/Reduce'] },
    { id: 'shop', name: 'Shopify', sub: 'E-commerce', kind: 'Two-way · REST + webhooks', what: 'Web orders land as sales orders with customer and item matching. Fulfilments and stock levels flow back to the store.', ns: 'Webhook endpoint as a RESTlet, scheduled Map/Reduce for inventory and fulfilment updates, idempotent on the external order id.', tags: ['Webhooks', 'RESTlet', 'Inventory'] },
    { id: 'ariba', name: 'SAP Ariba', sub: 'Procurement network', kind: 'Two-way · cXML', what: 'Purchase orders arrive from the buyer network as cXML. Order confirmations, ship notices and invoices go back the same way.', ns: 'Suitelet endpoint that parses cXML into sales orders, User Event scripts that build the outbound documents, Advanced PDF for the invoice copy.', tags: ['cXML', 'Suitelet', 'Advanced PDF'] },
    { id: 'boomi', name: 'Boomi', sub: 'iPaaS', kind: 'Hub · connector + REST', what: 'Boomi processes carry EDI and intercompany traffic between NetSuite and partners, with mapping and retries handled in the flow.', ns: 'NetSuite connector for standard records, RESTlets for anything custom, error records written back to NetSuite for visibility.', tags: ['iPaaS', 'EDI', 'RESTlet'] },
    { id: 'edi', name: 'EDI partners', sub: '850 · 855 · 856 · 810', kind: 'Two-way · EDI documents', what: 'Orders in (850), acknowledgements, ship notices and invoices out (855, 856, 810) for retail and distribution customers.', ns: 'Documents parsed and created by Map/Reduce scripts, routed through Boomi or SFTP, with a custom record per message for audit.', tags: ['EDI', 'Map/Reduce', 'Custom Records'] },
    { id: 'monday', name: 'Monday.com', sub: 'Work management', kind: 'Two-way · REST', what: 'Project boards stay in step with NetSuite projects and tasks so delivery teams work in Monday while finance bills from NetSuite.', ns: 'Scheduled sync via RESTlet and the Monday GraphQL API, keyed on a shared external id.', tags: ['REST', 'Projects', 'Scheduled'] },
    { id: 'pbi', name: 'Power BI', sub: 'Dashboards', kind: 'Outbound · ODBC', what: 'Live finance and operations dashboards read NetSuite directly, replacing exported spreadsheets.', ns: 'SuiteAnalytics Connect over ODBC with SuiteQL views shaped for reporting, refreshed on a schedule.', tags: ['ODBC', 'SuiteQL', 'Reporting'] },
    { id: 'sftp', name: 'SFTP / S3', sub: 'File exchange', kind: 'Two-way · files', what: 'Bank files, payroll extracts and partner CSVs picked up and dropped on a schedule, with journal entries created from the contents.', ns: 'Map/Reduce with the N/sftp module, file parsing into custom records, and a status Suitelet so finance can see each run.', tags: ['N/sftp', 'Map/Reduce', 'Journals'] },
    { id: 'ai', name: 'AI agents', sub: 'Claude + MCP', kind: 'Two-way · MCP tools', what: 'Agents read invoices and purchase orders, reconcile bank lines and route approvals, bringing only the exceptions to a person.', ns: 'MCP server whose tools map one to one onto narrow RESTlets. Reads are free, writes sit behind a confidence gate, every decision logged to a custom record.', tags: ['MCP', 'RESTlet', 'Approvals'] },
    { id: 'einv', name: 'e-Invoice portal', sub: 'India GST', kind: 'Outbound · REST', what: 'Invoices registered with the government portal for an IRN and QR code, with e-way bills generated for shipments.', ns: 'User Event and scheduled scripts calling the portal API, QR code stamped on the Advanced PDF template, retries for portal downtime.', tags: ['REST', 'Compliance', 'Advanced PDF'] }
  ];
  const map = $('#map');
  if (map) {
    const W = 680, H = 460, cx = W / 2, cy = H / 2, rx = 268, ry = 178, nw = 118, nh = 44;
    const pos = NODES.map((n, i) => { const a = -Math.PI / 2 + i * (2 * Math.PI / NODES.length); return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) }; });
    const svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="NetSuite integration map; select a platform to read how it is connected">
      ${pos.map((p, i) => `<line class="link" data-for="${NODES[i].id}" x1="${cx}" y1="${cy}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}"/>`).join('')}
      <g class="node hub" tabindex="0" role="button" aria-label="NetSuite: overview of all connections" data-id="hub"><rect x="${cx - 80}" y="${cy - 32}" width="160" height="64" rx="12"/><text x="${cx}" y="${cy - 2}">NetSuite</text><text class="sub" x="${cx}" y="${cy + 16}">SuiteScript · SuiteQL · REST</text></g>
      ${NODES.map((n, i) => `<g class="node" tabindex="0" role="button" data-id="${n.id}" aria-label="${esc(n.name)}"><rect x="${(pos[i].x - nw / 2).toFixed(1)}" y="${(pos[i].y - nh / 2).toFixed(1)}" width="${nw}" height="${nh}" rx="10"/><text x="${pos[i].x.toFixed(1)}" y="${(pos[i].y - 3).toFixed(1)}">${esc(n.name)}</text><text class="sub" x="${pos[i].x.toFixed(1)}" y="${(pos[i].y + 12).toFixed(1)}">${esc(n.sub)}</text></g>`).join('')}
    </svg>`;
    $('#mapFig').innerHTML = svg;
    const panel = $('#mapPanel');
    const show = (id) => {
      map.querySelectorAll('.node').forEach(g => g.classList.toggle('on', g.dataset.id === id));
      map.querySelectorAll('.link').forEach(l => l.classList.toggle('on', l.dataset.for === id));
      const n = NODES.find(x => x.id === id);
      if (!n) {
        panel.innerHTML = `<h3>NetSuite at the centre</h3><p class="kind">${NODES.length} platforms connected</p><p>Every platform on this map has been connected to NetSuite in a real project. Select one to see what moves, in which direction, and what runs on the NetSuite side. Customer names are left out on purpose.</p><p style="margin-top:12px">Common ground across all of them: an external id on every synced record, a custom record per message for audit, retries that are safe to repeat, and errors visible inside NetSuite rather than in a log nobody reads.</p>`;
        return;
      }
      panel.innerHTML = `<h3>${esc(n.name)} <span style="color:var(--muted);font-weight:500">↔ NetSuite</span></h3><p class="kind">${esc(n.kind)}</p>
        <dl><dt>What moves</dt><dd>${esc(n.what)}</dd><dt>NetSuite side</dt><dd>${esc(n.ns)}</dd></dl>
        <ul class="tags">${n.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`;
      track('map_select', { platform: n.name });
    };
    map.querySelectorAll('.node').forEach(g => {
      g.addEventListener('click', () => show(g.dataset.id));
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(g.dataset.id); } });
    });
    show('hub');
  }
})();

/* ================= 4. Workflow or script? decision helper ================= */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const track = (n, p) => { if (typeof gtag === 'function') gtag('event', n, p); };
  const box = $('#decide');
  if (!box) return;
  // Each option scores w (SuiteFlow workflow), s (SuiteScript), n (native: saved search, formula, configuration) and gives a reason.
  const Q = [
    ['What starts it?', [
      ['A record is created or edited', { w: 1, s: 1 }, 'Record events suit both a workflow and a User Event script'],
      ['A user clicks a button on a record', { w: 1, s: 1 }, 'Buttons can be workflow actions or a Client / Suitelet script'],
      ['A schedule, or a batch of many records', { s: 2 }, 'Scheduled and Map/Reduce scripts are built for batches'],
      ['A value needs to show on a form or report', { n: 2 }, 'Display needs rarely need automation at all']
    ]],
    ['What has to happen?', [
      ['Set fields, send an email, change a status or route an approval', { w: 2 }, 'These are the actions SuiteFlow does best, with no code'],
      ['Create or update several related records, or loop over lines', { s: 2 }, 'Workflows act on one record; loops and related records need script'],
      ['Call another system, or read and write files', { s: 3 }, 'Only SuiteScript can reach outside NetSuite'],
      ['Only calculate or display something', { n: 2 }, 'A formula field, sourcing or a saved search column may be enough']
    ]],
    ['How many records in one go?', [
      ['One at a time', { w: 1 }, 'Single-record work keeps a workflow simple'],
      ['Tens', { w: 1, s: 1 }, 'Still fine for either, watch governance in scripts'],
      ['Hundreds or thousands', { s: 2 }, 'Volume calls for a Map/Reduce with per-key limits']
    ]],
    ['How complex is the logic?', [
      ['A few conditions on the record\'s own fields', { w: 2 }, 'Workflow conditions handle this without code'],
      ['Lookups on other records, maths, date rules', { s: 2 }, 'Lookups and calculations are clearer and cheaper in script'],
      ['It can be written as a formula or search criteria', { n: 2 }, 'Native formulas and searches need no maintenance']
    ]],
    ['Who will maintain it?', [
      ['An admin, without code', { w: 2, n: 1 }, 'Workflows and searches can be changed by an admin'],
      ['A developer is available', { s: 1 }, 'Script is fine when someone can read it later'],
      ['Both', { w: 1, s: 1 }, 'Either works; pick on the other answers']
    ]],
    ['How often will the rules change?', [
      ['Often, driven by business users', { w: 2 }, 'Workflow changes ship without a deployment'],
      ['Rarely, once it works', { s: 1 }, 'Stable rules are a good fit for versioned, SDF-managed code'],
      ['They are standard NetSuite behaviour we need switched on', { n: 2 }, 'Check preferences and features before building anything']
    ]]
  ];
  const form = $('#decideForm');
  form.innerHTML = Q.map((q, qi) => `<div class="field"><span class="lbl">${qi + 1}. ${esc(q[0])}</span><div class="checks opts">${q[1].map((o, oi) => `<label class="check"><input type="radio" name="q${qi}" value="${oi}"${oi === 0 ? ' checked' : ''}> ${esc(o[0])}</label>`).join('')}</div></div>`).join('');
  const out = $('#decideOut');
  const NAMES = { w: 'SuiteFlow workflow', s: 'SuiteScript', n: 'Native NetSuite (search, formula or configuration)' };
  const GUIDE = {
    w: ['Model it as states and transitions; one state per business status.', 'Keep actions to the current record. The moment you need another record or a loop, add a Workflow Action script for that one step.', 'Name every state and transition so an admin can read the diagram a year from now.'],
    s: ['Record events: User Event (afterSubmit for side effects, beforeSubmit for validation).', 'Batches or anything over a few hundred records: Map/Reduce, keyed by record id.', 'Buttons and screens: Client script for the form, Suitelet for a page of its own.', 'Manage it in an SDF project, log usage, and keep each script restartable.'],
    n: ['Try a formula field, field sourcing or a custom segment first.', 'Saved searches with summary types and formulas cover most reporting asks.', 'Look in Setup › Company › Enable Features and Accounting Preferences; the behaviour is often already there.']
  };
  const calc = () => {
    const score = { w: 0, s: 0, n: 0 }, reasons = [];
    Q.forEach((q, qi) => {
      const o = q[1][+form.querySelector(`input[name="q${qi}"]:checked`).value];
      Object.entries(o[1]).forEach(([k, v]) => score[k] += v);
      reasons.push([o[2], Object.keys(o[1])]);
    });
    const order = Object.keys(score).sort((a, b) => score[b] - score[a]);
    const top = order[0], second = order[1];
    const close = score[top] - score[second] <= 1 && score[second] > 0;
    let title = NAMES[top], note = '';
    if (close && top === 'w' && second === 's' || close && top === 's' && second === 'w') { title = 'Workflow with a Workflow Action script'; note = 'The answers are split: keep the states, emails and approvals in SuiteFlow, and write only the hard step as a Workflow Action script the workflow calls.'; }
    else if (close && (top === 'n' || second === 'n')) { note = `Check the native option first. If a formula, sourcing or a preference covers it, nothing needs to be built; otherwise go with ${NAMES[top === 'n' ? second : top]}.`; }
    const summary = `Recommendation: ${title}. ` + reasons.map(r => r[0]).join('; ') + '.';
    out.innerHTML = `
      <h3>Recommendation</h3>
      <p class="big" style="font-size:1.5rem">${esc(title)}</p>
      <div class="meter ok"><i style="width:${Math.round(100 * score[top] / Math.max(1, score.w + score.s + score.n))}%"></i></div>
      <p class="verdict ok">Workflow ${score.w} · Script ${score.s} · Native ${score.n}</p>
      ${note ? `<p class="advice">${esc(note)}</p>` : ''}
      <ul class="lines">${reasons.map(r => `<li><span>${esc(r[0])}</span><span>${r[1].map(k => k === 'w' ? 'WF' : k === 's' ? 'JS' : 'NS').join('/')}</span></li>`).join('')}</ul>
      <h3 style="margin-top:16px">How I would build it</h3>
      <ul class="guide">${GUIDE[top].map(g => `<li>${esc(g)}</li>`).join('')}</ul>
      <div class="hero-actions"><a class="btn btn-primary" href="/ask.html">Ask about your case</a><button class="btn btn-ghost" type="button" id="copyDecide">Copy summary</button></div>
      <p class="note">A rule of thumb from projects, not a verdict. Governance, licensing of the people who maintain it, and what already exists in the account all change the answer.</p>`;
    $('#copyDecide').addEventListener('click', (e) => {
      navigator.clipboard?.writeText(summary).then(() => { e.target.textContent = 'Copied'; setTimeout(() => e.target.textContent = 'Copy summary', 1500); });
      track('decide_copy', { result: title });
    });
  };
  form.addEventListener('change', calc);
  calc();
})();

/* ================= 5. NetSuite glossary (terms come from search.js so Cmd+K finds them too) ================= */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const track = (n, p) => { if (typeof gtag === 'function') gtag('event', n, p); };
  const box = $('#glossary');
  if (!box || !window.GLOSSARY) return;
  const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const terms = window.GLOSSARY.map(t => ({ term: t[0], def: t[1], id: 'g-' + slug(t[0]) })).sort((a, b) => a.term.localeCompare(b.term));
  const list = $('#glossList'), q = $('#glossQ'), az = $('#glossAZ'), count = $('#glossCount');
  const letters = [...new Set(terms.map(t => t.term[0].toUpperCase()))];
  az.innerHTML = `<button type="button" data-l="" aria-pressed="true">All</button>` + letters.map(l => `<button type="button" data-l="${l}" aria-pressed="false">${l}</button>`).join('');
  let letter = '';
  const link = (text) => esc(text).replace(/\[\[(.+?)\]\]/g, (m, t) => `<a href="#g-${slug(t)}" data-go>${esc(t)}</a>`);
  const render = () => {
    const needle = q.value.trim().toLowerCase();
    const hits = terms.filter(t => (!letter || t.term[0].toUpperCase() === letter) && (!needle || (t.term + ' ' + t.def).toLowerCase().includes(needle)));
    list.innerHTML = hits.length ? hits.map(t => `<div class="gterm" id="${t.id}"><dt>${esc(t.term)}</dt><dd>${link(t.def)}</dd></div>`).join('') : '<p class="palette-empty">No term matches. Try "governance", "SDF" or "sourcing".</p>';
    count.textContent = `${hits.length} of ${terms.length}`;
  };
  q.addEventListener('input', () => { letter = ''; az.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.l === '')); render(); if (q.value.length > 2) track('glossary_search', { query: q.value }); });
  az.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; letter = b.dataset.l; q.value = ''; az.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b)); render(); });
  const jump = (id) => {
    window.showTool?.('glossary');
    letter = ''; q.value = ''; az.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.l === '')); render();
    const el = document.getElementById(id);
    if (!el) return;
    list.querySelectorAll('.gterm.hit').forEach(x => x.classList.remove('hit'));
    el.classList.add('hit');
    el.scrollIntoView({ block: 'center' });
  };
  list.addEventListener('click', (e) => { const a = e.target.closest('a[data-go]'); if (!a) return; e.preventDefault(); history.replaceState(null, '', a.getAttribute('href')); jump(a.getAttribute('href').slice(1)); });
  render();
  if (location.hash.startsWith('#g-')) setTimeout(() => jump(location.hash.slice(1)), 50);
  window.addEventListener('hashchange', () => { if (location.hash.startsWith('#g-')) jump(location.hash.slice(1)); });
})();
