// Minimal JavaScript highlighter and copy buttons for the Snippets page
const KW = /\b(const|let|var|function|return|if|else|for|while|try|catch|finally|throw|new|typeof|define|require|true|false|null|undefined|of|in|do|break|continue|switch|case|default)\b/g;
function highlight(src) {
  const out = [];
  const re = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|('(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?\b)/g;
  let last = 0, m;
  const plain = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(KW, '<span class="tok-k">$1</span>').replace(/\b([a-zA-Z_]\w*)(?=\()/g, '<span class="tok-f">$1</span>');
  while ((m = re.exec(src))) {
    out.push(plain(src.slice(last, m.index)));
    const esc = m[0].replace(/&/g, '&amp;').replace(/</g, '&lt;');
    out.push(m[1] ? `<span class="tok-c">${esc}</span>` : m[2] ? `<span class="tok-s">${esc}</span>` : `<span class="tok-n">${esc}</span>`);
    last = re.lastIndex;
  }
  out.push(plain(src.slice(last)));
  return out.join('');
}
document.querySelectorAll('.snippet').forEach(card => {
  const code = card.querySelector('code');
  const raw = code.textContent;
  code.innerHTML = highlight(raw);
  const btn = card.querySelector('.copy-btn');
  btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(raw); btn.textContent = 'Copied'; btn.classList.add('done'); }
    catch (e) { btn.textContent = 'Select & copy'; }
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('done'); }, 1800);
    if (typeof gtag === 'function') gtag('event', 'copy_snippet', { title: card.querySelector('h2').textContent });
  });
});
