/* =========================================================
   HARMONY CANDLES — rendu des pages intérieures
   boutique.html · produit.html · faq.html · a-propos.html · contact.html
   ========================================================= */
(function () {
  const HC = window.HC;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const params = new URLSearchParams(location.search);
  const page = document.body.dataset.page;
  const roll = (t) => `<span class="roll"><span class="roll__in" data-text="${esc(t)}">${esc(t)}</span></span>`;

  const tintOf = (p) => (HC.collection(p.collections.find((c) => c !== 'nos-bons-plans') || p.collections[0]) || {}).tint || '#f3dcd4';
  const priceHTML = (p) => {
    if (p.custom) return `<span class="price">dès ${HC.price(0.8)} <small>/ lettre</small></span>`;
    const from = p.min !== p.max ? '<small>dès</small> ' : '';
    const cmp = p.compare ? `<s class="price__old">${HC.price(p.compare)}</s>` : '';
    return `<span class="price">${from}${HC.price(p.min)}</span>${cmp}`;
  };
  const badgeHTML = (p) => {
    if (!p.available) return '<span class="badge badge--out">Épuisé</span>';
    if (p.compare) return `<span class="badge">−${Math.round((1 - p.min / p.compare) * 100)} %</span>`;
    return '';
  };
  // visuel "studio" : détourage flottant sur arche teintée, sinon photo retouchée
  const visualHTML = (p, cls) => {
    const cut = HC.cutout(p);
    return cut
      ? `<img class="${cls}__cut" src="${cut}" alt="${esc(p.t)}" loading="lazy">`
      : `<img class="${cls}__photo" src="${HC.photo(p, 0)}" alt="${esc(p.t)}" loading="lazy">`;
  };
  const cardHTML = (p) => `
    <a class="pcard${p.available ? '' : ' is-out'}" href="produit.html?p=${encodeURIComponent(p.h)}" data-cursor="Voir" data-cols="${p.collections.join(' ')}" data-price="${p.min}">
      <div class="pcard__arch" style="--tint:${tintOf(p)}">${visualHTML(p, 'pcard')}${badgeHTML(p)}</div>
      <div class="pcard__info">
        <h3 class="pcard__title">${esc(p.t)}</h3>
        <p class="pcard__price">${priceHTML(p)}</p>
      </div>
    </a>`;

  /* ================= BOUTIQUE ================= */
  if (page === 'boutique') {
    const c = HC.collection(params.get('c') || '');
    const head = $('[data-shop-head]');
    const grid = $('[data-grid]');
    const chips = $('[data-chips]');
    const titleEl = $('.shop__title');
    const descEl = $('.shop__desc');
    const visual = $('.shop__visual');

    const setHead = (col) => {
      titleEl.innerHTML = col ? HC.colName(col, true) : 'Toute la <em>boutique</em>';
      descEl.textContent = col ? col.d : 'Fondants, brûle-parfums, bouquets, parfums d’intérieur et coffrets : toutes nos créations parfumées, faites main dans notre atelier.';
      visual.style.setProperty('--tint', col ? col.tint : '#f3dcd4');
      visual.innerHTML = col && col.img
        ? `<img src="assets/img/${col.img}.jpg" alt="">`
        : `<div class="shop__visual-type"><span>${col ? 'prix' : 'harmony'}</span><em>${col ? 'doux' : 'candles'}</em></div>`;
      document.title = (col ? HC.colName(col) : 'Boutique') + ' — Harmony Candles';
    };
    setHead(c);

    chips.innerHTML = `<button class="chip${c ? '' : ' is-on'}" data-c="">Tout <sup>${HC.products.length}</sup></button>` +
      HC.collections.map((col) => `<button class="chip${c && c.h === col.h ? ' is-on' : ''}" data-c="${col.h}">${HC.colName(col)} <sup>${col.p.length}</sup></button>`).join('');

    // tous les produits, sans doublon, ordre : catégories puis bons plans
    const ordered = [];
    HC.collections.forEach((col) => col.p.forEach((h) => { const p = HC.product(h); if (p && !ordered.includes(p)) ordered.push(p); }));
    HC.products.forEach((p) => { if (!ordered.includes(p)) ordered.push(p); });
    grid.innerHTML = ordered.map(cardHTML).join('');
    const cards = $$('.pcard', grid);
    const count = $('[data-count]');

    // apparition des cartes au défilement (premier affichage)
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reveal = window.gsap && !reduce ? new IntersectionObserver((entries) => {
      const els = entries.filter((e) => e.isIntersecting).map((e) => e.target);
      els.forEach((el) => reveal.unobserve(el));
      if (els.length) gsap.to(els, { opacity: 1, y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.08, clearProps: 'opacity,transform' });
    }, { rootMargin: '0px 0px -6% 0px' }) : null;

    const apply = (h, sort, initial) => {
      const first = new Map(cards.map((el) => [el, el.getBoundingClientRect()]));
      let shown = cards.filter((el) => !h || el.dataset.cols.split(' ').includes(h));
      if (sort === 'asc') shown.sort((a, b) => a.dataset.price - b.dataset.price);
      if (sort === 'desc') shown.sort((a, b) => b.dataset.price - a.dataset.price);
      cards.forEach((el) => el.classList.toggle('is-hidden', !shown.includes(el)));
      shown.forEach((el) => grid.appendChild(el));
      count.textContent = shown.length + (shown.length > 1 ? ' créations' : ' création');
      if (initial) {
        if (reveal) cards.forEach((el) => { gsap.set(el, { opacity: 0, y: 60 }); reveal.observe(el); });
        return;
      }
      // animation FLIP : chaque carte glisse de son ancienne place à la nouvelle
      if (window.gsap) {
        if (reveal) cards.forEach((el) => reveal.unobserve(el));
        shown.forEach((el, i) => {
          const a = first.get(el), b = el.getBoundingClientRect();
          const wasHidden = a.width === 0;
          if (wasHidden) gsap.fromTo(el, { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.9, delay: i * 0.03, ease: 'expo.out', clearProps: 'all' });
          else gsap.fromTo(el, { x: a.left - b.left, y: a.top - b.top, opacity: 1 }, { x: 0, y: 0, duration: 0.9, ease: 'expo.out', clearProps: 'transform,opacity' });
        });
        if (window.ScrollTrigger) setTimeout(() => ScrollTrigger.refresh(), 950);
      }
    };
    let current = c ? c.h : '';
    let sort = '';
    apply(current, sort, true);
    chips.addEventListener('click', (e) => {
      const b = e.target.closest('.chip');
      if (!b) return;
      current = b.dataset.c;
      $$('.chip', chips).forEach((x) => x.classList.toggle('is-on', x === b));
      setHead(HC.collection(current));
      history.replaceState(null, '', current ? '?c=' + current : location.pathname);
      apply(current, sort);
      // si on est descendu dans la grille, on remonte en douceur à son début
      const top = grid.getBoundingClientRect().top + window.scrollY - 170;
      if (window.scrollY > top) {
        if (window.__lenis) window.__lenis.scrollTo(top, { duration: 1.2 });
        else window.scrollTo({ top, behavior: 'smooth' });
      }
    });
    $('[data-sort]').addEventListener('change', (e) => { sort = e.target.value; apply(current, sort); });
  }

  /* ================= PRODUIT ================= */
  if (page === 'produit') {
    const p = HC.product(params.get('p') || '') || HC.products[0];
    document.title = p.t + ' — Harmony Candles';
    const col = HC.collection(p.collections.find((x) => x !== 'nos-bons-plans') || p.collections[0]);
    const tint = tintOf(p);

    // galerie : vue studio (détourage) + photos retouchées
    const slides = [];
    const cut = HC.cutout(p);
    if (cut) slides.push({ type: 'cut', src: cut });
    p.img.forEach((_, i) => slides.push({ type: 'photo', src: HC.photo(p, i) }));
    const gallery = $('[data-gallery]');
    gallery.style.setProperty('--tint', tint);
    gallery.innerHTML = `
      <div class="gallery__stage">
        ${slides.map((s, i) => `<div class="gallery__slide gallery__slide--${s.type}${i === 0 ? ' is-on' : ''}"><img src="${s.src}" alt="${esc(p.t)}${i ? ' — photo ' + (i + 1) : ''}"></div>`).join('')}
        ${badgeHTML(p)}
      </div>
      ${slides.length > 1 ? `<div class="gallery__thumbs">${slides.map((s, i) => `<button class="gallery__thumb gallery__thumb--${s.type}${i === 0 ? ' is-on' : ''}" data-i="${i}" aria-label="Voir l’image ${i + 1}"><img src="${s.src}" alt=""></button>`).join('')}</div>` : ''}`;
    const show = (i) => {
      $$('.gallery__slide', gallery).forEach((el, j) => el.classList.toggle('is-on', j === i));
      $$('.gallery__thumb', gallery).forEach((el, j) => el.classList.toggle('is-on', j === i));
    };
    gallery.addEventListener('click', (e) => { const t = e.target.closest('.gallery__thumb'); if (t) show(+t.dataset.i); });
    // loupe douce : la photo suit la souris
    const stage = $('.gallery__stage', gallery);
    stage.addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect();
      stage.style.setProperty('--zx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      stage.style.setProperty('--zy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });

    // informations
    $('[data-crumb]').innerHTML = `<a class="link-u" href="boutique.html">Boutique</a><span>/</span>${col ? `<a class="link-u" href="boutique.html?c=${col.h}">${HC.colName(col)}</a><span>/</span>` : ''}<span aria-current="page">${esc(p.t)}</span>`;
    const words = p.t.split(' ');
    const last = words.length > 1 ? words.pop() : '';
    $('.prod__title').innerHTML = `${esc(words.join(' '))} ${last ? `<em>${esc(last)}</em>` : ''}`;
    $('.prod__desc').innerHTML = p.d.map((x) => `<p>${esc(x)}</p>`).join('');

    // options (puces), disponibilité par combinaison
    const opts = $('[data-options]');
    const sel = p.o.map((o) => {
      const firstAvail = p.v.find((v) => v[4]);
      const parts = firstAvail ? firstAvail[1].split(' / ') : [];
      return parts[p.o.indexOf(o)] || o[1][0];
    });
    const findVariant = () => p.v.find((v) => (p.o.length ? v[1] === sel.join(' / ') : true));
    const render = () => {
      opts.innerHTML = p.o.map((o, i) => `
        <fieldset class="opt">
          <legend class="label">${esc(o[0])} <b>${esc(sel[i])}</b></legend>
          <div class="opt__list">${o[1].map((val) => {
            const test = sel.slice(); test[i] = val;
            const v = p.v.find((x) => x[1] === test.join(' / '));
            const ok = v && v[4];
            return `<button type="button" class="opt__pill${val === sel[i] ? ' is-on' : ''}${ok ? '' : ' is-out'}" data-i="${i}" data-val="${esc(val)}" aria-pressed="${val === sel[i]}">${esc(val)}</button>`;
          }).join('')}</div>
        </fieldset>`).join('');
      const v = findVariant();
      const priceBox = $('[data-price]');
      const cmp = v && v[3] > v[2] ? `<s class="price__old">${HC.price(v[3])}</s>` : '';
      priceBox.innerHTML = p.custom ? priceHTML(p) : `<span class="price">${HC.price(v ? v[2] : p.min)}</span>${cmp}`;
      $('[data-sticky-price]').textContent = p.custom ? 'dès 0,80 €' : HC.price(v ? v[2] : p.min);
      const btns = $$('[data-add]');
      const avail = v && v[4];
      btns.forEach((b) => {
        b.disabled = !avail && !p.custom;
        $('.roll__in', b).textContent = p.custom ? 'Personnaliser' : avail ? 'Ajouter au panier' : 'Épuisé';
        $('.roll__in', b).dataset.text = $('.roll__in', b).textContent;
      });
      $('[data-stock]').innerHTML = p.custom
        ? '<span class="dot"></span> Création sur mesure, personnalisée sur la boutique'
        : avail ? '<span class="dot"></span> Disponible — préparé dans notre atelier' : '<span class="dot dot--out"></span> Momentanément épuisé';
    };
    render();
    opts.addEventListener('click', (e) => {
      const b = e.target.closest('.opt__pill');
      if (!b) return;
      sel[+b.dataset.i] = b.dataset.val;
      render();
    });

    // quantité
    let qty = 1;
    const qEl = $('[data-qty]');
    $('[data-minus]').addEventListener('click', () => { qty = Math.max(1, qty - 1); qEl.textContent = qty; });
    $('[data-plus]').addEventListener('click', () => { qty = Math.min(20, qty + 1); qEl.textContent = qty; });

    // ajout au panier : on ouvre le panier de la boutique Shopify avec l'article
    $$('[data-add]').forEach((b) => b.addEventListener('click', () => {
      if (p.custom) { window.location.href = HC.shopUrl(p); return; }
      const v = findVariant();
      if (!v || !v[4]) return;
      b.classList.add('is-adding');
      // petit envol de la photo vers le panier
      const img = $('.gallery__slide.is-on img');
      const cart = $('.nav__cart') || $('.nav__burger');
      if (img && cart && window.gsap) {
        const a = img.getBoundingClientRect(), z = cart.getBoundingClientRect();
        const fly = img.cloneNode();
        fly.className = 'fly';
        Object.assign(fly.style, { left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px' });
        document.body.appendChild(fly);
        gsap.to(fly, { left: z.left + z.width / 2 - 20, top: z.top + z.height / 2 - 20, width: 40, height: 40, opacity: 0.2, borderRadius: '50%', duration: 0.9, ease: 'power3.in', onComplete: () => fly.remove() });
      }
      setTimeout(() => { window.location.href = HC.cartUrl(v[0], qty); }, 950);
    }));

    // conseils selon le type de produit
    const TIPS = {
      spray: ['Déverrouillez le bouton de sécurité et agitez légèrement avant usage.', 'Vaporisez à 30 cm des tissus, rideaux, coussins ou dans l’air.', 'Conservez à l’abri de la lumière et du soleil.', 'Ne pas ingérer, éviter les vêtements et la peau, tenir hors de portée des enfants.'],
      burner: ['Déposez un fondant parfumé dans la coupelle de votre brûle-parfum.', 'Placez une bougie chauffe-plat à l’intérieur et allumez-la.', 'Le fondant fond et diffuse délicatement son parfum.', 'Ne jamais ajouter d’eau dans la coupelle ; ne pas laisser brûler sans surveillance.'],
      fondant: ['Déposez le fondant dans la coupelle d’un brûle-parfum adapté.', 'Allumez une bougie chauffe-plat sous la coupelle : la cire fond et libère son parfum.', 'Une fois le parfum dissipé, laissez refroidir et retirez la cire.', 'Un fondant s’utilise plusieurs fois, jusqu’à ce qu’il ne diffuse plus de parfum.'],
      candle: ['Conservez-la comme élément décoratif, ou allumez-la pour une ambiance apaisante.', 'Posez la bougie sur un support résistant à la chaleur avant de l’allumer.', 'Ne laissez jamais une bougie allumée sans surveillance.'],
      car: ['Dévissez le bouchon en bois et laissez le parfum imprégner le bouchon.', 'Suspendez le diffuseur à votre rétroviseur.', 'Profitez d’une senteur délicate pendant plusieurs semaines.'],
      powder: ['Saupoudrez légèrement sur le sol ou le tapis.', 'Passez l’aspirateur : il diffuse un doux parfum dans toute la maison.', 'Idéale aussi dans les tiroirs, placards et petits espaces.'],
    };
    const kind = p.collections.includes('parfums-dinterieurs') ? 'spray'
      : /^brule-parfum/.test(p.h) ? 'burner'
      : /ecrin|citrouilles/.test(p.h) ? 'candle'
      : p.h === 'diffuseurs-voitures' ? 'car'
      : p.h === 'poudre-parfumee' ? 'powder'
      : (p.collections.some((c) => ['fondants-parfumes', 'bouquets-de-fleurs'].includes(c)) || /coeurs|fondants|halloween|sans-titre|option-set|ted|feerie/.test(p.h)) ? 'fondant'
      : null;
    if (kind) $('[data-tips]').innerHTML = '<ol>' + TIPS[kind].map((t) => `<li>${esc(t)}</li>`).join('') + '</ol>';
    else $('[data-tips]').closest('details').remove();

    // produits associés
    const related = HC.products.filter((x) => x !== p && x.collections.some((c) => p.collections.includes(c) && c !== 'nos-bons-plans'));
    const more = HC.products.filter((x) => x !== p && !related.includes(x) && x.available);
    $('[data-related]').innerHTML = related.concat(more).slice(0, 4).map(cardHTML).join('');

    // barre d'achat collante (mobile) : apparaît quand le bouton principal sort de l'écran
    const sticky = $('.sticky-buy');
    $('.sticky-buy__title').textContent = p.t;
    const buy = $('.prod__buy');
    const relatedSection = $('.related');
    const checkSticky = () => {
      const passed = buy.getBoundingClientRect().bottom < 0;
      const atEnd = relatedSection.getBoundingClientRect().top < window.innerHeight * 0.6;
      sticky.classList.toggle('is-on', passed && !atEnd);
    };
    window.addEventListener('scroll', checkSticky, { passive: true });
    checkSticky();
  }

  /* ================= FAQ ================= */
  if (page === 'faq') {
    const list = $$('.faq__item');
    // accordéons à hauteur animée
    list.forEach((item) => {
      const btn = $('.faq__q', item), body = $('.faq__a', item);
      btn.addEventListener('click', () => {
        const open = item.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open);
        body.style.height = open ? body.scrollHeight + 'px' : '0px';
        if (window.ScrollTrigger) setTimeout(() => ScrollTrigger.refresh(), 650);
      });
    });
    // recherche instantanée
    const input = $('[data-faq-search]');
    const empty = $('.faq__empty');
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
      let n = 0;
      list.forEach((item) => {
        const txt = item.textContent.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
        const ok = !q || txt.includes(q);
        item.hidden = !ok;
        if (ok) n++;
      });
      $$('.faq__group').forEach((g) => { g.hidden = !$$('.faq__item', g).some((i) => !i.hidden); });
      empty.hidden = n > 0;
    });
    // navigation par thème : le thème visible est surligné
    const tabs = $$('.faq__tab');
    const groups = $$('.faq__group');
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) tabs.forEach((t) => t.classList.toggle('is-on', t.getAttribute('href') === '#' + e.target.id));
    }), { rootMargin: '-40% 0px -55% 0px' });
    groups.forEach((g) => io.observe(g));
  }

  /* ================= CONTACT ================= */
  if (page === 'contact') {
    // champs à étiquette flottante
    $$('.field input, .field textarea').forEach((el) => {
      const set = () => el.parentElement.classList.toggle('is-filled', !!el.value);
      el.addEventListener('input', set);
      set();
    });
    // copier l'adresse e-mail
    const copy = $('[data-copy]');
    if (copy) copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(copy.dataset.copy); copy.classList.add('is-copied'); setTimeout(() => copy.classList.remove('is-copied'), 1800); } catch (e) { /* presse-papiers indisponible */ }
    });
  }
})();
