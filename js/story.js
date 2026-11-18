// Scroll-driven case study: light the diagram as each step enters view
const fig = document.querySelector('.story-fig');
const steps = document.querySelectorAll('.story .step');
const label = document.getElementById('stepLabel');
if (fig && steps.length) {
  const parts = fig.querySelectorAll('[data-step]');
  const setActive = (n) => {
    fig.dataset.active = n;
    parts.forEach(p => p.classList.toggle('lit', +p.dataset.step <= n));
    steps.forEach(s => s.classList.toggle('active', +s.dataset.step === n));
    const s = document.querySelector(`.story .step[data-step="${n}"] h2`);
    if (label && s) label.textContent = s.textContent;
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) setActive(+e.target.dataset.step); });
  }, { rootMargin: '-40% 0px -45% 0px', threshold: 0 });
  steps.forEach(s => io.observe(s));
  setActive(1);
}
