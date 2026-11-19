/* =========================================================
   HARMONY CANDLES — interactions & animations (version douce)
   GSAP + ScrollTrigger + Lenis
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  const html = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isMobile = () => window.innerWidth <= 900;
  const loader = $('.loader');

  const finishLoading = () => {
    document.body.classList.remove('is-loading');
    if (loader) loader.remove();
  };

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    html.classList.add('no-gsap');
    finishLoading();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  /* ---------------------------------------------------------
     Défilement doux
  --------------------------------------------------------- */
  let lenis = null;
  if (!reduce && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.075 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
    window.__lenis = lenis; // utilisé par pages.js (retour en haut de la grille après un filtre)
  }
  let lastY = window.scrollY, nativeVel = 0;
  gsap.ticker.add(() => {
    const y = window.scrollY;
    nativeVel = lerp(nativeVel, y - lastY, 0.2);
    lastY = y;
  });
  const getVel = () => (lenis ? lenis.velocity : nativeVel);

  /* ---------------------------------------------------------
     Menu mobile + ancres
  --------------------------------------------------------- */
  const menu = $('#menu');
  const burger = $('.nav__burger');
  const burgerTxt = $('.roll__in', burger);
  let loaded = false;
  const setMenu = (open) => {
    html.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    burgerTxt.textContent = open ? 'Fermer' : 'Menu';
    burgerTxt.dataset.text = open ? 'Fermer' : 'Menu';
    if (lenis && loaded) open ? lenis.stop() : lenis.start();
  };
  burger.addEventListener('click', () => setMenu(!html.classList.contains('menu-open')));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = id === '#top' ? 0 : $(id);
      if (target === null) return;
      e.preventDefault();
      setMenu(false);
      if (lenis) lenis.scrollTo(target, { duration: 2, easing: (t) => 1 - Math.pow(1 - t, 4) });
      else window.scrollTo({ top: target === 0 ? 0 : target.getBoundingClientRect().top + window.scrollY, behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* ---------------------------------------------------------
     Découpage en mots (conserve les <em>)
  --------------------------------------------------------- */
  function splitWords(el) {
    if (!el) return [];
    const frag = document.createDocumentFragment();
    const walk = (node, wrapEm) => {
      node.childNodes.forEach((n) => {
        if (n.nodeType === 3) {
          // on ne coupe que sur les espaces "normaux" : l'espace insécable reste collé (« parfumer ? »)
          n.textContent.split(/([ \t\n\r]+)/).forEach((part) => {
            if (!part) return;
            if (/^[ \t\n\r]+$/.test(part)) { (wrapEm || frag).appendChild(document.createTextNode(' ')); return; }
            const s = document.createElement('span');
            s.className = 'wd';
            s.textContent = part;
            (wrapEm || frag).appendChild(s);
          });
        } else if (n.nodeType === 1 && n.tagName === 'EM') {
          const em = document.createElement('em');
          frag.appendChild(em);
          walk(n, em);
        } else if (n.nodeType === 1) {
          frag.appendChild(n.cloneNode(true));
        }
      });
    };
    walk(el, null);
    el.textContent = '';
    el.appendChild(frag);
    return $$('.wd', el);
  }

  const wordsIn = (words, opts = {}) => gsap.to(words, {
    y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.6, ease: 'power3.out', stagger: 0.07, ...opts,
  });
  const wordsHide = (words) => gsap.set(words, { y: '0.5em', opacity: 0, filter: 'blur(10px)' });

  /* ---------------------------------------------------------
     Particules (pétales lumineux / braises)
  --------------------------------------------------------- */
  class Particles {
    constructor(canvas, opts = {}) {
      Object.assign(this, {
        canvas, rate: 0.2, source: null, spread: 6, size: [1, 3], speed: [0.2, 0.6], life: [300, 600],
        intensity: 1, blend: 'source-over', halo: 3, haloAlpha: 0.25, alpha: 0.6,
        colors: [[236, 198, 189], [196, 160, 106], [255, 250, 245]],
      }, opts);
      this.ctx = canvas.getContext('2d');
      this.ps = [];
      this.acc = 0;
      this.on = false;
      new ResizeObserver(() => this.resize()).observe(canvas);
      new IntersectionObserver(([e]) => { this.on = e.isIntersecting; }).observe(canvas);
      this.resize();
      gsap.ticker.add(() => this.tick());
    }
    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = this.canvas.getBoundingClientRect();
      this.w = r.width; this.h = r.height;
      this.canvas.width = Math.max(1, r.width * dpr);
      this.canvas.height = Math.max(1, r.height * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    rand(a) { return a[0] + Math.random() * (a[1] - a[0]); }
    spawn() {
      const s = this.source ? this.source() : { x: Math.random() * this.w, y: this.h + 10 };
      if (!s) return;
      this.ps.push({
        x: s.x + (Math.random() - 0.5) * this.spread * 2, y: s.y,
        vx: (Math.random() - 0.5) * 0.3, vy: -this.rand(this.speed),
        r: this.rand(this.size), t: 0, max: this.rand(this.life), seed: Math.random() * 100,
        c: this.colors[Math.floor(Math.random() * this.colors.length)],
      });
    }
    tick() {
      if (!this.on) return;
      const ctx = this.ctx;
      this.acc += this.rate * this.intensity;
      while (this.acc >= 1) { this.spawn(); this.acc -= 1; }
      ctx.clearRect(0, 0, this.w, this.h);
      ctx.globalCompositeOperation = this.blend;
      for (let i = this.ps.length - 1; i >= 0; i--) {
        const p = this.ps[i];
        p.t++;
        if (p.t > p.max) { this.ps.splice(i, 1); continue; }
        p.x += p.vx + Math.sin((p.t + p.seed) * 0.025) * 0.4;
        p.y += p.vy;
        const k = p.t / p.max;
        const a = Math.sin(Math.PI * k) * this.alpha * (0.75 + 0.25 * Math.sin(p.t * 0.12 + p.seed));
        const [r, g, b] = typeof p.c === 'function' ? p.c(k) : p.c;
        ctx.fillStyle = `rgba(${r},${g},${b},${(a * this.haloAlpha).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * this.halo, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(${r},${g},${b},${a.toFixed(3)})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
    }
  }

  /* ---------------------------------------------------------
     HERO + préchargement
  --------------------------------------------------------- */
  const hero = $('.hero');
  const heroWords = splitWords($('.hero__title'));
  wordsHide(heroWords);
  if (hero) {
    gsap.set(['.hero__kicker', '.hero__lead', '.hero__ctas > *', '.hero__scroll'], { y: 24, opacity: 0 });
    gsap.set('.hero__arch', { scale: 0.86, opacity: 0, transformOrigin: '50% 100%' });
    gsap.set('.hero__product', { yPercent: 16, opacity: 0 });
    gsap.set(['.hero__round', '.hero__badge'], { scale: 0.4, opacity: 0 });
  }
  gsap.set('.nav', { y: -24, opacity: 0 });

  // pages intérieures : en-tête de page révélé mot à mot
  const introWords = splitWords($('[data-intro-words]'));
  wordsHide(introWords);
  const introBits = $$('[data-intro]');
  if (introBits.length) gsap.set(introBits, { y: 30, opacity: 0 });

  function intro() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (!hero) {
      tl.to('.nav', { y: 0, opacity: 1, duration: 1.1 }, 0.1);
      if (introWords.length) tl.add(wordsIn(introWords, { stagger: 0.07 }), 0.15);
      if (introBits.length) tl.to(introBits, { y: 0, opacity: 1, duration: 1.3, stagger: 0.08 }, 0.35);
      return tl;
    }
    tl.to('.hero__arch', { scale: 1, opacity: 1, duration: 1.8, ease: 'expo.out' }, 0)
      .to('.hero__product', { yPercent: 0, opacity: 1, duration: 1.8, ease: 'expo.out' }, 0.25)
      .to('.hero__kicker', { y: 0, opacity: 1, duration: 1.2 }, 0.2)
      .add(wordsIn(heroWords, { stagger: 0.08 }), 0.3)
      .to('.hero__lead', { y: 0, opacity: 1, duration: 1.3 }, 0.8)
      .to('.hero__ctas > *', { y: 0, opacity: 1, duration: 1.2, stagger: 0.1 }, 0.95)
      .to(['.hero__round', '.hero__badge'], { scale: 1, opacity: 1, duration: 1.4, ease: 'back.out(1.6)', stagger: 0.15 }, 0.7)
      .to('.nav', { y: 0, opacity: 1, duration: 1.2 }, 0.6)
      .to('.hero__scroll', { y: 0, opacity: 1, duration: 1 }, 1.2);
    return tl;
  }

  const start = () => {
    loaded = true;
    finishLoading();
    if (lenis) lenis.start();
    ScrollTrigger.refresh();
  };
  const ready = Promise.race([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise((r) => setTimeout(r, 1600)),
  ]);

  if (reduce || !loader) {
    ready.then(() => { intro().progress(1); start(); });
  } else {
    const count = { v: 0 };
    const countEl = $('.loader__count');
    const bar = $('.loader__bar i');
    const ltl = gsap.timeline({ paused: true });
    ltl.to('.loader__logo', { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'power3.inOut' }, 0.1)
      .fromTo('.loader .flame', { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.9, ease: 'back.out(2)' }, 1.1)
      .to(count, {
        v: 100, duration: 2.1, ease: 'power2.inOut',
        onUpdate: () => {
          countEl.textContent = String(Math.round(count.v)).padStart(3, '0');
          bar.style.transform = `scaleX(${count.v / 100})`;
        },
      }, 0)
      .to('.loader__center', { y: -30, opacity: 0, duration: 0.7, ease: 'power3.in' }, 2.2)
      .fromTo('.loader', { clipPath: 'inset(0% 0% 0% 0% round 0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 100% 0% round 0% 0% 50% 50%)', duration: 1.3, ease: 'expo.inOut' }, 2.35)
      .add(intro, 2.75)
      .add(start, 3.6);
    ready.then(() => ltl.play());
  }

  // Parallaxe à la souris (profondeurs différentes)
  if (hero && fine && !reduce) {
    const layers = $$('.hero [data-depth]').map((el) => ({
      d: parseFloat(el.dataset.depth),
      x: gsap.quickTo(el, 'x', { duration: 1.6, ease: 'power3' }),
      y: gsap.quickTo(el, 'y', { duration: 1.6, ease: 'power3' }),
    }));
    $('.hero').addEventListener('pointermove', (e) => {
      const nx = e.clientX / innerWidth - 0.5;
      const ny = e.clientY / innerHeight - 0.5;
      layers.forEach((l) => { l.x(nx * l.d * -26); l.y(ny * l.d * -18); });
    });
  }

  // Parallaxe au scroll
  if (hero) gsap.to('.hero__visual', {
    yPercent: 12, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
  if (hero) gsap.to('.hero__text', {
    yPercent: -18, opacity: 0.2, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });

  if (!reduce && $('[data-particles="petals"]')) {
    new Particles($('[data-particles="petals"]'), {
      rate: 0.16, size: [1.2, 3.6], speed: [0.18, 0.55], life: [420, 820], spread: 0, alpha: 0.7, halo: 3.4, haloAlpha: 0.22,
    });
  }

  /* ---------------------------------------------------------
     Bandeau défilant (accélère doucement avec le scroll)
  --------------------------------------------------------- */
  const mTrack = $('.marquee__track');
  if (mTrack && !reduce) {
    const group = $('.marquee__group', mTrack);
    let gw = group.offsetWidth;
    new ResizeObserver(() => { gw = group.offsetWidth; }).observe(group);
    let x = 0, dir = -1, speed = 0.6;
    let visible = true;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(mTrack.parentElement);
    gsap.ticker.add(() => {
      if (!visible) return;
      const v = getVel();
      if (Math.abs(v) > 0.5) dir = v > 0 ? -1 : 1;
      speed = lerp(speed, 0.6 + Math.min(Math.abs(v) * 0.18, 6), 0.06);
      x += dir * speed;
      if (x <= -gw) x += gw;
      if (x > 0) x -= gw;
      mTrack.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
    });
  }

  /* ---------------------------------------------------------
     Titres : apparition mot à mot, floue → nette
  --------------------------------------------------------- */
  $$('[data-words]:not(.hero__title)').forEach((el) => {
    const words = splitWords(el);
    wordsHide(words);
    ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => wordsIn(words) });
  });

  // grilles (produits, FAQ…) : les éléments apparaissent par vagues au défilement
  const batchEls = $$('[data-stagger] > *');
  if (batchEls.length) {
    gsap.set(batchEls, { y: 60, opacity: 0 });
    ScrollTrigger.batch(batchEls, {
      start: 'top 92%', once: true,
      onEnter: (els) => gsap.to(els, { y: 0, opacity: 1, duration: 1.4, ease: 'expo.out', stagger: 0.09, clearProps: 'transform,opacity' }),
    });
  }

  $$('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 40, opacity: 0, duration: 1.4, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  // Texte de bienvenue : les mots s'éclairent au fil du scroll
  const statement = $('[data-light]');
  if (statement) {
    const words = splitWords(statement);
    gsap.fromTo(words, { opacity: 0.16 }, {
      opacity: 1, ease: 'none', stagger: 0.1,
      scrollTrigger: { trigger: statement, start: 'top 80%', end: 'bottom 50%', scrub: true },
    });
  }

  // Parallaxe multi-vitesse + révélation des images
  $$('[data-speed]').forEach((el) => {
    const s = parseFloat(el.dataset.speed);
    gsap.fromTo(el, { yPercent: -s * 50 }, {
      yPercent: s * 50, ease: 'none',
      scrollTrigger: { trigger: el.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true },
    });
    gsap.from(el, {
      y: 70, opacity: 0, scale: 0.94, duration: 1.8, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    });
  });

  /* ---------------------------------------------------------
     COLLECTIONS : défilement horizontal
  --------------------------------------------------------- */
  const track = $('.collections__track');
  const cards = $$('.card');
  const counterB = $('.collections__counter b');
  const updateCounter = () => {
    let best = 0, bd = Infinity;
    cards.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - innerWidth / 2);
      if (d < bd) { bd = d; best = i; }
    });
    counterB.textContent = String(best + 1).padStart(2, '0');
  };

  const mm = gsap.matchMedia();
  if (track) {
  gsap.from(cards, {
    y: 80, opacity: 0, duration: 1.6, ease: 'expo.out', stagger: 0.08,
    scrollTrigger: { trigger: '.collections', start: 'top 70%', once: true },
  });

  mm.add('(min-width: 901px)', () => {
    const dist = () => track.scrollWidth - innerWidth;
    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '.collections', start: 'top top', end: () => '+=' + dist(),
        pin: true, scrub: 1.2, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: updateCounter,
      },
    });
    // les produits flottent légèrement pendant le défilement
    cards.forEach((card, i) => {
      const p = $('.card__product', card);
      if (!p) return;
      gsap.fromTo(p, { yPercent: i % 2 ? 6 : -4 }, {
        yPercent: i % 2 ? -4 : 6, ease: 'none',
        scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
      });
    });
  });
  mm.add('(max-width: 900px)', () => {
    track.addEventListener('scroll', updateCounter, { passive: true });
    return () => track.removeEventListener('scroll', updateCounter);
  });
  }

  // Inclinaison douce de l'arche au survol (accueil + cartes produit des autres pages)
  if (fine && !reduce) {
    $$('.card, .pcard').forEach((card) => {
      const arch = $('.card__arch, .pcard__arch', card);
      if (!arch) return;
      const rx = gsap.quickTo(arch, 'rotationX', { duration: 0.9, ease: 'power3' });
      const ry = gsap.quickTo(arch, 'rotationY', { duration: 0.9, ease: 'power3' });
      gsap.set(arch, { transformPerspective: 900 });
      card.addEventListener('pointermove', (e) => {
        const r = arch.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 8);
        rx((0.5 - (e.clientY - r.top) / r.height) * 8);
      });
      card.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
  }

  /* ---------------------------------------------------------
     ATELIER : on tamise la lumière, la bougie s'allume
  --------------------------------------------------------- */
  const reveal = $('.reveal');
  const candle = $('.candle');
  const themeMeta = $('meta[name="theme-color"]');
  if (reveal) {
    ScrollTrigger.create({
      trigger: reveal, start: 'top 55%', end: 'bottom 45%',
      onToggle: (s) => {
        html.classList.toggle('is-dusk', s.isActive);
        if (themeMeta) themeMeta.setAttribute('content', s.isActive ? '#2a1e18' : '#f6eee4');
      },
    });
  }
  if (reveal && candle) {
    const steps = $$('.step', reveal);
    const meterNum = $('.meter__num', reveal);
    const meterLine = $('.meter__line i', reveal);
    const flameEl = $('.candle__flame', candle);
    const canvas = $('[data-particles="flame"]', reveal);
    const ease = gsap.parseEase('power2.inOut');
    let cur = -1, litVal = 0, sparks = null;

    if (!reduce && canvas) {
      sparks = new Particles(canvas, {
        rate: 0.35, spread: 3, size: [0.4, 1.3], speed: [0.6, 1.5], life: [60, 150], blend: 'lighter',
        alpha: 1, halo: 4, haloAlpha: 0.14,
        colors: [(k) => [255, Math.round(205 - k * 110), Math.round(130 - k * 100)]],
        source: () => {
          if (litVal < 0.05) return null;
          const c = canvas.getBoundingClientRect();
          const f = flameEl.getBoundingClientRect();
          return { x: f.left + f.width / 2 - c.left, y: f.top + f.height * 0.2 - c.top };
        },
      });
    }

    const setReveal = (p) => {
      const t = ease(clamp(p / 0.32));
      const lit = clamp((p - 0.3) / 0.1);
      litVal = lit;
      candle.style.setProperty('--t', t.toFixed(4));
      candle.style.setProperty('--lit', lit.toFixed(3));
      reveal.style.setProperty('--lit', lit.toFixed(3));
      const idx = p < 0.42 ? 0 : p < 0.72 ? 1 : 2;
      if (idx !== cur) {
        cur = idx;
        steps.forEach((s, i) => s.classList.toggle('is-active', i === idx));
        meterNum.textContent = '0' + (idx + 1);
      }
      meterLine.style.transform = `scaleX(${p.toFixed(4)})`;
      if (sparks) sparks.intensity = idx === 2 ? 2 : 1;
    };
    setReveal(0);
    ScrollTrigger.create({
      trigger: reveal, start: 'top top', end: 'bottom bottom',
      onUpdate: (s) => setReveal(s.progress),
      onRefresh: (s) => setReveal(s.progress),
    });

    // La flamme se penche loin du curseur, et s'avive quand on s'approche
    let mx = -9999, my = -9999, lean = 0, boost = 0;
    reveal.addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; });
    reveal.addEventListener('pointerleave', () => { mx = -9999; my = -9999; });
    gsap.ticker.add(() => {
      if (litVal <= 0 && Math.abs(lean) < 0.01) return;
      const f = flameEl.getBoundingClientRect();
      const dx = mx - (f.left + f.width / 2);
      const dy = my - (f.top + f.height / 2);
      const near = clamp(1 - Math.hypot(dx, dy) / 280);
      const wobble = Math.sin(performance.now() / 420) * 1.2;
      const push = clamp(getVel() * 0.25, -8, 8);
      lean = lerp(lean, Math.sign(dx) * near * 22 + wobble + push, 0.1);
      boost = lerp(boost, near, 0.07);
      candle.style.setProperty('--lean', lean.toFixed(2));
      candle.style.setProperty('--boost', boost.toFixed(3));
    });
  }

  /* ---------------------------------------------------------
     SPOTLIGHT : la fenêtre en arche s'ouvre sur l'image
  --------------------------------------------------------- */
  const spot = $('.spot');
  if (spot) {
    const scene = $('.spot__scene', spot);
    const lift = { v: 0 };
    const setLift = () => scene.style.setProperty('--lift', lift.v.toFixed(3));
    const fromClip = () => (isMobile()
      ? 'inset(24% 22% 24% 22% round 400px 400px 24px 24px)'
      : 'inset(15% 39% 15% 39% round 400px 400px 24px 24px)');
    gsap.timeline({ scrollTrigger: { trigger: spot, start: 'top top', end: 'bottom bottom', scrub: 1.2, invalidateOnRefresh: true } })
      .fromTo('.spot__media', { clipPath: fromClip }, { clipPath: 'inset(3% 2.5% 3% 2.5% round 32px 32px 32px 32px)', ease: 'power2.inOut', duration: 1 }, 0)
      .fromTo(scene, { scale: 1.3, transformOrigin: '50% 16%' }, { scale: () => (isMobile() ? 1 : 0.8), ease: 'none', duration: 1 }, 0)
      // les flacons quittent le sol et se mettent à flotter quand la fenêtre s'ouvre
      .fromTo(lift, { v: 0 }, { v: 1, ease: 'power2.out', duration: 0.55, onUpdate: setLift }, 0.3)
      .fromTo('.flacon--1', { rotation: 0 }, { rotation: -4, ease: 'none', duration: 1 }, 0)
      .fromTo('.flacon--3', { rotation: 0 }, { rotation: 4, ease: 'none', duration: 1 }, 0)
      .to('.spot__w--l', { x: () => (isMobile() ? 0 : -innerWidth * 0.22), y: () => (isMobile() ? -innerHeight * 0.12 : 0), opacity: 0, ease: 'power1.in', duration: 0.8 }, 0)
      .to('.spot__w--r', { x: () => (isMobile() ? 0 : innerWidth * 0.22), y: () => (isMobile() ? innerHeight * 0.12 : 0), opacity: 0, ease: 'power1.in', duration: 0.8 }, 0)
      .fromTo('.spot__shade', { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.7)
      .fromTo('.spot__foot > *', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.3 }, 0.8)
      .to({}, { duration: 0.25 });

    // profondeur : chaque flacon suit la souris à sa propre distance
    if (fine && !reduce) {
      const layers = $$('.flacon', spot).map((el) => ({
        d: parseFloat(el.dataset.depth),
        x: gsap.quickTo(el, 'x', { duration: 1.4, ease: 'power3' }),
        y: gsap.quickTo(el, 'y', { duration: 1.4, ease: 'power3' }),
      }));
      const decorX = gsap.quickTo('.spot__decor', 'x', { duration: 1.8, ease: 'power3' });
      const decorY = gsap.quickTo('.spot__decor', 'y', { duration: 1.8, ease: 'power3' });
      spot.addEventListener('pointermove', (e) => {
        const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
        layers.forEach((l) => { l.x(nx * l.d * -28); l.y(ny * l.d * -20); });
        decorX(nx * 8); decorY(ny * 6);
      });
    }

    // brume : de petites bouffées de parfum s'échappent des becs, l'une après l'autre
    const mist = $('.spot__mist', spot);
    if (mist && !reduce) {
      const mctx = mist.getContext('2d');
      const bottles = $$('.flacon img', spot);
      const tips = [[0.04, 0.305], [0.057, 0.24], [0.2, 0.193]]; // position du bec dans chaque image
      const parts = [];
      let mw = 0, mh = 0, visible = false, next = 1.2, turn = 0;
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        mw = mist.offsetWidth; mh = mist.offsetHeight; // taille de mise en page (hors mise à l'échelle)
        mist.width = Math.max(1, mw * dpr); mist.height = Math.max(1, mh * dpr);
        mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      new ResizeObserver(resize).observe(mist);
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(mist);
      const sprays = []; // une vaporisation dure ~0,4 s
      const emit = (i, amount) => {
        const c = mist.getBoundingClientRect();
        const r = bottles[i].getBoundingClientRect();
        const k = c.width / mw || 1; // la scène peut être mise à l'échelle
        const x = (r.left + r.width * tips[i][0] - c.left) / k;
        const y = (r.top + r.height * tips[i][1] - c.top) / k;
        const s = r.width / k / 220;
        for (let n = 0; n < amount; n++) {
          const sp = (2.4 + Math.random() * 4.2) * s;
          const ang = Math.PI + (Math.random() - 0.5) * 0.7; // vers la gauche, en cône
          parts.push({
            x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 0.3 * s,
            r: (8 + Math.random() * 14) * s, g: 1.006 + Math.random() * 0.008, t: 0, max: 110 + Math.random() * 80,
          });
        }
      };
      gsap.ticker.add((time, dt) => {
        if (!visible) return;
        next -= dt / 1000;
        if (next <= 0 && lift.v > 0.6) { sprays.push({ i: turn, f: 24 }); turn = (turn + 1) % bottles.length; next = 2.6 + Math.random() * 1.8; }
        for (let j = sprays.length - 1; j >= 0; j--) { emit(sprays[j].i, 3); if (--sprays[j].f <= 0) sprays.splice(j, 1); }
        mctx.clearRect(0, 0, mw, mh);
        for (let i = parts.length - 1; i >= 0; i--) {
          const p = parts[i];
          p.t++;
          if (p.t > p.max) { parts.splice(i, 1); continue; }
          p.x += p.vx; p.y += p.vy;
          p.vx *= 0.955; p.vy = p.vy * 0.96 - 0.02;
          p.r *= p.g;
          const a = Math.min(1, p.t / 8) * Math.pow(1 - p.t / p.max, 1.5) * 0.34;
          const grd = mctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          grd.addColorStop(0, `rgba(255,252,247,${a.toFixed(3)})`);
          grd.addColorStop(1, 'rgba(255,252,247,0)');
          mctx.fillStyle = grd;
          mctx.beginPath(); mctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); mctx.fill();
        }
      });
    }
  }

  /* ---------------------------------------------------------
     MOMENTS : une image en arche suit le curseur
  --------------------------------------------------------- */
  if ($('.moments__list')) gsap.from('.moment', {
    y: 40, opacity: 0, duration: 1.4, ease: 'power3.out', stagger: 0.1,
    scrollTrigger: { trigger: '.moments__list', start: 'top 85%', once: true },
  });
  const list = $('.moments__list');
  const float = $('.moments__float');
  if (fine && !reduce && list && float) {
    const imgs = $$('img', float);
    gsap.set(float, { xPercent: 18, yPercent: -55, scale: 0.7, rotation: 0 });
    const fx = gsap.quickTo(float, 'x', { duration: 0.9, ease: 'power3' });
    const fy = gsap.quickTo(float, 'y', { duration: 0.9, ease: 'power3' });
    const fr = gsap.quickTo(float, 'rotation', { duration: 1.1, ease: 'power3' });
    let lx = 0, px = -1, py = -1, shown = false;
    const show = (on) => {
      if (on === shown) return;
      shown = on;
      gsap.to(float, on
        ? { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'power3', overwrite: 'auto' }
        : { autoAlpha: 0, scale: 0.7, duration: 0.5, ease: 'power3', overwrite: 'auto' });
    };
    let inView = false;
    ScrollTrigger.create({
      trigger: list, start: 'top bottom', end: 'bottom top',
      onToggle: (s) => { inView = s.isActive; if (!inView) show(false); },
    });
    list.addEventListener('pointerenter', (e) => {
      px = e.clientX; py = e.clientY;
      if (!inView) return;
      gsap.set(float, { x: px, y: py });
      show(true);
    });
    list.addEventListener('pointerleave', () => show(false));
    list.addEventListener('pointermove', (e) => {
      px = e.clientX; py = e.clientY;
      fx(px); fy(py);
      fr(clamp((px - lx) * 0.5, -8, 8));
      lx = px;
    });
    // si la page défile sous un curseur immobile, on vérifie qu'il est toujours sur la liste
    window.addEventListener('scroll', () => {
      if (!shown) return;
      const r = list.getBoundingClientRect();
      if (px < r.left || px > r.right || py < r.top || py > r.bottom) show(false);
    }, { passive: true });
    $$('.moment', list).forEach((row) => {
      row.addEventListener('pointerenter', () => {
        const i = Number(row.dataset.i);
        imgs.forEach((im, j) => im.classList.toggle('is-on', j === i));
      });
    });
  }

  /* ---------------------------------------------------------
     ENGAGEMENTS : cartes + icônes dessinées au trait
  --------------------------------------------------------- */
  const pledgeCards = $$('.pledge__card');
  if (pledgeCards.length) {
    const paths = $$('.pledge__icon svg > *');
    paths.forEach((p) => {
      const len = typeof p.getTotalLength === 'function' ? p.getTotalLength() : 200;
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = reduce ? 0 : len;
    });
    ScrollTrigger.create({
      trigger: '.pledge__grid', start: 'top 82%', once: true,
      onEnter: () => {
        gsap.from(pledgeCards, { y: 60, opacity: 0, duration: 1.5, ease: 'expo.out', stagger: 0.12, clearProps: 'transform,opacity' });
        if (!reduce) gsap.to(paths, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut', stagger: 0.08, delay: 0.3 });
      },
    });
  }

  /* ---------------------------------------------------------
     FOOTER : le mot « Harmony » monte lettre par lettre
  --------------------------------------------------------- */
  gsap.fromTo('.footer__mark span', { yPercent: 100, opacity: 0 }, {
    yPercent: 0, opacity: 1, ease: 'none', stagger: 0.07,
    scrollTrigger: { trigger: '.footer__mark', start: 'top bottom', end: 'bottom bottom', scrub: true },
  });

  /* ---------------------------------------------------------
     Curseur, halo, boutons magnétiques
  --------------------------------------------------------- */
  if (fine && !reduce) {
    html.classList.add('has-cursor');
    const cur = $('.cursor');
    const dot = $('.cursor__dot');
    const ring = $('.cursor__ring');
    const label = $('.cursor__label');
    const glow = $('.glow');
    gsap.set([dot, ring, glow], { xPercent: -50, yPercent: -50 });
    const q = (el, p, d) => gsap.quickTo(el, p, { duration: d, ease: 'power3' });
    const dx = q(dot, 'x', 0.12), dy = q(dot, 'y', 0.12);
    const rx = q(ring, 'x', 0.55), ry = q(ring, 'y', 0.55);
    const gx = q(glow, 'x', 1.6), gy = q(glow, 'y', 1.6);
    window.addEventListener('pointermove', (e) => {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); gx(e.clientX); gy(e.clientY);
      cur.classList.add('is-on');
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => cur.classList.remove('is-on'));
    document.addEventListener('pointerover', (e) => {
      const lab = e.target.closest('[data-cursor]');
      const txt = e.target.closest('input, textarea');
      const hov = e.target.closest('a, button, .gift__img, .welcome__img, .hero__round, .pledge__card');
      cur.classList.toggle('is-label', !!lab);
      cur.classList.toggle('is-text', !lab && !!txt);
      cur.classList.toggle('is-hover', !lab && !txt && !!hov);
      if (lab) label.textContent = lab.dataset.cursor;
    });
    document.addEventListener('pointerdown', () => gsap.to(ring, { scale: 0.85, duration: 0.2 }));
    document.addEventListener('pointerup', () => gsap.to(ring, { scale: 1, duration: 0.6, ease: 'elastic.out(1,.45)' }));

    $$('[data-magnetic]').forEach((el) => {
      const qx = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3' });
      const qy = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        qx((e.clientX - r.left - r.width / 2) * 0.25);
        qy((e.clientY - r.top - r.height / 2) * 0.35);
      });
      el.addEventListener('pointerleave', () => { qx(0); qy(0); });
    });
  }

  /* ---------------------------------------------------------
     Nav : masquage au scroll + lien actif
  --------------------------------------------------------- */
  const nav = $('.nav');
  $$('.nav__link').forEach((link) => {
    const sec = $('#' + link.dataset.section);
    if (!sec) return;
    ScrollTrigger.create({
      trigger: sec, start: 'top 55%', end: 'bottom 55%',
      onToggle: (s) => link.classList.toggle('is-active', s.isActive),
    });
  });
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => {
      const y = self.scroll();
      nav.classList.toggle('is-scrolled', y > 40);
      nav.classList.toggle('is-hidden', self.direction === 1 && y > innerHeight * 0.6 && !html.classList.contains('menu-open'));
    },
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
