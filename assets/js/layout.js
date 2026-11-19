/* =========================================================
   HARMONY CANDLES — éléments communs aux pages intérieures
   (navigation, menu mobile, pied de page, curseur, transitions)
   ========================================================= */
(function () {
  const SHOP = 'https://harmonycandles.fr';
  const page = document.body.dataset.page || '';
  const roll = (t) => `<span class="roll"><span class="roll__in" data-text="${t}">${t}</span></span>`;
  const link = (href, label, key) =>
    `<a href="${href}" class="nav__link${page === key ? ' is-active' : ''}"${page === key ? ' aria-current="page"' : ''}>${roll(label)}</a>`;

  const header = `
  <div class="cursor" aria-hidden="true"><div class="cursor__ring"><span class="cursor__label"></span></div><div class="cursor__dot"></div></div>
  <div class="glow" aria-hidden="true"></div>
  <div class="grain" aria-hidden="true"></div>
  <header class="nav">
    <a href="index.html" class="nav__logo" aria-label="Harmony Candles — accueil">
      <span class="nav__mono" aria-hidden="true"></span>
      <span class="nav__name">Harmony <em>Candles</em></span>
    </a>
    <nav class="nav__links" aria-label="Navigation principale">
      ${link('boutique.html', 'Boutique', 'boutique')}
      ${link('a-propos.html', 'L’atelier', 'a-propos')}
      ${link('faq.html', 'FAQ', 'faq')}
      ${link('contact.html', 'Contact', 'contact')}
    </nav>
    <a class="btn-pill btn-pill--sm nav__cart" href="${SHOP}/cart" data-magnetic>${roll('Panier')}</a>
    <button class="btn-ghost btn-ghost--sm nav__burger" type="button" aria-expanded="false" aria-controls="menu">${roll('Menu')}</button>
  </header>
  <div class="menu" id="menu" aria-hidden="true">
    <nav class="menu__links">
      <a href="index.html"><span>01</span>Accueil</a>
      <a href="boutique.html"><span>02</span>Boutique</a>
      <a href="a-propos.html"><span>03</span>L’atelier</a>
      <a href="faq.html"><span>04</span>FAQ</a>
      <a href="contact.html"><span>05</span>Contact</a>
      <a href="${SHOP}/cart"><span>06</span>Panier</a>
    </nav>
    <p class="menu__foot label">Transformez votre intérieur en cocon parfumé</p>
  </div>`;

  const cols = (window.HC ? window.HC.collections : []).map((c) =>
    `<a class="link-u" href="boutique.html?c=${c.h}">${window.HC.colName(c)}</a>`).join('');

  const footer = `
  <footer class="footer" id="contact-footer">
    <div class="news" data-reveal>
      <div class="news__text">
        <p class="label">Newsletter</p>
        <h2 class="news__title">Restons <em>en douceur</em></h2>
        <p class="lead">Abonnez-vous pour ne manquer aucune promotion, aucune nouveauté.</p>
      </div>
      <form class="news__form" action="${SHOP}/contact#contact_form" method="post" accept-charset="UTF-8">
        <input type="hidden" name="form_type" value="customer">
        <input type="hidden" name="utf8" value="✓">
        <input type="hidden" name="contact[tags]" value="newsletter">
        <label class="sr-only" for="news-email">Adresse e-mail</label>
        <input id="news-email" type="email" name="contact[email]" placeholder="Votre adresse e-mail" autocomplete="email" required>
        <button type="submit" class="btn-pill" data-magnetic>${roll('S’inscrire')}</button>
      </form>
    </div>
    <div class="footer__cols">
      <div><p class="label">Boutique</p>${cols}<a class="link-u" href="produit.html?p=cartes-cadeaux">Cartes cadeaux</a></div>
      <div><p class="label">Aide</p>
        <a class="link-u" href="faq.html">FAQ</a>
        <a class="link-u" href="${SHOP}/apps/17TRACK">Suivi colis</a>
        <a class="link-u" href="a-propos.html">À propos</a>
        <a class="link-u" href="contact.html">Contact</a>
      </div>
      <div><p class="label">Informations</p>
        <a class="link-u" href="${SHOP}/policies/terms-of-sale">Conditions de vente</a>
        <a class="link-u" href="${SHOP}/policies/refund-policy">Remboursement</a>
        <a class="link-u" href="${SHOP}/policies/privacy-policy">Confidentialité</a>
        <a class="link-u" href="${SHOP}/policies/legal-notice">Mentions légales</a>
      </div>
    </div>
    <div class="footer__mark" aria-hidden="true"><span>H</span><span>a</span><span>r</span><span>m</span><span>o</span><span>n</span><span>y</span></div>
    <div class="footer__bottom">
      <span class="label">© 2026 Harmony Candles — Créations artisanales</span>
      <span class="legal">Apple Pay · Bancontact · Cartes Bancaires · EPS · Google Pay · Klarna · Mastercard · Visa</span>
      <a class="link-u label" href="#top">Retour en haut ↑</a>
    </div>
  </footer>`;

  const h = document.querySelector('[data-layout="header"]');
  const f = document.querySelector('[data-layout="footer"]');
  if (h) h.outerHTML = header;
  if (f) f.outerHTML = footer;

  /* ---------- Transition entre les pages (rideau rosé) ---------- */
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const curtain = document.createElement('div');
  curtain.className = 'curtain';
  curtain.setAttribute('aria-hidden', 'true');
  curtain.innerHTML = '<span class="curtain__mark"></span>';
  document.body.appendChild(curtain);
  // à l'arrivée sur une page intérieure, le rideau se lève
  if (!document.querySelector('.loader') && !reduce) {
    curtain.classList.add('is-covering');
    requestAnimationFrame(() => requestAnimationFrame(() => curtain.classList.replace('is-covering', 'is-lifting')));
  }
  // au départ vers une autre page du site, il descend
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || reduce || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    const href = a.getAttribute('href');
    if (!/^[a-z-]+\.html/i.test(href)) return; // uniquement les pages locales du site
    e.preventDefault();
    curtain.classList.remove('is-lifting', 'is-covering');
    curtain.classList.add('is-leaving');
    setTimeout(() => { window.location.href = href; }, 650);
  });
  // retour arrière depuis le cache du navigateur : on retire le rideau
  window.addEventListener('pageshow', (e) => { if (e.persisted) curtain.className = 'curtain'; });
})();
