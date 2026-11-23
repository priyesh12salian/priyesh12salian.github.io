// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

// Nav: shadow on scroll, active link, mobile toggle
const nav = document.getElementById('nav');
const links = document.querySelectorAll('.nav-links a');
const toggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const progress = document.getElementById('progress');
const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 24);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Sliding underline that follows the active nav link (desktop only)
const ink = document.getElementById('navInk');
if (finePointer && !reducedMotion) navLinks.classList.add('has-ink');
const moveInk = () => {
  if (!navLinks.classList.contains('has-ink')) return;
  const a = navLinks.querySelector('a.active:not(.nav-cta)');
  if (!a) { ink.classList.remove('on'); return; }
  ink.style.left = a.offsetLeft + 'px';
  ink.style.width = a.offsetWidth + 'px';
  ink.classList.add('on');
};
window.addEventListener('resize', moveInk);
toggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  toggle.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
});
links.forEach(a => a.addEventListener('click', () => { navLinks.classList.remove('open'); toggle.classList.remove('open'); }));

const sections = document.querySelectorAll('main section[id]');
const spy = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
      moveInk();
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => spy.observe(s));

// Slide-up on scroll, cards in a grid appear one after another
['.skills-grid', '.case-list', '.project-grid', '.timeline', '.cert-list'].forEach(sel => {
  document.querySelectorAll(sel).forEach(group => {
    group.querySelectorAll(':scope > .reveal').forEach((el, i) => el.style.setProperty('--d', Math.min(i, 8) * 80 + 'ms'));
  });
});
const reveals = document.querySelectorAll('.reveal, .section-head, .timeline');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
  });
}, { threshold: 0.1 });
reveals.forEach(el => io.observe(el));

// Typed title line (full text stays in the DOM for search engines and screen readers)
const typed = document.getElementById('typed');
if (typed) {
  const text = typed.dataset.text, out = typed.querySelector('.typed-text');
  if (reducedMotion) { out.textContent = text; }
  else {
    out.textContent = '';
    typed.classList.add('typing');
    const start = performance.now() + 650, perChar = 42;
    const tick = (now) => {
      const n = Math.max(0, Math.min(text.length, Math.floor((now - start) / perChar)));
      out.textContent = text.slice(0, n);
      if (n < text.length) requestAnimationFrame(tick);
      else setTimeout(() => typed.classList.remove('typing'), 1800);
    };
    requestAnimationFrame(tick);
  }
}

// Counting numbers in the hero
const counters = document.querySelectorAll('.count');
if (reducedMotion) {
  counters.forEach(c => c.textContent = c.dataset.to);
} else {
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target, to = +el.dataset.to, start = performance.now(), dur = 1100;
      const step = (t) => {
        const p = Math.min(1, (t - start) / dur), eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(to * eased);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      cio.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => cio.observe(c));
}

