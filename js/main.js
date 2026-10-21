// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Reveal-on-scroll for sections below the hero
const targets = document.querySelectorAll('.work-card, .about-grid');
targets.forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
  });
}, { threshold: 0.15 });
targets.forEach(el => io.observe(el));

// Menu button: scrolls to the nav links' sections on small screens
const menuBtn = document.querySelector('.menu-btn');
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    document.getElementById('work').scrollIntoView({ behavior: 'smooth' });
  });
}
