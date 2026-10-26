// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

// Nav: shadow on scroll, active link, mobile toggle
const nav = document.getElementById('nav');
const links = document.querySelectorAll('.nav-links a');
const toggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 24), { passive: true });
toggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  toggle.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
});
links.forEach(a => a.addEventListener('click', () => { navLinks.classList.remove('open'); toggle.classList.remove('open'); }));

const sections = document.querySelectorAll('main section[id]');
const spy = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => spy.observe(s));

// Slide-up on scroll
const reveals = document.querySelectorAll('.reveal, .section-head');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
  });
}, { threshold: 0.1 });
reveals.forEach(el => io.observe(el));

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

// Popup (modal) for compact cards
const modal = document.getElementById('modal');
const modalKind = document.getElementById('modalKind');
const modalTitle = document.getElementById('modalTitle');
const modalSub = document.getElementById('modalSub');
const modalBody = document.getElementById('modalBody');
let lastFocus = null;

const track = (name, params) => { if (typeof gtag === 'function') gtag('event', name, params); };

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

// GA4 click events
document.querySelectorAll('a[href*="linkedin.com"]').forEach(a => a.addEventListener('click', () => track('click_linkedin', { location: a.closest('section')?.id || 'nav' })));
document.querySelectorAll('a[href*="github.com"]').forEach(a => a.addEventListener('click', () => track('click_github', { location: a.closest('section')?.id || 'nav' })));
document.querySelectorAll('.nav-links a, .hero-actions a').forEach(a => a.addEventListener('click', () => track('nav_click', { target: a.getAttribute('href') })));