// Card tilt on hover (desktop pointers only)
if (finePointer && !reducedMotion) {
  document.querySelectorAll('.clickable').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg) translateY(-4px)`;
      card.style.transition = 'transform .08s, box-shadow .25s, border-color .25s';
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; card.style.transition = 'transform .35s, box-shadow .25s, border-color .25s'; });
  });
}

const track = (name, params) => { if (typeof gtag === 'function') gtag('event', name, params); };

// Popup (modal) for compact cards
const modal = document.getElementById('modal');
if (modal) {
const modalKind = document.getElementById('modalKind');
const modalTitle = document.getElementById('modalTitle');
const modalSub = document.getElementById('modalSub');
const modalBody = document.getElementById('modalBody');
let lastFocus = null;


function openModal(card) {
  const title = card.querySelector('h3')?.textContent.trim() || '';
  const details = card.querySelector('.details');
  if (!details) return;
  const date = card.querySelector('.tl-date')?.textContent.trim();
  const org = card.querySelector('.tl-org')?.textContent.trim();
  modalKind.textContent = card.dataset.kind + (date ? ' · ' + date : '');
  modalTitle.textContent = title;
  modalSub.textContent = org || '';
  modalBody.innerHTML = details.outerHTML;
  const tags = card.querySelector('.tags');
  if (tags && card.classList.contains('project')) modalBody.appendChild(tags.cloneNode(true));
  modalBody.querySelectorAll('.chips li, .tl-bullets li, .cert-list li').forEach((li, i) => li.style.setProperty('--i', i));
  lastFocus = card;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  modal.querySelector('.modal-close').focus();
  track('open_details', { kind: card.dataset.kind, title });
}
function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (lastFocus) lastFocus.focus();
}
document.querySelectorAll('.clickable').forEach(card => {
  card.addEventListener('click', (e) => { if (e.target.closest('a')) return; openModal(card); });
  card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card); } });
});
modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
}

// GA4 click events
document.querySelectorAll('a[href*="linkedin.com"]').forEach(a => a.addEventListener('click', () => track('click_linkedin', { location: a.closest('section')?.id || 'nav' })));
document.querySelectorAll('a[href*="github.com"]').forEach(a => a.addEventListener('click', () => track('click_github', { location: a.closest('section')?.id || 'nav' })));
document.querySelectorAll('.nav-links a, .hero-actions a').forEach(a => a.addEventListener('click', () => track('nav_click', { target: a.getAttribute('href') })));
document.querySelectorAll('a[data-resume]').forEach(a => a.addEventListener('click', () => track('download_resume', { location: a.closest('section')?.id || 'page' })));

// Theme toggle (initial theme is set by the inline script in <head>)
const themeBtn = document.getElementById('themeBtn');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    track('toggle_theme', { theme: next });
  });
}

// Back to top
const toTop = document.getElementById('toTop');
if (toTop) {
  window.addEventListener('scroll', () => toTop.classList.toggle('show', window.scrollY > 600), { passive: true });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));
}

// Latest public repos from GitHub (hidden if the request fails or nothing to show)
const ghGrid = document.getElementById('ghGrid');
const loadRepos = () => {
  fetch('https://api.github.com/users/priyesh12salian/repos?sort=pushed&per_page=12')
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(repos => {
      const own = repos.filter(r => !r.fork && !r.archived).slice(0, 6);
      if (!own.length) return;
      ghGrid.innerHTML = own.map(r => `
        <a class="gh-card" href="${r.html_url}" target="_blank" rel="noopener">
          <strong>${r.name}</strong>
          <p>${r.description ? r.description.replace(/</g, '&lt;') : 'No description yet.'}</p>
          <div class="gh-meta">${r.language ? `<span>${r.language}</span>` : ''}<em>★ ${r.stargazers_count}</em></div>
        </a>`).join('');
      const strip = document.getElementById('ghStrip');
      strip.hidden = false;
      strip.classList.add('visible');
    })
    .catch(() => {});
};

document.querySelectorAll('a[data-book]').forEach(a => a.addEventListener('click', () => track('book_call', { target: a.getAttribute('href') })));

// Case study filter chips
const caseFilter = document.getElementById('caseFilter');
if (caseFilter) {
  const cases = [...document.querySelectorAll('.case-list .case')];
  const countEl = document.getElementById('filterCount');
  caseFilter.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    caseFilter.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
    const tag = b.dataset.tag;
    let shown = 0;
    cases.forEach(c => {
      const show = tag === 'all' || (c.dataset.tags || '').split(' ').includes(tag);
      if (show) shown++;
      if (show && c.classList.contains('is-hidden')) {
        c.classList.remove('is-hidden'); c.classList.add('is-out', 'visible');
        requestAnimationFrame(() => requestAnimationFrame(() => c.classList.remove('is-out')));
      } else if (!show && !c.classList.contains('is-hidden')) {
        c.classList.add('is-out');
        setTimeout(() => { if (c.classList.contains('is-out')) c.classList.add('is-hidden'); }, reducedMotion ? 0 : 300);
      }
    });
    if (countEl) countEl.textContent = shown + ' of ' + cases.length;
    track('filter_cases', { tag });
  });
}

// GitHub contribution heatmap (public contributions, last 12 months; hidden if the request fails)
const ghHeat = document.getElementById('ghHeat');
const loadHeat = () => {
  fetch('https://github-contributions-api.jogruber.de/v4/priyesh12salian?y=last')
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(d => {
      const days = d.contributions;
      if (!days || !days.length) return;
      const pad = new Date(days[0].date + 'T00:00:00').getDay();
      const cell = 12, step = 15, top = 18, left = 32;
      const weeks = Math.ceil((days.length + pad) / 7);
      let rects = '', months = '', lastM = -1;
      days.forEach((day, i) => {
        const idx = i + pad, w = Math.floor(idx / 7), dow = idx % 7;
        const dt = new Date(day.date + 'T00:00:00');
        if ((dow === 0 || i === 0) && dt.getMonth() !== lastM) {
          lastM = dt.getMonth();
          if (i === 0 || w < weeks - 1) months += `<text class="hm" x="${left + w * step}" y="10">${dt.toLocaleString('en', { month: 'short' })}</text>`;
        }
        rects += `<rect x="${left + w * step}" y="${top + dow * step}" width="${cell}" height="${cell}" data-l="${day.level}"><title>${day.count} contribution${day.count === 1 ? '' : 's'} on ${day.date}</title></rect>`;
      });
      const labels = ['Mon', 'Wed', 'Fri'].map((l, i) => `<text class="hm" x="0" y="${top + (1 + i * 2) * step + 9}">${l}</text>`).join('');
      document.getElementById('heatSvg').innerHTML = `<svg viewBox="0 0 ${left + weeks * step} ${top + 7 * step}" role="img" aria-label="GitHub contributions over the last year">${months}${labels}${rects}</svg>`;
      document.getElementById('heatTotal').textContent = `${d.total.lastYear} public contributions in the last year`;
      ghHeat.hidden = false;
      ghHeat.classList.add('visible');
    })
    .catch(() => {});
};
// Both GitHub requests wait until the Projects section is about to scroll into view, so they never compete with the first paint
const projects = document.getElementById('projects');
if (projects && (ghGrid || ghHeat)) {
  const start = () => { if (ghGrid) loadRepos(); if (ghHeat) loadHeat(); };
  if ('IntersectionObserver' in window) {
    const near = new IntersectionObserver((entries) => { if (entries.some(e => e.isIntersecting)) { near.disconnect(); start(); } }, { rootMargin: '800px 0px' });
    near.observe(projects);
  } else start();
}

// Installable site: register the service worker on the live domain only
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}

// Email subscription box for new notes (Buttondown, free tier). Set the username once here; boxes stay hidden until then.
const BUTTONDOWN = 'USERNAME';
if (BUTTONDOWN && BUTTONDOWN !== 'USERNAME') {
  document.querySelectorAll('[data-newsletter]').forEach(host => {
    host.innerHTML = `<section class="newsletter" aria-labelledby="nlTitle">
      <h3 id="nlTitle">New notes by email</h3>
      <p>One short email when a note is published, nothing else. Unsubscribe with one click.</p>
      <form action="https://buttondown.com/api/emails/embed-subscribe/${BUTTONDOWN}" method="post" target="_blank">
        <input type="email" name="email" placeholder="you@company.com" required aria-label="Your email address" autocomplete="email">
        <button class="btn btn-primary" type="submit">Subscribe</button>
      </form>
      <p class="note">Delivered by Buttondown. Your address is used for this list only.</p>
    </section>`;
    host.querySelector('form').addEventListener('submit', () => track('newsletter_subscribe', { page: location.pathname }));
  });
}
