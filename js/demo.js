// Simulated bank reconciliation agent. Sample data only; nothing leaves the browser.
const NS = [
  { ref: 'INV-1041', type: 'Invoice',     date: '2026-11-02', amount:  4250.00, entity: 'Customer A' },
  { ref: 'BILL-2231', type: 'Vendor bill', date: '2026-11-04', amount: -1180.50, entity: 'Vendor K' },
  { ref: 'INV-1047', type: 'Invoice',     date: '2026-11-05', amount: 10000.00, entity: 'Customer B' },
  { ref: 'INV-1052', type: 'Invoice',     date: '2026-11-01', amount:  3300.00, entity: 'Customer C' },
  { ref: 'BILL-2240', type: 'Vendor bill', date: '2026-11-08', amount:  -560.00, entity: 'Vendor S' },
  { ref: 'INV-1055', type: 'Invoice',     date: '2026-11-08', amount:  7150.00, entity: 'Customer D' },
  { ref: 'INV-1058', type: 'Invoice',     date: '2026-11-09', amount:  7150.00, entity: 'Customer E' },
  { ref: 'BILL-2244', type: 'Vendor bill', date: '2026-11-09', amount: -1900.00, entity: 'Vendor M' },
  { ref: 'INV-1060', type: 'Invoice',     date: '2026-11-10', amount: 12500.00, entity: 'Customer F' },
  { ref: 'BILL-2250', type: 'Vendor bill', date: '2026-11-10', amount:  -640.00, entity: 'Vendor P' },
];
const BANK = [
  { id: 'B1', date: '2026-11-03', amount:  4250.00, memo: 'NEFT ACME INV-1041' },
  { id: 'B2', date: '2026-11-04', amount: -1180.50, memo: 'UPI VENDOR BILL 2231' },
  { id: 'B3', date: '2026-11-05', amount:  9999.00, memo: 'RTGS CUST PAYMENT' },
  { id: 'B4', date: '2026-11-06', amount: -2400.00, memo: 'AUTO DEBIT OFFICE RENT' },
  { id: 'B5', date: '2026-11-07', amount:  3300.00, memo: 'IMPS INV1052' },
  { id: 'B6', date: '2026-11-08', amount:  -560.00, memo: 'CARD SOFTWARE SUBSCRIPTION' },
  { id: 'B7', date: '2026-11-09', amount:  7150.00, memo: 'NEFT TRANSFER' },
  { id: 'B8', date: '2026-11-10', amount: -1180.50, memo: 'UPI VENDOR BILL 2231' },
];
const fmt = (n) => (n < 0 ? '−' : '+') + Math.abs(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });
const days = (a, b) => Math.abs((new Date(a) - new Date(b)) / 864e5);
const refIn = (memo, ref) => memo.replace(/[^A-Z0-9]/gi, '').toUpperCase().includes(ref.replace(/[^A-Z0-9]/gi, '').toUpperCase());

// The "agent": same rule order as production. Returns a decision with reasoning.
function decide(line, used) {
  const sameSign = NS.filter(t => Math.sign(t.amount) === Math.sign(line.amount));
  const byRef = sameSign.find(t => refIn(line.memo, t.ref));
  if (byRef && used.has(byRef.ref)) {
    return { kind: 'exception', match: byRef, conf: 0.9, why: `Memo references ${byRef.ref}, but that transaction was already matched to an earlier bank line. Looks like a duplicate payment. Needs a person.` };
  }
  if (byRef && Math.abs(byRef.amount - line.amount) < 0.005) {
    return { kind: 'auto', match: byRef, conf: 0.98, why: `Memo references ${byRef.ref} and the amount matches exactly (${days(byRef.date, line.date)} day(s) apart). Auto-matched.` };
  }
  const exact = sameSign.filter(t => Math.abs(t.amount - line.amount) < 0.005 && !used.has(t.ref) && days(t.date, line.date) <= 5);
  if (exact.length === 1) {
    return { kind: 'auto', match: exact[0], conf: 0.93, why: `One open ${exact[0].type.toLowerCase()} with the same amount within 5 days: ${exact[0].ref}. Auto-matched.` };
  }
  if (exact.length > 1) {
    return { kind: 'review', options: exact, conf: 0.5, why: `${exact.length} open transactions share this amount and date window (${exact.map(t => t.ref).join(', ')}) and the memo names neither. Picking one would be a guess. Sent for review.` };
  }
  const near = sameSign.filter(t => !used.has(t.ref) && Math.abs(Math.abs(t.amount) - Math.abs(line.amount)) <= 25 && days(t.date, line.date) <= 5);
  if (near.length === 1) {
    const diff = Math.abs(Math.abs(near[0].amount) - Math.abs(line.amount)).toFixed(2);
    return { kind: 'review', options: near, conf: 0.72, why: `${near[0].ref} is ${diff} off the bank amount on the same day. Probably a bank charge or short payment. Proposed with a write-off line, pending approval.` };
  }
  return { kind: 'exception', conf: 0.95, why: `No open transaction within amount or date tolerance and the memo references nothing in NetSuite. Likely needs a new journal entry. Flagged.` };
}

