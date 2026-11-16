(function () {
  const root = document.documentElement;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Přepínač tmavého režimu ---------- */
  const toggle = document.querySelector('.theme-toggle');
  toggle.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) { /* bez úložiště */ }
  });

  /* ---------- Stín hlavičky po odscrollování ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- „Boop“ – pružné poskočení ikon při najetí ---------- */
  document.querySelectorAll('.boop').forEach((el, i) => {
    let timer;
    const rotation = i % 2 ? -14 : 14;
    const trigger = () => {
      if (reduceMotion) return;
      el.style.transform = `rotate(${rotation}deg) scale(1.15)`;
      clearTimeout(timer);
      timer = setTimeout(() => { el.style.transform = ''; }, 150);
    };
    const host = el.closest('.skill-card') || el;
    host.addEventListener('mouseenter', trigger);
  });

  /* ---------- Jiskřičky kolem jména ---------- */
  const sparkleHost = document.querySelector('.sparkle-wrap');
  const colors = ['hsl(50 100% 55%)', 'hsl(333 100% 60%)', 'hsl(245 100% 70%)'];
  const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

  function addSparkle() {
    const size = random(10, 22);
    const span = document.createElement('span');
    span.className = 'sparkle';
    span.style.top = random(-10, 90) + '%';
    span.style.left = random(-2, 98) + '%';
    span.innerHTML =
      `<svg width="${size}" height="${size}" viewBox="0 0 68 68" fill="none" aria-hidden="true">` +
      `<path d="M26.5 25.5C19.07 33.35 0 34 0 34s19.13 1.7 26.5 9.5C33.53 50.96 34 68 34 68s.37-17.23 7.5-24.5C49.04 35.82 68 34 68 34s-18.97-.53-26.5-8.5C34.4 18 34 0 34 0s-.04 17.86-7.5 25.5Z" fill="${colors[random(0, colors.length)]}"/></svg>`;
    sparkleHost.appendChild(span);
    setTimeout(() => span.remove(), 850);
  }

  if (sparkleHost && !reduceMotion) {
    (function loop() {
      if (!document.hidden) addSparkle();
      setTimeout(loop, random(250, 600));
    })();
  }

  /* ---------- Odkrývání sekcí při scrollu ---------- */
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('visible');
          io.unobserve(el);
          // Po doběhnutí animace vrátíme prvku jeho vlastní hover přechody.
          setTimeout(() => {
            el.classList.remove('reveal', 'visible');
            el.style.transitionDelay = '';
          }, 1000);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 70}ms`;
      io.observe(el);
    });
  } else {
    items.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- Rok v patičce ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
