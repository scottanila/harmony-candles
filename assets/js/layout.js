/* =========================================================
   HARMONY CANDLES — en-tête, menus, pied de page, curseur,
   rideau de transition et bandeau cookies (communs à toutes les pages)
   ========================================================= */
(function () {
  const HC = window.HC;
  const SHOP = HC.SHOP;
  const page = document.body.dataset.page || '';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const roll = (t) => `<span class="roll"><span class="roll__in" data-text="${t}">${t}</span></span>`;
  const letters = (t) => [...t].map((c) => `<span>${c === ' ' ? '&nbsp;' : c}</span>`).join('');
  const colImg = (c) => (c.img ? 'assets/img/' + c.img + '.jpg' : HC.photo(HC.product(c.p[0])));

  /* ---------- en-tête ---------- */
  const header = `
  <div class="cursor" aria-hidden="true"><div class="cursor__ring"><span class="cursor__label"></span></div><div class="cursor__dot"></div></div>
  <div class="announce" aria-live="off">
    <div class="announce__track">
      <span>Créations parfumées, faites main en France</span>
      <span>Parfums de Grasse · Cire 100 % végétale</span>
      <span>Expédition rapide depuis notre atelier</span>
      <span>Créations parfumées, faites main en France</span>
    </div>
  </div>
  <header class="header" id="top">
    <div class="header__left">
      <button class="header__menu" type="button" aria-expanded="false" aria-controls="menu"><i class="burger"></i>${roll('Menu')}</button>
      <a class="header__shop hide-sm" href="boutique.html" aria-haspopup="true">${roll('Boutique')}<span class="caret">▼</span></a>
    </div>
    <a class="wordmark" href="index.html" aria-label="Harmony Candles — accueil">${letters('Harmony')}&nbsp;&nbsp;${letters('Candles')}</a>
    <div class="header__right">
      <a class="hide-sm" href="faq.html">${roll('Aide')}</a>
      <a class="bag" href="${SHOP}/cart" aria-label="Panier">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>
        <span class="hide-sm">${roll('Panier')}</span>
      </a>
    </div>
  </header>
  <div class="mega" aria-hidden="true">
    <div class="mega__grid">
      <nav class="mega__list" aria-label="Collections">
        ${HC.collections.slice(0, 4).map((c, i) => `<a href="boutique.html?c=${c.h}" data-img="${colImg(c)}" style="transition-delay:${0.15 + i * 0.05}s"><small>0${i + 1}</small>${HC.colName(c)}</a>`).join('')}
      </nav>
      <nav class="mega__list" aria-label="Collections (suite)">
        ${HC.collections.slice(4).map((c, i) => `<a href="boutique.html?c=${c.h}" data-img="${colImg(c)}" style="transition-delay:${0.35 + i * 0.05}s"><small>0${i + 5}</small>${HC.colName(c)}</a>`).join('')}
      </nav>
      <div class="mega__media">${HC.collections.map((c, i) => `<img src="${colImg(c)}" alt="" loading="lazy"${i === 0 ? ' class="is-on"' : ''}>`).join('')}</div>
    </div>
  </div>
  <div class="menu" id="menu" aria-hidden="true">
    <button class="menu__close" type="button"><i></i>${roll('Fermer')}</button>
    <div class="menu__nav">
      <nav class="menu__links" aria-label="Navigation principale">
        <a href="index.html" data-i="0"><small>01</small><span>Accueil</span></a>
        <a href="boutique.html" data-i="1"><small>02</small><span>La <em>boutique</em></span></a>
        <a href="a-propos.html" data-i="2"><small>03</small><span>L’<em>atelier</em></span></a>
        <a href="faq.html" data-i="3"><small>04</small><span>Questions</span></a>
        <a href="contact.html" data-i="4"><small>05</small><span>Contact</span></a>
      </nav>
      <div class="menu__foot">
        <a class="link" href="${SHOP}/cart">Panier</a>
        <a class="link" href="${SHOP}/account">Mon compte</a>
        <a class="link" href="${SHOP}/apps/17TRACK">Suivre ma commande</a>
      </div>
    </div>
    <div class="menu__media">
      <img src="assets/img/hero.jpg" alt="" class="is-on">
      <img src="assets/img/coffrets.jpg" alt="">
      <img src="assets/img/about.jpg" alt="">
      <img src="assets/img/fondants.jpg" alt="">
      <img src="assets/img/brules-parfums.jpg" alt="">
    </div>
  </div>`;

  /* ---------- pied de page ---------- */
  const footer = `
  <footer class="footer">
    <div class="wrap wrap--wide">
      <div class="news">
        <div>
          <p class="label">Newsletter</p>
          <h2 class="h1" data-split>Restons <em>en douceur</em></h2>
        </div>
        <form class="news__form" action="${SHOP}/contact#contact_form" method="post" accept-charset="UTF-8" data-reveal>
          <input type="hidden" name="form_type" value="customer">
          <input type="hidden" name="utf8" value="✓">
          <input type="hidden" name="contact[tags]" value="newsletter">
          <p class="muted" style="font-size:13px">Nouveautés, éditions limitées et petites attentions, de temps en temps.</p>
          <div class="field">
            <label class="sr-only" for="news-email">Adresse e-mail</label>
            <input id="news-email" type="email" name="contact[email]" placeholder="Votre adresse e-mail" autocomplete="email" required>
            <button type="submit" class="link">S’inscrire <span class="arr">→</span></button>
          </div>
        </form>
      </div>
      <div class="footer__cols">
        <div><p class="label">Boutique</p>${HC.collections.map((c) => `<a class="ulink" href="boutique.html?c=${c.h}">${HC.colName(c)}</a>`).join('')}</div>
        <div><p class="label">Aide</p>
          <a class="ulink" href="faq.html">Questions fréquentes</a>
          <a class="ulink" href="${SHOP}/apps/17TRACK">Suivi de colis</a>
          <a class="ulink" href="contact.html">Contact</a>
          <a class="ulink" href="produit.html?p=cartes-cadeaux">Cartes cadeaux</a>
        </div>
        <div><p class="label">Maison</p>
          <a class="ulink" href="a-propos.html">L’atelier</a>
          <a class="ulink" href="${SHOP}/account">Mon compte</a>
          <a class="ulink" href="${SHOP}/cart">Panier</a>
        </div>
        <div><p class="label">Informations</p>
          <a class="ulink" href="${SHOP}/policies/terms-of-sale">Conditions de vente</a>
          <a class="ulink" href="${SHOP}/policies/refund-policy">Remboursement</a>
          <a class="ulink" href="${SHOP}/policies/privacy-policy">Confidentialité</a>
          <a class="ulink" href="${SHOP}/policies/legal-notice">Mentions légales</a>
        </div>
      </div>
    </div>
    <div class="footer__mark" aria-hidden="true">${letters('Harmony')}</div>
    <div class="footer__bottom">
      <span>© 2026 Harmony Candles — Créations artisanales</span>
      <span>Apple Pay · Bancontact · CB · Google Pay · Klarna · Mastercard · Visa</span>
      <a class="ulink" href="#top" data-top>Retour en haut ↑</a>
    </div>
  </footer>
  <div class="cookies" role="region" aria-label="Cookies">
    <p>Nous utilisons des cookies pour faire fonctionner la boutique et mesurer sa fréquentation.</p>
    <div class="cookies__actions"><button class="link" data-cookie="0">Refuser</button><button class="link" data-cookie="1">OK</button></div>
  </div>`;

  const h = document.querySelector('[data-layout="header"]');
  const f = document.querySelector('[data-layout="footer"]');
  if (h) h.outerHTML = header;
  if (f) f.outerHTML = footer;
  if (page) document.querySelectorAll(`.menu__links a[href="${page}.html"]`).forEach((a) => a.setAttribute('aria-current', 'page'));

  /* ---------- bandeau d'annonce qui tourne ---------- */
  const track = document.querySelector('.announce__track');
  if (track && !reduce) {
    let i = 0;
    setInterval(() => {
      i++;
      track.style.transition = '';
      track.style.transform = `translateY(${-30 * i}px)`;
      if (i === 3) setTimeout(() => { track.style.transition = 'none'; track.style.transform = 'translateY(0)'; i = 0; }, 950);
    }, 3800);
  }

  /* ---------- en-tête : opaque après le haut de page, masqué en descendant ---------- */
  const hd = document.querySelector('.header');
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    hd.classList.toggle('is-solid', y > 40);
    const open = document.documentElement.classList.contains('menu-open') || mega.classList.contains('is-open');
    hd.classList.toggle('is-hidden', !open && y > 500 && y > lastY + 2);
    if (y < lastY - 2) hd.classList.remove('is-hidden');
    lastY = y;
  };

  /* ---------- méga-menu boutique (survol) ---------- */
  const mega = document.querySelector('.mega');
  const shop = document.querySelector('.header__shop');
  let megaT;
  const megaOpen = (v) => {
    clearTimeout(megaT);
    if (!v) { megaT = setTimeout(() => { mega.classList.remove('is-open'); shop.classList.remove('is-open'); mega.setAttribute('aria-hidden', 'true'); }, 180); return; }
    mega.classList.add('is-open'); shop.classList.add('is-open'); mega.setAttribute('aria-hidden', 'false');
  };
  if (matchMedia('(hover: hover)').matches) {
    [shop, mega].forEach((el) => {
      el.addEventListener('mouseenter', () => megaOpen(true));
      el.addEventListener('mouseleave', () => megaOpen(false));
    });
  }
  const megaImgs = mega.querySelectorAll('.mega__media img');
  mega.querySelectorAll('.mega__list a').forEach((a, i) => a.addEventListener('mouseenter', () => {
    megaImgs.forEach((im, j) => im.classList.toggle('is-on', j === i));
  }));

  /* ---------- menu plein écran ---------- */
  const menu = document.getElementById('menu');
  const menuBtn = document.querySelector('.header__menu');
  const setMenu = (v) => {
    menu.classList.toggle('is-open', v);
    menu.setAttribute('aria-hidden', String(!v));
    menuBtn.setAttribute('aria-expanded', String(v));
    document.documentElement.classList.toggle('menu-open', v);
    if (window.lenis) v ? window.lenis.stop() : window.lenis.start();
    menu.querySelectorAll('.menu__links a > span').forEach((s, i) => { s.style.transitionDelay = v ? 0.35 + i * 0.06 + 's' : '0s'; });
  };
  menuBtn.addEventListener('click', () => setMenu(true));
  menu.querySelector('.menu__close').addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { setMenu(false); megaOpen(false); } });
  const menuImgs = menu.querySelectorAll('.menu__media img');
  menu.querySelectorAll('.menu__links a').forEach((a) => a.addEventListener('mouseenter', () => {
    const i = +a.dataset.i;
    menuImgs.forEach((im, j) => im.classList.toggle('is-on', j === i));
  }));

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- curseur ---------- */
  const cursor = document.querySelector('.cursor');
  if (matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce) {
    document.documentElement.classList.add('has-cursor');
    const label = cursor.querySelector('.cursor__label');
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
    document.addEventListener('mouseleave', () => cursor.classList.add('is-hidden'));
    document.addEventListener('mouseenter', () => cursor.classList.remove('is-hidden'));
    const loop = () => {
      cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener('mouseover', (e) => {
      const lab = e.target.closest('[data-cursor]');
      const lnk = e.target.closest('a, button, input, textarea, label, select');
      cursor.classList.toggle('is-label', !!lab);
      cursor.classList.toggle('is-link', !lab && !!lnk);
      if (lab) label.textContent = lab.dataset.cursor;
    });
  }

  /* ---------- rideau de transition entre les pages ---------- */
  const curtain = document.createElement('div');
  curtain.className = 'curtain';
  curtain.setAttribute('aria-hidden', 'true');
  curtain.innerHTML = '<span class="curtain__mark">Harmony&nbsp;&nbsp;Candles</span>';
  document.body.appendChild(curtain);
  if (!document.querySelector('.loader') && !reduce) {
    curtain.classList.add('is-covering');
    requestAnimationFrame(() => requestAnimationFrame(() => curtain.classList.replace('is-covering', 'is-lifting')));
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    if (a.hasAttribute('data-top')) {
      e.preventDefault();
      window.lenis ? window.lenis.scrollTo(0, { duration: 2 }) : scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (reduce || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    const href = a.getAttribute('href');
    if (!/^[a-z-]+\.html/i.test(href)) return;
    e.preventDefault();
    curtain.className = 'curtain is-leaving';
    setTimeout(() => { window.location.href = href; }, 750);
  });
  addEventListener('pageshow', (e) => { if (e.persisted) curtain.className = 'curtain'; });

  /* ---------- cookies ---------- */
  const ck = document.querySelector('.cookies');
  let seen = null;
  try { seen = localStorage.getItem('hc-cookies'); } catch (e) { /* stockage indisponible */ }
  if (!seen) setTimeout(() => ck.classList.add('is-on'), 3200);
  ck.addEventListener('click', (e) => {
    const b = e.target.closest('[data-cookie]');
    if (!b) return;
    try { localStorage.setItem('hc-cookies', b.dataset.cookie); } catch (err) { /* ignore */ }
    ck.classList.remove('is-on');
  });
})();