const linesEl = document.getElementById('bankLines');
const logEl = document.getElementById('agentLog');
const runBtn = document.getElementById('demoRun');
const resetBtn = document.getElementById('demoReset');
const summary = document.getElementById('demoSummary');
const counts = { auto: 0, review: 0, exception: 0 };
let running = false;

function renderBank() {
  linesEl.innerHTML = BANK.map(b => `<li id="line-${b.id}" class="bank-line"><span class="bl-date">${b.date.slice(5)}</span><span class="bl-memo">${b.memo}</span><span class="bl-amt ${b.amount < 0 ? 'neg' : 'pos'}">${fmt(b.amount)}</span><span class="bl-status" aria-live="polite"></span></li>`).join('');
}
function renderNS() {
  document.querySelector('#nsTable tbody').innerHTML = NS.map(t => `<tr><td>${t.ref}</td><td>${t.type}</td><td>${t.date}</td><td>${fmt(t.amount)}</td><td>${t.entity}</td></tr>`).join('');
}
function updateSummary() {
  summary.hidden = false;
  document.getElementById('sumAuto').textContent = counts.auto;
  document.getElementById('sumReview').textContent = counts.review;
  document.getElementById('sumExc').textContent = counts.exception;
}
function setStatus(id, cls, text) {
  const li = document.getElementById('line-' + id);
  li.className = 'bank-line ' + cls;
  li.querySelector('.bl-status').textContent = text;
}
const wait = (ms) => new Promise(r => setTimeout(r, ms));
async function typeInto(el, text) {
  el.textContent = '';
  for (let i = 0; i < text.length; i += 3) { el.textContent = text.slice(0, i + 3); await wait(8); }
  el.textContent = text;
}
function logEntry(line, d) {
  const div = document.createElement('div');
  div.className = 'log-entry ' + d.kind;
  div.innerHTML = `<div class="log-head"><strong>${line.id}</strong> <span>${line.memo}</span> <em>${Math.round(d.conf * 100)}% confidence</em></div><p class="log-why"></p><div class="log-actions"></div>`;
  logEl.appendChild(div);
  logEl.scrollTop = logEl.scrollHeight;
  return div;
}
function addActions(div, line, d) {
  const box = div.querySelector('.log-actions');
  const done = (text, cls) => { box.innerHTML = `<span class="log-done">${text}</span>`; setStatus(line.id, cls, text); };
  if (d.kind === 'review') {
    const opts = d.options.map(o => `<button class="mini" data-ref="${o.ref}">Approve ${o.ref}</button>`).join('');
    box.innerHTML = opts + `<button class="mini ghost" data-reject>Reject</button>`;
    box.querySelectorAll('[data-ref]').forEach(b => b.addEventListener('click', () => done(`Approved → ${b.dataset.ref}`, 'matched')));
    box.querySelector('[data-reject]').addEventListener('click', () => done('Rejected, left open', 'open'));
  } else if (d.kind === 'exception') {
    box.innerHTML = `<button class="mini" data-je>Create journal</button><button class="mini ghost" data-flag>Flag for finance</button>`;
    box.querySelector('[data-je]').addEventListener('click', () => done('Journal drafted for review', 'matched'));
    box.querySelector('[data-flag]').addEventListener('click', () => done('Flagged for finance', 'open'));
  }
}
async function run() {
  if (running) return;
  running = true; runBtn.disabled = true; resetBtn.disabled = true;
  logEl.innerHTML = '';
  const used = new Set();
  for (const line of BANK) {
    setStatus(line.id, 'thinking', 'reading…');
    await wait(350);
    const d = decide(line, used);
    const entry = logEntry(line, d);
    await typeInto(entry.querySelector('.log-why'), d.why);
    if (d.kind === 'auto') { used.add(d.match.ref); counts.auto++; setStatus(line.id, 'matched', `Matched ${d.match.ref}`); }
    else if (d.kind === 'review') { counts.review++; setStatus(line.id, 'review', 'Needs review'); addActions(entry, line, d); }
    else { counts.exception++; setStatus(line.id, 'exception', 'Exception'); addActions(entry, line, d); }
    updateSummary();
    await wait(250);
  }
  const foot = document.createElement('p');
  foot.className = 'log-foot';
  foot.textContent = `${counts.auto} of ${BANK.length} lines matched without a person touching NetSuite. ${counts.review + counts.exception} need a decision, each with the reasoning attached.`;
  logEl.appendChild(foot); logEl.scrollTop = logEl.scrollHeight;
  running = false; resetBtn.disabled = false;
  if (typeof gtag === 'function') gtag('event', 'demo_run', { auto: counts.auto });
}
function reset() {
  counts.auto = counts.review = counts.exception = 0;
  renderBank(); logEl.innerHTML = '<p class="log-idle">Reset. Run it again.</p>'; summary.hidden = true; runBtn.disabled = false; resetBtn.disabled = true;
}
if (linesEl) { renderBank(); renderNS(); runBtn.addEventListener('click', run); resetBtn.addEventListener('click', reset); }
