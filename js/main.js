// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

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

// Soft fade-in on scroll
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
  });
}, { threshold: 0.1 });
reveals.forEach(el => io.observe(el));

// GA4 click events (no-op if gtag is blocked)
const track = (name, params) => { if (typeof gtag === 'function') gtag('event', name, params); };
document.querySelectorAll('a[href*="linkedin.com"]').forEach(a => a.addEventListener('click', () => track('click_linkedin', { location: a.closest('section')?.id || 'nav' })));
document.querySelectorAll('a[href*="github.com"]').forEach(a => a.addEventListener('click', () => track('click_github', { location: a.closest('section')?.id || 'nav' })));
document.querySelectorAll('.project').forEach(card => card.addEventListener('click', () => track('view_project', { project: card.querySelector('h3')?.textContent.trim() })));
document.querySelectorAll('.nav-links a, .hero-actions a').forEach(a => a.addEventListener('click', () => track('nav_click', { target: a.getAttribute('href') })));
