// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Reveal-on-scroll for sections
const targets = document.querySelectorAll('.hero, .about .card');
targets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

targets.forEach(el => io.observe(el));
