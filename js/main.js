// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Nav: blur on scroll, active link, mobile toggle
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
    if (e.isIntersecting) {
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => spy.observe(s));

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
  });
}, { threshold: 0.12 });
reveals.forEach(el => io.observe(el));

// Count-up stats
const counters = document.querySelectorAll('.count');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reducedMotion) counters.forEach(c => c.textContent = c.dataset.to);
const cio = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target, to = +el.dataset.to, start = performance.now(), dur = 1200;
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    cio.unobserve(el);
  });
}, { threshold: 0.5 });
if (!reducedMotion) counters.forEach(c => cio.observe(c));

// Typing effect
const phrases = [
  'NetSuite Techno-Functional Consultant',
  '3× Oracle NetSuite Certified',
  'SuiteScript · Integrations · Reporting',
  'Building AI agents inside NetSuite'
];
const typed = document.getElementById('typed');
const reduced = reducedMotion;
if (reduced) {
  typed.textContent = phrases[0];
} else {
  let pi = 0, ci = 0, deleting = false;
  const tick = () => {
    const full = phrases[pi];
    typed.textContent = deleting ? full.slice(0, --ci) : full.slice(0, ++ci);
    let delay = deleting ? 38 : 70;
    if (!deleting && ci === full.length) { delay = 1800; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 400; }
    setTimeout(tick, delay);
  };
  setTimeout(tick, 600);
}

// Cursor glow + card spotlight (pointer devices only)
if (window.matchMedia('(pointer: fine)').matches && !reduced) {
  const glow = document.querySelector('.cursor-glow');
  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
}
