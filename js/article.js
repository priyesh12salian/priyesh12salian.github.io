// Notes articles: reading time, table of contents with the active heading, and how far you have read.
(function () {
  const article = document.querySelector('.article');
  if (!article) return;
  // Reading time from the words on the page
  const words = [...article.querySelectorAll('p, li')].map(e => e.textContent.trim().split(/\s+/).length).reduce((a, b) => a + b, 0);
  const mins = Math.max(1, Math.round(words / 220));
  document.querySelectorAll('[data-readtime]').forEach(e => e.textContent = mins + ' min read');

  const toc = document.getElementById('toc');
  const heads = [...article.querySelectorAll('h2')];
  if (!toc || heads.length < 2) return;
  const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  heads.forEach(h => { if (!h.id) h.id = slug(h.textContent); });
  toc.innerHTML = `<h4>In this note</h4><ol>${heads.map(h => `<li><a href="#${h.id}">${h.textContent}</a></li>`).join('')}</ol><p class="toc-prog"><span id="tocPct">0%</span> read · ${mins} min</p><div class="toc-bar"><i id="tocBar"></i></div>`;
  toc.hidden = false;
  const links = toc.querySelectorAll('a');
  const setOn = (id) => links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + id));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) setOn(e.target.id); });
  }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });
  heads.forEach(h => io.observe(h));
  setOn(heads[0].id);
  const pct = document.getElementById('tocPct'), bar = document.getElementById('tocBar');
  const onScroll = () => {
    const r = article.getBoundingClientRect();
    const total = r.height - window.innerHeight * 0.6;
    const p = Math.max(0, Math.min(1, (-r.top) / Math.max(1, total)));
    pct.textContent = Math.round(p * 100) + '%';
    bar.style.width = (p * 100) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
