// Giscus comments (GitHub Discussions). Threads are keyed by page path; theme follows the site toggle.
(function () {
  const host = document.querySelector('.giscus');
  if (!host) return;
  const giscusTheme = () => document.documentElement.getAttribute('data-theme') === 'dark' ? 'transparent_dark' : 'light';
  const s = document.createElement('script');
  const attrs = {
    src: 'https://giscus.app/client.js',
    'data-repo': 'priyesh12salian/priyesh12salian.github.io',
    'data-repo-id': 'R_kgDOVR3Bvw',
    'data-category': 'Announcements',
    'data-category-id': 'DIC_kwDOVR3Bv84DLZcO',
    'data-mapping': 'pathname',
    'data-strict': '0',
    'data-reactions-enabled': '1',
    'data-emit-metadata': '0',
    'data-input-position': 'top',
    'data-theme': giscusTheme(),
    'data-lang': 'en',
    'data-loading': 'lazy',
    crossorigin: 'anonymous',
    async: ''
  };
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
  host.appendChild(s);
  // keep the widget in step with the sun/moon toggle
  const btn = document.getElementById('themeBtn');
  if (btn) btn.addEventListener('click', () => setTimeout(() => {
    const frame = document.querySelector('iframe.giscus-frame');
    if (frame) frame.contentWindow.postMessage({ giscus: { setConfig: { theme: giscusTheme() } } }, 'https://giscus.app');
  }, 50));
})();
