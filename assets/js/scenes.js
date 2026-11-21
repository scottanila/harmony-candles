/* =========================================================
   HARMONY CANDLES — scènes produits animées de l'accueil
   (Teddy qui flotte, pot de cœurs en couleurs, flacons en éclaté).
   Chargé après main.js : on retrie ensuite les déclencheurs de
   défilement dans l'ordre de la page pour que les sections épinglées
   décalent correctement celles qui suivent.
   ========================================================= */
(function () {
  const HC = window.HC;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const G = window.gsap && window.ScrollTrigger && !reduce;
  if (G) gsap.registerPlugin(ScrollTrigger);

  /* ---------- le reflet prend la silhouette exacte de son produit ---------- */
  document.querySelectorAll('.sheen').forEach((sh) => {
    const img = sh.parentElement.querySelector('img');
    if (!img) return;
    sh.style.webkitMaskImage = sh.style.maskImage = `url("${img.src}")`;
  });

  /* ---------- inclinaison 3D + reflet qui suivent la souris ---------- */
  if (G && fine) document.querySelectorAll('[data-tilt]:not([data-turn])').forEach((prod) => {
    const tilt = prod.querySelector('.prod__tilt');
    const sheen = prod.querySelector('.sheen');
    const ground = prod.querySelector('.ground');
    const area = prod.closest('section') || prod;
    const rx = gsap.quickTo(tilt, 'rotationX', { duration: 0.9, ease: 'power3' });
    const ry = gsap.quickTo(tilt, 'rotationY', { duration: 0.9, ease: 'power3' });
    const gx = ground && gsap.quickTo(ground, 'x', { duration: 0.9, ease: 'power3' });
    area.addEventListener('mousemove', (e) => {
      const r = prod.getBoundingClientRect();
      const dx = gsap.utils.clamp(-1, 1, (e.clientX - (r.left + r.width / 2)) / (r.width * 0.9));
      const dy = gsap.utils.clamp(-1, 1, (e.clientY - (r.top + r.height / 2)) / (r.height * 0.9));
      ry(dx * 16); rx(-dy * 10);
      if (gx) gx(-dx * 18);
      if (sheen) { sheen.style.setProperty('--sx', 50 + dx * 45 + '%'); sheen.style.setProperty('--sy', 40 + dy * 45 + '%'); }
    });
    area.addEventListener('mouseleave', () => { rx(0); ry(0); if (gx) gx(0); });
  });

  /* =========================================================
     SCÈNE 1 — Teddy : arrivée en douceur, parallaxe souris et défilement
     (le flottement lui-même est en CSS)
     ========================================================= */
  const teddy = document.querySelector('[data-teddy]');
  if (teddy && G) {
    const items = [...teddy.querySelectorAll('.t-item')];
    // arrivée : chaque pièce se pose, l'ourson d'abord
    gsap.from(items.map((i) => i.querySelector('.t-mouse')), {
      opacity: 0, y: 50, scale: 0.85, duration: 1.8, ease: 'expo.out', stagger: 0.14,
      scrollTrigger: { trigger: teddy, start: 'top 75%', once: true },
    });
    // défilement : les fondants dérivent à des vitesses différentes (profondeur)
    items.forEach((it) => {
      const sp = +(it.dataset.speed || 0);
      if (sp) gsap.fromTo(it, { y: -sp / 2 }, { y: sp / 2, ease: 'none', scrollTrigger: { trigger: teddy, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    // souris : léger décalage selon la profondeur de chaque pièce
    if (fine) {
      const movers = items.map((it) => {
        const m = it.querySelector('.t-mouse');
        return { d: +(it.dataset.depth || 1), x: gsap.quickTo(m, 'x', { duration: 1.2, ease: 'power3' }), y: gsap.quickTo(m, 'y', { duration: 1.2, ease: 'power3' }) };
      });
      const sec = teddy.closest('section');
      sec.addEventListener('mousemove', (e) => {
        const r = teddy.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width, dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        movers.forEach((m) => { m.x(dx * 22 * m.d); m.y(dy * 16 * m.d); });
      });
      sec.addEventListener('mouseleave', () => movers.forEach((m) => { m.x(0); m.y(0); }));
    }
  }

  /* =========================================================
     SCÈNE 2 — Pot de cœurs : couleurs et parfums
     ========================================================= */
  const field = document.querySelector('[data-swfield]');
  if (field) {
    const p = HC.product('pot-de-coeurs-fondants');
    const COLORS = {
      Rose: { sw: '#f2b3be', bg: '#f6e3e6', heart: 'transparent', o: 0, l: 0 },
      Blanc: { sw: '#f4f1ec', bg: '#efede8', heart: '#efe4d6', o: 1, l: 0.55 },
      Bleu: { sw: '#a9c9e8', bg: '#e2ebf3', heart: '#7fb1e3', o: 1, l: 0.12 },
      Vert: { sw: '#b5dcae', bg: '#e5eee0', heart: '#8fcf88', o: 1, l: 0.12 },
      Jaune: { sw: '#f4dc84', bg: '#f5eed5', heart: '#f2cf45', o: 1, l: 0.22 },
    };
    const colors = p.o[0][1];
    const parfums = p.o[1][1];
    let color = 'Rose', parfum = parfums[0];
    const sw = document.querySelector('[data-swatches]');
    const pf = document.querySelector('[data-parfums]');
    const cta = document.querySelector('[data-coeurs-cta]');
    const wipe = field.querySelector('.swfield__wipe');
    const name = field.querySelector('[data-colname]');
    const prod = field.querySelector('.prod');

    sw.innerHTML = colors.map((cn) => `<button type="button" class="swatch${cn === color ? ' is-active' : ''}" style="--c:${COLORS[cn].sw}" data-c="${cn}" aria-label="${cn}" data-cursor="${cn}"></button>`).join('');
    pf.innerHTML = parfums.map((x) => `<button type="button" class="chip${x === parfum ? ' is-active' : ''}" data-p="${x}">${x}</button>`).join('');

    const apply = (cn) => {
      const k = COLORS[cn];
      field.style.setProperty('--heart', k.heart === 'transparent' ? COLORS.Rose.sw : k.heart);
      field.style.setProperty('--tint-o', k.o);
      field.style.setProperty('--light-o', k.l);
    };
    const update = () => {
      const v = p.v.find((x) => x[1] === color + ' / ' + parfum);
      cta.href = v ? HC.cartUrl(v[0], 1) : HC.shopUrl(p);
      document.querySelector('[data-colsel]').textContent = color;
      document.querySelector('[data-parsel]').textContent = parfum;
    };
    field.style.setProperty('--bg', COLORS.Rose.bg);
    apply('Rose'); update();

    // petits cœurs qui s'envolent
    const popHearts = (hex) => {
      if (!G) return;
      const r = field.getBoundingClientRect();
      for (let i = 0; i < 9; i++) {
        const h = document.createElement('span');
        h.className = 'pop-heart';
        h.style.setProperty('--hc', hex);
        h.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.2C.8 8.2 3 4.5 6.6 4.5c2.1 0 3.6 1.2 5.4 3.1 1.8-1.9 3.3-3.1 5.4-3.1 3.6 0 5.8 3.7 4.2 7.3C19.5 16.4 12 21 12 21z"/></svg>';
        h.style.left = r.width * (0.35 + Math.random() * 0.3) + 'px';
        h.style.top = r.height * (0.5 + Math.random() * 0.15) + 'px';
        field.appendChild(h);
        gsap.fromTo(h, { scale: 0, rotation: gsap.utils.random(-30, 30) }, {
          scale: gsap.utils.random(0.7, 1.6), x: gsap.utils.random(-160, 160), y: gsap.utils.random(-260, -120),
          rotation: gsap.utils.random(-60, 60), opacity: 0, duration: gsap.utils.random(1.2, 2), ease: 'power2.out', delay: i * 0.03,
          onComplete: () => h.remove(),
        });
      }
    };

    sw.addEventListener('click', (e) => {
      const b = e.target.closest('.swatch');
      if (!b || b.dataset.c === color) return;
      color = b.dataset.c;
      sw.querySelectorAll('.swatch').forEach((s) => s.classList.toggle('is-active', s === b));
      const k = COLORS[color];
      apply(color); update();
      if (!G) { field.style.setProperty('--bg', k.bg); name.textContent = color; return; }
      // fond qui s'étend en cercle depuis le centre du produit
      wipe.style.background = k.bg;
      gsap.fromTo(wipe, { clipPath: 'circle(0% at 50% 55%)' }, {
        clipPath: 'circle(75% at 50% 55%)', duration: 1.1, ease: 'expo.inOut',
        onComplete: () => { field.style.setProperty('--bg', k.bg); gsap.set(wipe, { clipPath: 'circle(0% at 50% 55%)' }); },
      });
      // le produit saute et tourne sur lui-même
      gsap.timeline()
        .to(prod, { y: -40, rotation: -4, scale: 1.04, duration: 0.35, ease: 'power2.out' })
        .to(prod, { y: 0, rotation: 0, scale: 1, duration: 0.9, ease: 'elastic.out(1, .45)' });
      // le nom de la couleur roule
      gsap.timeline()
        .to(name, { yPercent: -110, duration: 0.35, ease: 'power2.in' })
        .add(() => { name.textContent = color; })
        .fromTo(name, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: 'expo.out' });
      popHearts(k.sw);
    });
    pf.addEventListener('click', (e) => {
      const b = e.target.closest('.chip');
      if (!b) return;
      parfum = b.dataset.p;
      pf.querySelectorAll('.chip').forEach((c) => c.classList.toggle('is-active', c === b));
      update();
    });

    // arrivée : le pot tombe et rebondit sur son rondin
    if (G) gsap.from(prod, { y: -220, rotation: 8, opacity: 0, duration: 1.6, ease: 'bounce.out', scrollTrigger: { trigger: field, start: 'top 70%', once: true } });
  }

  /* =========================================================
     SCÈNE 3 — Flacons : éclaté au défilement, brume au survol
     ========================================================= */
  const fl = document.querySelector('.s-flacons');
  if (fl && G) {
    const bottles = [...fl.querySelectorAll('[data-bottle]')];
    const names = fl.querySelectorAll('.bottle__name');
    const spread = () => (innerWidth < 761 ? 30 : 24);
    gsap.set(bottles, { x: 0, y: 0, xPercent: -50, yPercent: -50 });
    gsap.set(bottles[1], { zIndex: 2 });
    let open = false;
    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: {
        trigger: fl, start: 'top top', end: '+=240%', pin: true, scrub: 1, invalidateOnRefresh: true,
        onUpdate: (s) => {
          open = s.progress > 0.55;
          bottles.forEach((b) => { if (!b.dataset.hover) b.classList.toggle('is-spraying', s.progress > 0.62 && s.progress < 0.97); });
        },
      },
    });
    tl.fromTo(bottles, { y: '30svh', scale: 0.7, opacity: 0 }, { y: 0, scale: 0.86, opacity: 1, duration: 0.2, stagger: 0.03, ease: 'power3.out' }, 0)
      .to(bottles[0], { x: () => -spread() + 'vw', rotation: -7, scale: 1, duration: 0.3 }, 0.25)
      .to(bottles[2], { x: () => spread() + 'vw', rotation: 7, scale: 1, duration: 0.3 }, 0.25)
      .to(bottles[1], { y: '-3svh', scale: 1.06, duration: 0.3 }, 0.25)
      .fromTo(names, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.1, stagger: 0.04 }, 0.5)
      .fromTo(fl.querySelector('.s-flacons__notes'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.1 }, 0.66)
      .to({}, { duration: 0.2 });

    // au survol d'un flacon déployé : il se soulève et vaporise
    if (fine) bottles.forEach((b) => {
      const t = b.querySelector('.prod');
      b.addEventListener('mouseenter', () => {
        if (!open) return;
        b.dataset.hover = 1; b.classList.add('is-spraying');
        gsap.to(t, { y: -24, duration: 0.6, ease: 'power3.out' });
      });
      b.addEventListener('mouseleave', () => {
        delete b.dataset.hover;
        gsap.to(t, { y: 0, duration: 0.8, ease: 'elastic.out(1, .5)' });
      });
    });
  }

  // recalcul dans l'ordre réel de la page : chaque section épinglée décale bien toutes celles qui la suivent
  if (G) {
    ScrollTrigger.sort((a, b) => {
      const x = a.trigger, y = b.trigger;
      if (!x || !y || x === y) return 0;
      return x.compareDocumentPosition(y) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });
    ScrollTrigger.refresh();
  }
})();
