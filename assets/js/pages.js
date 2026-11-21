/* =========================================================
   HARMONY CANDLES — contenu dynamique : cartes produit, boutique,
   fiche produit, accordéons, FAQ, contact.
   Chargé AVANT main.js pour que les animations trouvent le contenu.
   ========================================================= */
(function () {
  const HC = window.HC;
  const qs = new URLSearchParams(location.search);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- carte produit ---------- */
  HC.card = (p) => {
    const alt = p.img.length > 1 ? `<img class="card__img card__img--alt" src="${HC.photo(p, 1)}" alt="" loading="lazy">` : '';
    const tag = !p.available ? 'Épuisé' : p.compare ? '−' + Math.round((1 - p.min / p.compare) * 100) + ' %' : p.custom ? 'Personnalisable' : '';
    const price = (p.v.length > 1 && p.max > p.min ? 'Dès ' : '') + HC.price(p.min) + (p.custom ? ' / lettre' : '');
    const opts = p.o.length ? p.o.map((o) => o[1].length + ' ' + o[0].toLowerCase()).join(' · ') : 'Fait main';
    return `<a class="card" href="produit.html?p=${p.slug}" data-cursor="Voir">
      <div class="card__media">
        ${tag ? `<span class="card__tag">${tag}</span>` : ''}
        <img class="card__img" src="${HC.photo(p, 0)}" alt="${esc(p.t)}" loading="lazy">
        ${alt}
        <span class="card__quick"><span>Découvrir</span><span>→</span></span>
      </div>
      <div class="card__meta">
        <h3 class="card__title"><span>${esc(p.t)}</span></h3>
        <span class="card__price">${p.compare ? `<s>${HC.price(p.compare)}</s>` : ''}${price}</span>
      </div>
      <p class="card__sub">${esc(opts)}</p>
    </a>`;
  };

  /* ---------- cartes collection (défilement horizontal de l'accueil) ---------- */
  document.querySelectorAll('[data-collections]').forEach((el) => {
    const cards = HC.collections.map((c, i) => {
      const img = c.img ? 'assets/img/' + c.img + '.jpg' : HC.photo(HC.product(c.p[0]));
      return `<a class="col-card" href="boutique.html?c=${c.h}" data-cursor="Explorer">
        <div class="col-card__media"><img src="${img}" alt="${esc(HC.colName(c))}" loading="lazy"></div>
        <div class="col-card__meta"><h3 class="col-card__name">${HC.colName(c, true)}</h3><span class="label">0${i + 1}</span></div>
        <p class="col-card__desc">${esc(c.d.split(/[.:!]/)[0])}.</p>
      </a>`;
    }).join('');
    el.innerHTML = cards + `<a class="col-card col-card--end" href="boutique.html" data-cursor="Tout voir">
      <span><span class="label">${HC.products.length} créations</span><span class="h2" style="display:block">Toute la<br><em>boutique</em></span><span class="label">Entrer →</span></span></a>`;
  });

  document.querySelectorAll('[data-products]').forEach((el) => {
    el.innerHTML = el.dataset.products.split(',').map((h) => HC.product(h.trim())).filter(Boolean).map(HC.card).join('');
  });

  /* ---------- accordéons ---------- */
  HC.accordions = (root = document) => root.querySelectorAll('.acc').forEach((acc) => {
    if (acc.dataset.ready) return; acc.dataset.ready = 1;
    const btn = acc.querySelector('.acc__btn');
    const panel = acc.querySelector('.acc__panel');
    btn.setAttribute('aria-expanded', 'false');
    const set = (open) => {
      acc.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      panel.style.height = (open ? panel.scrollHeight : panel.scrollHeight) + 'px';
      if (!open) requestAnimationFrame(() => { panel.style.height = '0px'; });
      else panel.addEventListener('transitionend', function te() { if (acc.classList.contains('is-open')) panel.style.height = 'auto'; panel.removeEventListener('transitionend', te); });
      setTimeout(() => window.ScrollTrigger && ScrollTrigger.refresh(), 750);
    };
    btn.addEventListener('click', () => set(!acc.classList.contains('is-open')));
    if (acc.hasAttribute('data-open')) { acc.classList.add('is-open'); panel.style.height = 'auto'; btn.setAttribute('aria-expanded', 'true'); }
  });

  /* ---------- boutique ---------- */
  const shop = document.querySelector('[data-shop]');
  if (shop) {
    const grid = shop.querySelector('.grid');
    const filters = shop.querySelector('.filters');
    const title = document.querySelector('[data-shop-title]');
    const desc = document.querySelector('[data-shop-desc]');
    const count = document.querySelector('[data-shop-count]');
    const all = { h: '', t: 'Toute la', em: 'boutique', d: 'Fondants, brûle-parfums, bouquets en cire et parfums d’intérieur : chaque création est façonnée à la main, pièce par pièce, dans notre atelier.' };
    const list = (c) => (c.h ? c.p.map(HC.product).filter(Boolean) : HC.products);
    filters.innerHTML = [all, ...HC.collections].map((c) =>
      `<button type="button" data-c="${c.h}">${c.h ? HC.colName(c) : 'Tout'}<sup>${list(c).length}</sup></button>`).join('');

    const render = (h, first) => {
      const c = HC.collection(h) || all;
      filters.querySelectorAll('button').forEach((b) => b.classList.toggle('is-active', b.dataset.c === c.h));
      const items = list(c);
      const swap = () => {
        title.innerHTML = c.h ? (c.t.endsWith('-') ? c.t + '<em>' + c.em + '</em>' : c.t + ' <em>' + c.em + '</em>') : 'Toute la <em>boutique</em>';
        delete title.dataset.splitDone;
        desc.textContent = c.d;
        count.textContent = items.length + (items.length > 1 ? ' créations' : ' création');
        grid.innerHTML = items.map(HC.card).join('');
        if (window.gsap && !first) {
          const words = window.HCsplit(title);
          gsap.fromTo(words, { y: '110%' }, { y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.05 });
          gsap.fromTo(desc, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', delay: 0.15 });
          gsap.fromTo(grid.children, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.06 });
          ScrollTrigger.refresh();
        }
      };
      if (window.gsap && !first) gsap.to([grid.children, desc], { opacity: 0, y: -20, duration: 0.35, ease: 'power2.in', stagger: 0.015, onComplete: swap });
      else swap();
      const u = new URL(location.href);
      c.h ? u.searchParams.set('c', c.h) : u.searchParams.delete('c');
      history.replaceState(null, '', u);
    };
    filters.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      render(b.dataset.c);
      const top = shop.getBoundingClientRect().top + scrollY - 140;
      if (scrollY > top) window.lenis ? window.lenis.scrollTo(top) : scrollTo({ top, behavior: 'smooth' });
    });
    render(qs.get('c') || '', true);
  }

  /* ---------- fiche produit ---------- */
  const pdp = document.querySelector('[data-pdp]');
  if (pdp) {
    const p = HC.product(qs.get('p') || '') || HC.products[0];
    document.title = p.t + ' — Harmony Candles';
    const col = p.collections.length ? HC.collection(p.collections[0]) : null;
    const sel = p.o.map((o) => {
      const v = p.v.find((x) => x[4]) || p.v[0];
      return v[1].split(' / ')[p.o.indexOf(o)] || o[1][0];
    });
    let qty = 1;
    const variant = () => p.v.find((v) => v[1] === (p.o.length ? sel.join(' / ') : 'Default Title')) || p.v[0];
    const isOut = (oi, val) => {
      const test = sel.slice(); test[oi] = val;
      const v = p.v.find((x) => x[1] === test.join(' / '));
      return v && !v[4];
    };

    pdp.innerHTML = `
      <div class="pdp__gallery">
        ${p.img.map((_, i) => `<figure class="pdp__shot" style="margin:0" ${i ? 'data-clip' : ''} data-cursor="${i ? '' : 'Fait main'}"><img src="${HC.photo(p, i, 1400)}" alt="${esc(p.t)} — vue ${i + 1}" ${i ? 'loading="lazy"' : ''}></figure>`).join('')}
      </div>
      <div class="pdp__info">
        <nav class="crumbs" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a><span>/</span><a href="boutique.html${col ? '?c=' + col.h : ''}">${col ? HC.colName(col) : 'Boutique'}</a></nav>
        <p class="label muted">Création artisanale</p>
        <h1 class="h1 pdp__title" data-hero>${esc(p.t)}</h1>
        <p class="pdp__price" data-fade><span data-price></span>${p.compare ? `<s>${HC.price(p.compare)}</s>` : ''}</p>
        <div data-opts></div>
        ${p.custom ? `
          <div class="buy" data-fade><a class="cta" href="${HC.shopUrl(p)}" target="_blank" rel="noopener">Personnaliser sur la boutique <span>→</span></a></div>` : `
          <div class="buy" data-fade>
            <div class="qty"><button type="button" data-q="-1" aria-label="Retirer un">−</button><span data-qty>1</span><button type="button" data-q="1" aria-label="Ajouter un">+</button></div>
            <a class="cta" data-cta href="#">Ajouter au panier <span>→</span></a>
          </div>`}
        <div class="reassure" data-fade><span>Fait main en France</span><span>Parfums de Grasse</span><span>Expédition rapide</span></div>
        <div class="pdp__notes" data-fade>
          <div class="acc" data-open><button class="acc__btn" type="button">Description<i class="acc__icon"></i></button>
            <div class="acc__panel"><div class="acc__body pdp__desc">${(p.d || []).map((t) => `<p>${esc(t)}</p>`).join('')}</div></div></div>
          <div class="acc"><button class="acc__btn" type="button">Utilisation & précautions<i class="acc__icon"></i></button>
            <div class="acc__panel"><div class="acc__body"><p>Utilisez nos créations sur une surface stable et résistante à la chaleur, jamais sans surveillance, hors de portée des enfants et des animaux. Pour les fondants : un brûle-parfum adapté et une bougie chauffe-plat suffisent, sans jamais ajouter d’eau dans la coupelle.</p></div></div></div>
          <div class="acc"><button class="acc__btn" type="button">Livraison & retours<i class="acc__icon"></i></button>
            <div class="acc__panel"><div class="acc__body"><p>Livraison en France métropolitaine, Belgique, Suisse, Allemagne et Luxembourg. Retours acceptés sous 30 jours, articles non utilisés et dans leur emballage d’origine.</p></div></div></div>
        </div>
      </div>`;

    const optsEl = pdp.querySelector('[data-opts]');
    const priceEl = pdp.querySelector('[data-price]');
    const cta = pdp.querySelector('[data-cta]');
    const drawOpts = () => {
      optsEl.innerHTML = p.o.map((o, oi) => o[1].length < 2 && p.v.length < 2 ? '' : `
        <div class="opt"><p class="label opt__label"><span>${esc(o[0])}</span><span>${esc(sel[oi])}</span></p>
          <div class="chips">${o[1].map((val) => `<button type="button" class="chip${val === sel[oi] ? ' is-active' : ''}${isOut(oi, val) ? ' is-out' : ''}" data-oi="${oi}" data-val="${esc(val)}">${esc(val)}</button>`).join('')}</div></div>`).join('');
    };
    const update = () => {
      const v = variant();
      priceEl.textContent = HC.price(v[2]);
      if (cta) {
        cta.classList.toggle('is-disabled', !v[4]);
        cta.firstChild.textContent = v[4] ? 'Ajouter au panier ' : 'Bientôt de retour ';
        cta.href = v[4] ? HC.cartUrl(v[0], qty) : '#';
      }
      const q = pdp.querySelector('[data-qty]');
      if (q) q.textContent = qty;
    };
    drawOpts(); update();
    optsEl.addEventListener('click', (e) => {
      const b = e.target.closest('.chip');
      if (!b) return;
      sel[+b.dataset.oi] = b.dataset.val;
      drawOpts(); update();
    });
    pdp.addEventListener('click', (e) => {
      const b = e.target.closest('[data-q]');
      if (!b) return;
      qty = Math.max(1, Math.min(20, qty + +b.dataset.q));
      update();
    });

    const related = document.querySelector('[data-related]');
    if (related) {
      const pool = (col ? col.p.map(HC.product) : HC.products).filter((x) => x && x.h !== p.h);
      const more = HC.products.filter((x) => x.h !== p.h && !pool.includes(x));
      related.innerHTML = pool.concat(more).slice(0, 4).map(HC.card).join('');
    }
  }

  HC.accordions();

  /* ---------- FAQ : recherche + sommaire actif ---------- */
  const faq = document.querySelector('[data-faq]');
  if (faq) {
    const input = document.querySelector('[data-faq-search]');
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      faq.querySelectorAll('.acc').forEach((a) => { a.hidden = q && !a.textContent.toLowerCase().includes(q); });
      faq.querySelectorAll('.faq__group').forEach((g) => { g.hidden = ![...g.querySelectorAll('.acc')].some((a) => !a.hidden); });
      window.ScrollTrigger && ScrollTrigger.refresh();
    });
    const links = document.querySelectorAll('.faq__nav a');
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id));
    }), { rootMargin: '-40% 0px -55% 0px' });
    faq.querySelectorAll('.faq__group').forEach((g) => io.observe(g));
    links.forEach((l) => l.addEventListener('click', (e) => {
      e.preventDefault();
      const t = document.querySelector(l.getAttribute('href'));
      window.lenis ? window.lenis.scrollTo(t, { offset: -110 }) : t.scrollIntoView({ behavior: 'smooth' });
    }));
  }

  /* ---------- contact : copier l'adresse ---------- */
  document.querySelectorAll('[data-copy]').forEach((el) => el.addEventListener('click', (e) => {
    e.preventDefault();
    const note = el.querySelector('[data-copy-note]');
    const done = () => { if (note) { const t = note.textContent; note.textContent = 'Adresse copiée ✓'; setTimeout(() => { note.textContent = t; }, 1800); } };
    navigator.clipboard ? navigator.clipboard.writeText(el.dataset.copy).then(done, () => { location.href = 'mailto:' + el.dataset.copy; }) : (location.href = 'mailto:' + el.dataset.copy);
  }));
})();
