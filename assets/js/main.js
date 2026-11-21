/* =========================================================
   HARMONY CANDLES — moteur d'animations (GSAP + ScrollTrigger + Lenis)
   Tout est piloté par attributs : data-split, data-reveal, data-clip,
   data-draw, data-parallax, data-words, data-count, data-magnetic…
   ========================================================= */
(function () {
  const html = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (!window.gsap || !window.ScrollTrigger || reduce) {
    html.classList.remove('anim');
    const ld = document.querySelector('.loader');
    if (ld) ld.remove();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- défilement doux ---------- */
  if (window.Lenis) {
    const lenis = new Lenis({ duration: 1.25, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    window.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- découpage en mots (conserve <em>, <br>, .flame) ---------- */
  function splitWords(el) {
    if (el.dataset.splitDone) return el.querySelectorAll('.w__i');
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w';
            const i = document.createElement('span'); i.className = 'w__i'; i.textContent = part;
            w.appendChild(i); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') {
          if (n.classList.contains('flame')) {
            const w = document.createElement('span'); w.className = 'w';
            const i = document.createElement('span'); i.className = 'w__i';
            n.replaceWith(w); i.appendChild(n); w.appendChild(i);
          } else walk(n);
        }
      });
    };
    walk(el);
    el.dataset.splitDone = '1';
    return el.querySelectorAll('.w__i');
  }
  window.HCsplit = splitWords;

  const splitIn = (el, delay = 0) => gsap.to(splitWords(el), { y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.045, delay });

  /* ---------- briques réutilisables ---------- */
  function bind(root = document) {
    root.querySelectorAll('[data-split]:not([data-hero])').forEach((el) => {
      if (el.dataset.bound) return; el.dataset.bound = 1;
      splitWords(el);
      ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => splitIn(el, +(el.dataset.delay || 0)) });
    });
    root.querySelectorAll('[data-reveal]').forEach((el) => {
      if (el.dataset.bound) return; el.dataset.bound = 1;
      gsap.to(el, { opacity: 1, y: 0, duration: 1.4, ease: 'expo.out', delay: +(el.dataset.delay || 0), scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
    root.querySelectorAll('[data-clip]').forEach((el) => {
      if (el.dataset.bound) return; el.dataset.bound = 1;
      const img = el.querySelector('img');
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true }, delay: +(el.dataset.delay || 0) });
      tl.to(el, { clipPath: 'inset(0% 0 0 0)', duration: 1.6, ease: 'expo.inOut' });
      if (img && !img.hasAttribute('data-parallax')) tl.from(img, { scale: 1.3, duration: 2.2, ease: 'expo.out' }, 0.1);
    });
    root.querySelectorAll('[data-draw]').forEach((el) => {
      if (el.dataset.bound) return; el.dataset.bound = 1;
      gsap.to(el, { scaleX: 1, duration: 1.8, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });
    root.querySelectorAll('[data-parallax]').forEach((el) => {
      if (el.dataset.bound) return; el.dataset.bound = 1;
      const amt = +el.dataset.parallax || 0.15;
      gsap.fromTo(el, { yPercent: -amt * 50 }, { yPercent: amt * 50, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    root.querySelectorAll('[data-stagger]').forEach((el) => {
      if (el.dataset.bound) return; el.dataset.bound = 1;
      const items = el.children;
      gsap.set(items, { opacity: 0, y: 60 });
      ScrollTrigger.batch(items, {
        start: 'top 92%', once: true,
        onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 1.4, ease: 'expo.out', stagger: 0.1 }),
      });
    });
    // texte qui s'encre mot à mot au fil du défilement
    root.querySelectorAll('[data-words]').forEach((el) => {
      if (el.dataset.bound) return; el.dataset.bound = 1;
      const walk = (node) => [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(' '));
            else { const s = document.createElement('span'); s.className = 'wd'; s.textContent = p; frag.appendChild(s); }
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains('flame')) walk(n);
      });
      walk(el);
      gsap.to(el.querySelectorAll('.wd'), { color: '#000', stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 45%', scrub: true } });
    });
    root.querySelectorAll('[data-count]').forEach((el) => {
      if (el.dataset.bound) return; el.dataset.bound = 1;
      const end = +el.dataset.count; const o = { v: 0 };
      gsap.to(o, { v: end, duration: 2.4, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true }, onUpdate: () => { el.textContent = Math.round(o.v); } });
    });
    if (fine) root.querySelectorAll('[data-magnetic]').forEach((el) => {
      if (el.dataset.bound) return; el.dataset.bound = 1;
      const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, .4)' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, .4)' });
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.35); yTo((e.clientY - r.top - r.height / 2) * 0.35);
      });
      el.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
    });
  }
  window.HCbind = bind;

  /* ---------- chargement (page d'accueil) ---------- */
  function intro() {
    const loader = document.querySelector('.loader');
    const heroSplits = document.querySelectorAll('[data-hero]');
    heroSplits.forEach(splitWords);
    const heroIn = (tl, at) => {
      const img = document.querySelector('.hero__media img');
      if (img) tl.from(img, { scale: 1.35, duration: 2.6, ease: 'expo.out' }, at);
      heroSplits.forEach((el, i) => tl.to(el.querySelectorAll('.w__i'), { y: 0, duration: 1.5, ease: 'expo.out', stagger: 0.06 }, at + 0.35 + i * 0.12));
      tl.from('[data-hero-fade], [data-fade]', { opacity: 0, y: 20, duration: 1.2, ease: 'expo.out', stagger: 0.1 }, at + 0.8);
      tl.from('.header', { yPercent: -100, opacity: 0, duration: 1.2, ease: 'expo.out' }, at + 0.5);
    };
    if (!loader) { const tl = gsap.timeline({ delay: 0.3 }); heroIn(tl, 0); return; }
    if (window.lenis) window.lenis.stop();
    const count = loader.querySelector('.loader__count');
    const o = { v: 0 };
    const tl = gsap.timeline({ onComplete: () => { loader.remove(); window.lenis && window.lenis.start(); ScrollTrigger.refresh(); } });
    tl.from('.loader__mark span', { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.045 })
      .from('.loader__tag', { opacity: 0, duration: 0.8 }, 0.3)
      .to('.loader__fill', { scaleX: 1, duration: 1.9, ease: 'power3.inOut' }, 0.2)
      .to(o, { v: 100, duration: 1.9, ease: 'power3.inOut', onUpdate: () => { count.textContent = String(Math.round(o.v)).padStart(3, '0'); } }, 0.2)
      .to('.loader__mark span', { yPercent: -110, duration: 0.8, ease: 'expo.in', stagger: 0.02 }, 2.1)
      .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1.3, ease: 'expo.inOut' }, 2.5);
    heroIn(tl, 2.7);
  }

  /* ---------- héro : parallaxe au défilement ---------- */
  function hero() {
    const h = document.querySelector('.hero');
    if (!h) return;
    gsap.to('.hero__media img', { yPercent: 12, scale: 1.08, ease: 'none', scrollTrigger: { trigger: h, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__inner, .hero__aside', { yPercent: -30, opacity: 0, ease: 'none', scrollTrigger: { trigger: h, start: '30% top', end: 'bottom top', scrub: true } });
  }

  /* ---------- bandeau défilant : vitesse et sens suivent le défilement ---------- */
  function marquees() {
    document.querySelectorAll('.marquee').forEach((m) => {
      const track = m.querySelector('.marquee__track');
      track.innerHTML += track.innerHTML;
      let x = 0, dir = m.dataset.dir === 'right' ? 1 : -1, boost = 0;
      const half = () => track.scrollWidth / 2;
      ScrollTrigger.create({ trigger: m, start: 'top bottom', end: 'bottom top', onUpdate: (s) => { dir = s.direction === 1 ? -1 : 1; boost = Math.min(Math.abs(s.getVelocity()) / 120, 14); } });
      gsap.ticker.add(() => {
        boost *= 0.93;
        x += dir * (0.6 + boost);
        const w = half();
        if (x <= -w) x += w; if (x > 0) x -= w;
        track.style.transform = `translate3d(${x}px,0,0)`;
      });
    });
  }

  /* ---------- collections en défilement horizontal épinglé ---------- */
  function hscroll() {
    const sec = document.querySelector('.hs');
    if (!sec) return;
    const track = sec.querySelector('.hs__track');
    const bar = sec.querySelector('.hs__bar i');
    const num = sec.querySelector('.hs__num');
    const cards = track.querySelectorAll('.col-card:not(.col-card--end)');
    const mm = gsap.matchMedia();
    mm.add('(min-width: 761px)', () => {
      const dist = () => track.scrollWidth - innerWidth;
      const tween = gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: {
          trigger: sec, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true,
          onUpdate: (s) => {
            bar.style.transform = `scaleX(${s.progress})`;
            num.textContent = String(Math.min(cards.length, Math.floor(s.progress * cards.length) + 1)).padStart(2, '0');
          },
        },
      });
      // chaque image se dévoile en entrant dans l'écran, et glisse légèrement à l'intérieur de son cadre
      const first = [], rest = [];
      cards.forEach((c) => (c.offsetLeft < innerWidth ? first : rest).push(c));
      // les cartes visibles d'emblée se dévoilent ensemble à l'arrivée sur la section
      gsap.fromTo(first.map((c) => c.querySelector('.col-card__media')), { clipPath: 'inset(0 0 0 100%)' }, {
        clipPath: 'inset(0 0 0 0%)', ease: 'expo.inOut', duration: 1.5, stagger: 0.12,
        scrollTrigger: { trigger: sec, start: 'top 65%', once: true },
      });
      // les suivantes, au fil du défilement horizontal
      rest.forEach((c) => gsap.fromTo(c.querySelector('.col-card__media'), { clipPath: 'inset(0 0 0 100%)' }, {
        clipPath: 'inset(0 0 0 0%)', ease: 'expo.inOut', duration: 1.4,
        scrollTrigger: { trigger: c, containerAnimation: tween, start: 'left 95%', toggleActions: 'play none none reverse' },
      }));
      // l'image glisse légèrement dans son cadre
      cards.forEach((c) => gsap.fromTo(c.querySelector('img'), { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: c, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } }));
    });
  }

  /* ---------- image qui s'ouvre en plein cadre ---------- */
  function expand() {
    document.querySelectorAll('.expand').forEach((sec) => {
      const media = sec.querySelector('.expand__media');
      const [a, b] = sec.querySelectorAll('.expand__title span');
      const tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top top', end: '+=140%', pin: true, scrub: 1 } });
      tl.to(media, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none' }, 0)
        .to(media.querySelector('img'), { scale: 1, ease: 'none' }, 0)
        .to(a, { xPercent: -40, opacity: 0, ease: 'none' }, 0.15)
        .to(b, { xPercent: 40, opacity: 0, ease: 'none' }, 0.15)
        .to(sec.querySelector('.expand__foot'), { opacity: 1, ease: 'none', duration: 0.3 }, 0.7);
    });
  }

  /* ---------- rituel : images qui se recouvrent au fil des étapes ---------- */
  function ritual() {
    const r = document.querySelector('.ritual');
    if (!r) return;
    const imgs = r.querySelectorAll('.ritual__sticky img');
    const cnt = r.querySelector('.ritual__count b');
    r.querySelectorAll('.step').forEach((s, i) => {
      if (i === 0) return;
      gsap.fromTo(imgs[i], { clipPath: 'inset(100% 0 0 0)', scale: 1.2 }, {
        clipPath: 'inset(0% 0 0 0)', scale: 1, ease: 'none',
        scrollTrigger: { trigger: s, start: 'top bottom', end: 'top 30%', scrub: true },
      });
    });
    r.querySelectorAll('.step').forEach((s, i) => ScrollTrigger.create({
      trigger: s, start: 'top 60%', end: 'bottom 60%',
      onToggle: (st) => { if (st.isActive && cnt) cnt.textContent = '0' + (i + 1); },
    }));
    r.querySelectorAll('.step__num').forEach((n) => gsap.from(n, { yPercent: 40, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: n, start: 'top 85%', once: true } }));
  }

  /* ---------- liste au survol : une image suit le curseur ---------- */
  function hoverlists() {
    document.querySelectorAll('.hoverlist').forEach((list) => {
      const float = list.querySelector('.hl-float');
      if (!float || !fine) return;
      const inner = float.querySelector('.hl-float__in');
      const imgs = float.querySelectorAll('img');
      const xTo = gsap.quickTo(float, 'x', { duration: 0.7, ease: 'power3' });
      const yTo = gsap.quickTo(float, 'y', { duration: 0.7, ease: 'power3' });
      let px = 0;
      list.addEventListener('mousemove', (e) => {
        xTo(e.clientX - float.offsetWidth / 2); yTo(e.clientY - float.offsetHeight / 2);
        gsap.to(inner, { rotate: gsap.utils.clamp(-10, 10, (e.clientX - px) * 0.6), duration: 0.8, ease: 'power3' });
        px = e.clientX;
      });
      list.querySelectorAll('.hl-row').forEach((row, i) => {
        row.addEventListener('mouseenter', () => { float.classList.add('is-on'); imgs.forEach((im, j) => im.classList.toggle('is-on', j === i)); });
      });
      list.addEventListener('mouseleave', () => float.classList.remove('is-on'));
    });
  }

  /* ---------- grand mot du pied de page ---------- */
  function footerMark() {
    const m = document.querySelector('.footer__mark');
    if (!m) return;
    gsap.from(m.querySelectorAll('span'), {
      yPercent: 100, ease: 'none', stagger: 0.05,
      scrollTrigger: { trigger: m, start: 'top bottom', end: 'bottom bottom', scrub: 1 },
    });
  }

  /* ---------- sable : citation qui respire ---------- */
  function sand() {
    const q = document.querySelector('.sand__quote');
    if (!q) return;
    gsap.fromTo(q, { letterSpacing: '0.04em' }, { letterSpacing: '-0.02em', ease: 'none', scrollTrigger: { trigger: q, start: 'top bottom', end: 'bottom 40%', scrub: true } });
  }

  /* ---------- lancement ---------- */
  bind();
  intro();
  hero();
  marquees();
  hscroll();
  expand();
  ritual();
  hoverlists();
  footerMark();
  sand();
  addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
