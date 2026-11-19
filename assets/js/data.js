/* =========================================================
   HARMONY CANDLES — catalogue (extrait de harmonycandles.fr le 20/11/2026)
   v : [id variante Shopify, titre, prix, prix barré (0 = aucun), disponible (1/0)]
   img : fichiers du CDN Shopify de la boutique
   ========================================================= */
(function () {
  const CDN = 'https://cdn.shopify.com/s/files/1/0871/9512/4053/files/';
  const SHOP = 'https://harmonycandles.fr';

  // Pot de cœurs : 5 couleurs × 9 parfums, identifiants consécutifs
  const coeursCouleurs = ['Rose', 'Blanc', 'Bleu', 'Vert', 'Jaune'];
  const coeursParfums = ['🌼 Fleur des îles', '🍿 Pop Corn', '🧁 Macaron Vanille', '🍪 Cookies Chocolat', '☁️ Doux Rêves', '💗 Barbe à Papa', '🧼 Adoucissant', '🍑 Monoï Pêche', '☁️ Fleur de Coton'];
  const coeursVariants = [];
  coeursCouleurs.forEach((c, i) => coeursParfums.forEach((p, j) => {
    coeursVariants.push([49858010808661 + (i * 9 + j) * 32768, c + ' / ' + p, 14.9, 0, 1]);
  }));

  const products = [
    { h: 'pot-de-coeurs-fondants', t: 'Pot de Cœurs Fondants',
      d: ['Découvrez notre pot de 10 petits cœurs fondants, parfaits pour parfumer votre intérieur et créer une ambiance chaleureuse. Choisissez votre parfum préféré parmi notre sélection et profitez d’une expérience unique.', 'Ces cœurs fondants fondent lentement pour libérer une senteur agréable et longue durée, apportant une touche de douceur à votre quotidien.', 'Une idée cadeau idéale ou simplement un plaisir à s’offrir, ce pot de cœurs fondants ajoutera une note parfumée et délicate à votre espace. ✨'],
      o: [['Couleur', coeursCouleurs], ['Parfum', coeursParfums]], v: coeursVariants,
      img: ['EA2F8B80-6404-4772-866D-44B2BB24B336.png'] },
    { h: 'coffret-avec-bruleur-ted', t: 'Coffret Découverte avec Brûleur TED',
      d: ['Offrez-vous ou à vos proches une expérience sensorielle unique avec notre Coffret Découverte, idéal pour découvrir et apprécier nos parfums exclusifs.', 'Contenu du coffret :', '• Brûleur TED : élégant et pratique, parfait pour diffuser vos fondants parfumés.', '• 3 chauffe-plats : inclus pour vous permettre d’utiliser immédiatement votre brûleur.', '• Une spirale parfumée (parfum au choix).', '• Une tablette parfumée (parfum au choix).', 'Ce coffret est idéal pour ceux qui n’ont pas encore de brûleur ou qui souhaitent explorer de nouvelles senteurs. C’est aussi un cadeau parfait pour partager l’univers chaleureux de nos créations. 🎀✨'],
      o: [], v: [[49857995768149, 'Default Title', 30.9, 0, 1]], img: ['B4BFB4FB-984C-45A6-9B56-6CF94AE1DB62.png'] },
    { h: 'ecrin-de-roses-🌹', t: 'Écrin de Roses',
      d: ['Plongez dans un univers de douceur avec cet Écrin de Roses, un coffret élégant réunissant 3 bougies sculpturales en forme de roses, sublimées par de fines paillettes dorées.', '💐 Un coffret raffiné : chaque rose est minutieusement coulée et agrémentée de paillettes dorées pour une finition lumineuse et élégante.', '🕯 Un instant de douceur et de lumière : ces bougies peuvent être conservées comme élément décoratif ou allumées sur un support résistant à la chaleur.', '🎁 Le cadeau parfait : présenté dans un écrin élégant, idéal pour offrir… ou se faire plaisir.'],
      o: [['Parfums', ['☁️ Fleur de Coton']]], v: [[50284604129621, '☁️ Fleur de Coton', 12.9, 0, 1]], img: ['457699E4-EB97-4477-9997-012E15D13A02.png'] },
    { h: 'coffret-de-fondants-parfumes', t: 'Coffret de Fondants Parfumés',
      d: ['🎁 Coffret Cadeau – Douceurs Parfumées', 'Découvrez notre joli coffret parfumé, idéal pour faire plaisir à un proche ou simplement se faire plaisir ! 🎀', 'Présenté dans une jolie boîte cadeau accompagnée de son ruban, ce coffret contient :', '🌸 2 tablettes de fondants parfumés', '🕯️ 3 spirales parfumées', '💕 Personnalisez votre coffret : choisissez les parfums de vos deux tablettes et de vos trois spirales parmi les senteurs de la boutique.', 'Chaque création étant réalisée à la main, de légères variations de couleurs et de finitions peuvent exister. 🤍'],
      o: [], v: [[49814087532885, 'Default Title', 20.9, 0, 1]], img: ['821B4DEF-0FB0-4EDA-827A-0049B5264182.jpg'] },
    { h: 'bouquet-de-fleurs-xl-bleu-et-blanc', t: 'Bouquet de Fleurs XL – Bleu et Blanc',
      d: ['Apportez une touche de douceur et d’élégance à votre intérieur avec notre magnifique bouquet de fleurs XL en cire parfumée, entièrement réalisé à la main avec amour.', 'Composé de délicates roses aux nuances de blanc, bleu clair et bleu, accompagnées de jolies fleurs séchées, ce bouquet généreux est parfait pour sublimer votre décoration ou faire plaisir à un proche. 🎁', '🕯️ Un bouquet 2 en 1 : en plus d’être une jolie décoration qui ne fane jamais, chaque fleur peut être retirée de sa tige, cassée en morceaux et fondue dans un brûle-parfum.', 'Chaque bouquet étant réalisé à la main, de légères variations peuvent exister.'],
      o: [['Parfum', ['☁️ Fleur de Coton', '🧁 Macaron Vanille', '🩵 Doux Rêves']]],
      v: [[55845309120853, '☁️ Fleur de Coton', 49.9, 0, 0], [55845373870421, '🧁 Macaron Vanille', 49.9, 0, 0], [55845373903189, '🩵 Doux Rêves', 49.9, 0, 1]],
      img: ['BBA8FBD8-2D5D-4F8E-8CFE-BBE4F21E4D3C.png'] },
    { h: 'bouquet-de-fleurs-roses', t: 'Bouquet de Fleurs – Rose et Blanc',
      d: ['Apportez une touche de douceur et d’élégance à votre intérieur avec notre magnifique bouquet de fleurs en cire parfumée, entièrement réalisé à la main avec amour.', 'Composé de délicates roses aux nuances de rose et de blanc, accompagnées de jolies fleurs séchées. 🎁', '🕯️ Un bouquet 2 en 1 : une jolie décoration qui ne fane jamais, dont chaque fleur peut être fondue dans un brûle-parfum pour diffuser son parfum.', 'Chaque bouquet étant réalisé à la main, de légères variations peuvent exister. 🩷'],
      o: [['Parfums', ['☁️ Fleur de Coton', '🧁 Macaron Vanille', '🩵 Doux Rêves']]],
      v: [[55625215902037, '☁️ Fleur de Coton', 39.9, 0, 1], [55625215934805, '🧁 Macaron Vanille', 39.9, 0, 1], [55625215967573, '🩵 Doux Rêves', 39.9, 0, 1]],
      img: ['FullSizeRender_8d0fd5f5-50e0-4bee-9b3e-ae8adfa1c12a.jpg'] },
    { h: 'fondants', t: 'Fondants Personnalisés', custom: true,
      d: ['🎀 Une création unique, à votre image', 'Un prénom, un mot doux ou une jolie combinaison… Créez vos fondants parfumés personnalisés selon vos envies ! Entièrement réalisés à la main.', '💌 Lettres, chiffres et symboles au choix · 🎨 Jusqu’à 2 couleurs · 🌷 Parfum au choix', '0,80 € par lettre, chiffre ou symbole — 15 caractères maximum.', '🕯️ Utilisation : déposez vos fondants dans un brûle-parfum adapté pour profiter de leur délicieuse senteur.'],
      o: [], v: [[55498542907733, 'Default Title', 0.8, 0, 1]], img: ['8436C7DE-624B-43B6-87E8-ABC58DD3A342.jpg'] },
    { h: 'bouquets-de-fleurs-marron', t: 'Bouquet de Fleurs Marron',
      d: ['Apportez une touche de douceur et d’élégance à votre intérieur avec notre magnifique bouquet de fleurs en cire parfumée, entièrement réalisé à la main avec amour.', 'Composé de délicates roses aux nuances de blanc, crème et marron, accompagnées de jolies fleurs séchées. 🎁', '🕯️ Un bouquet 2 en 1 : une jolie décoration qui ne fane jamais, dont chaque fleur peut être fondue dans un brûle-parfum pour diffuser son parfum.', 'Chaque bouquet étant réalisé à la main, de légères variations peuvent exister. 🤎'],
      o: [['Parfum', ['☁️ Fleur de Coton', '🧁 Macaron Vanille']]],
      v: [[55399812759893, '☁️ Fleur de Coton', 39.9, 0, 1], [55399812792661, '🧁 Macaron Vanille', 39.9, 0, 1]], img: ['IMG-0804.png'] },
    { h: 'option-set-1258134-checkbox-2', t: 'Calendrier Signature',
      d: ['Plongez dans l’univers complet et raffiné d’Harmony Candles avec le Calendrier Signature 🕯️✨', 'Derrière ses 24 coffrets se cachent des créations variées, alliant fondants parfumés et produits exclusifs aux formats plus généreux, soigneusement faits à la main.', 'Une version plus complète et haut de gamme du calendrier de l’Avent, pour (s’)offrir un vrai moment de douceur tout au long du mois de décembre.', '🎀 Fabrication artisanale & française · 💌 Parfums sucrés, boisés, fleuris & inédits · 📦 Quantité très limitée'],
      o: [], v: [[51696744497493, 'Default Title', 59.9, 89.9, 0]],
      img: ['662363E8-23DE-48B7-B0BC-C75B5D372EDE.jpg', '0EB03F74-BC7F-4D2D-8B79-F31B7FF9CA24.jpg', '248BD0BB-E513-4D54-80F5-7651C73A4033.jpg'] },
    { h: 'brule-parfum-bubble', t: 'Brûle-Parfum Bubble',
      d: ['Découvrez le brûle-parfum BUBBLE, une pièce au design unique et texturé qui attire tous les regards. Avec son allure inspirée de petites bulles, il apporte une touche originale et moderne à votre intérieur.', 'Idéal pour diffuser vos cires parfumées, c’est à la fois un bel objet de décoration et un créateur d’ambiance.'],
      o: [], v: [[49786422690133, 'Default Title', 18.9, 0, 0]], img: ['671CB5CD-F440-49C0-84D9-9EF4A9CDF795.jpg', 'B9773491-7403-4D8E-AFB8-3CDD594BC1E7.jpg'] },
    { h: 'brule-parfum-ovali', t: 'Brûle-Parfum Ovali',
      d: ['Découvrez cet incroyable brûle-parfum OVALI, avec ses motifs soigneusement conçus et ses courbes douces et arrondies qui évoquent l’harmonie. Ses ouvertures, finement travaillées à la main, laissent s’échapper une douce lueur de bougie.', 'Conçu pour accueillir vos cires parfumées, senteurs, huiles essentielles et autres solutions parfumées.', 'Céramique laquée · Fabrication artisanale · Contenance : 45 ml'],
      o: [], v: [[49283264807253, 'Default Title', 16.9, 0, 0]], img: ['FullSizeRender_70eea1c8-5fba-4f3e-945e-2c274b488712.jpg'] },
    { h: 'box-2-bougies-sculpturales-citrouilles', t: 'Box 2 Bougies Sculpturales Citrouilles',
      d: ['Ajoutez une touche d’élégance et d’originalité à votre décoration avec ce coffret de deux bougies sculpturales en forme de citrouille, au délicieux parfum Vanille-Cannelle.', 'Chaque bougie est soigneusement conçue pour imiter à la perfection l’apparence des citrouilles, avec des détails réalistes et des finitions élégantes. 🎃', '⏱️ Délai de fabrication : de 1 à 3 jours selon la disponibilité en stock.'],
      o: [['Parfum', ['🌼 Vanille-Cannelle']]], v: [[49655116267861, '🌼 Vanille-Cannelle', 8.9, 19.9, 1]], img: ['IMG_9143.jpg'] },
    { h: 'sans-titre-5oct-_23-00', t: 'Mini Fondants Halloween',
      d: ['Plongez dans l’univers d’Halloween avec nos mini fondants parfumés, en forme de citrouilles et de fantômes !', '• Pain d’épices pour une fragrance gourmande et chaleureuse', '• Fleur d’oranger pour une touche florale douce et apaisante', 'Boîte de 100 g 👻'],
      o: [['Parfum', ['🍊 Fleur d’Oranger', '🤎 Pain d’Épices']]],
      v: [[49655030055253, '🍊 Fleur d’Oranger', 6.9, 9.9, 1], [51598238843221, '🤎 Pain d’Épices', 6.9, 9.9, 1]], img: ['IMG_9141.jpg'] },
    { h: 'bouquet-feerie-de-noel-boite-sucre-d-orge', t: 'Bouquet Féerie de Noël – Boîte Sucre d’Orge',
      d: ['✨ Bouquet de Noël – Édition Féérique ✨', 'Ange, pain d’épices, flocon, bonhomme de neige, sapins… des pièces en cire sculptées à la main pour créer une scène hivernale douce et poétique. ❄️', 'Présenté dans sa boîte festive motif sucre d’orge, parfumé Fleur de Coton pour une ambiance douce et cocooning.', 'Pssst… un ticket à gratter se cache dans le bouquet, et il renferme un joli cadeau 🎁'],
      o: [], v: [[51986412601685, 'Default Title', 29.9, 44.9, 1]], img: ['FullSizeRender_266bf3f8-390c-4107-8863-6a720a7dbaea.jpg'] },
    { h: 'diffuseurs-voitures', t: 'Diffuseurs Voiture',
      d: ['Nos diffuseurs pour voiture transforment vos trajets en une expérience agréable et parfumée. Fabriqués avec des parfums de Grasse de haute qualité, ces petits flacons élégants diffusent une douce fragrance pendant plusieurs semaines.', 'Il suffit de les suspendre à votre rétroviseur et de profiter de leur senteur délicate. 🚗'],
      o: [], v: [[51629528023381, 'Default Title', 8.9, 0, 1]], img: ['FullSizeRender_d955ba1f-9deb-4d19-8f85-c244dc2c2c5d.heic'], local: 'diffuseurs-voiture' },
    { h: 'mini-parfums-d-interieur', t: 'Mini Parfums d’Intérieur',
      d: ['Nos Parfums d’Intérieur en format 100 mL : la solution idéale pour parfumer votre maison avec praticité. Compact, parfait au quotidien ou à emporter.', 'Grâce au spray, vous ajustez la quantité de parfum et rafraîchissez instantanément vos espaces. ✨', 'Contenance : 100 mL'],
      o: [['Parfum', ['🌷 Rose', '🥥 Noix de Coco', '🌼 Vanille', '🤎 Musc', '🍑 Monoï Pêche', '🧼 Adoucissant', '💖 Rose Vanillée']]],
      v: [[49888556056917, '🌷 Rose', 10.9, 0, 1], [49888556089685, '🥥 Noix de Coco', 10.9, 0, 1], [49888556122453, '🌼 Vanille', 10.9, 0, 1], [49888556155221, '🤎 Musc', 10.9, 0, 1], [49888556187989, '🍑 Monoï Pêche', 10.9, 0, 1], [49888556220757, '🧼 Adoucissant', 10.9, 0, 1], [49888556253525, '💖 Rose Vanillée', 10.9, 0, 1]],
      img: ['6830F9EF-72CE-43F7-B67A-6776012D221B.jpg'] },
    { h: 'poudre-parfumee', t: 'Poudre Parfumée',
      d: ['La poudre parfumée apporte une touche de fraîcheur à votre intérieur : saupoudrez-la sur le sol puis aspirez, votre aspirateur diffuse alors un doux parfum dans toute la maison.', 'Idéale aussi pour parfumer tiroirs, placards et petits espaces. 🫧✨', 'Poids : 100 g'],
      o: [['Parfum', ['Adoucissant', 'Monoï Pêche', 'Fleur d’Abricotier', 'Fleur de Coton', 'Doux Rêves', 'Anti-Tabac Tropical']]],
      v: [[49887270797653, 'Adoucissant', 8.9, 0, 1], [49887270830421, 'Monoï Pêche', 8.9, 0, 1], [49887270863189, 'Fleur d’Abricotier', 8.9, 0, 1], [49887270895957, 'Fleur de Coton', 8.9, 0, 1], [49887270928725, 'Doux Rêves', 8.9, 0, 1], [50197555183957, 'Anti-Tabac Tropical', 8.9, 0, 1]],
      img: ['BE0F5945-7726-42AB-879C-9790AEFF8DE9.jpg'] },
    { h: 'accessoires-pour-bougies-coupe-meches-et-eteignoir-dores', t: 'Coupe-Mèche et Éteignoir Dorés',
      d: ['Sublimez vos moments de détente avec notre duo d’accessoires élégants pour bougies : un coupe-mèche et un éteignoir dorés.', 'Coupe-mèche : coupe la mèche à la longueur idéale pour une combustion propre et prolongée.', 'Éteignoir : éteint vos bougies sans fumée ni éclaboussures, en préservant la mèche et la cire. ✨'],
      o: [], v: [[49858491023701, 'Default Title', 6.9, 16.9, 1]], img: ['90349108-53E5-4A3F-BBE5-02A97A08063A.jpg'] },
    { h: 'brule-parfum-bum', t: 'Brûle-Parfum Bum',
      d: ['Découvrez le brûle-parfum BUM, une pièce élégante et audacieuse qui ne passera pas inaperçue. Tout en courbes et en simplicité, il apporte une touche de style unique à votre intérieur.', 'Conçu pour accueillir vos cires parfumées, il crée une ambiance douce et chaleureuse.'],
      o: [], v: [[49786416660821, 'Default Title', 24.9, 0, 1]], img: ['57EBDAD6-9849-4EF6-8D23-9E6B13C40FC0.jpg', 'C7223CED-0574-4749-9800-E8C7C26B65C1.jpg'] },
    { h: 'brule-parfum-arche', t: 'Brûle-Parfum Arche',
      d: ['Découvrez le brûle-parfum ARCHE, une création raffinée inspirée par l’élégance des formes architecturales. Ses lignes épurées s’intègrent dans tout type de décoration.', 'Un véritable objet de décoration qui allie style et fonctionnalité !'],
      o: [], v: [[49786408829269, 'Default Title', 24.9, 0, 1]], img: ['68093519-5A08-4900-AE75-7B835922119F.jpg', 'FB5FAC40-3958-4E9C-A9B9-F5BF14F9455C.jpg'] },
    { h: 'brule-parfum-teddy', t: 'Brûle-Parfum Teddy',
      d: ['Découvrez ce brûle-parfum TEDDY trop mignon et tout en blanc, qui évoque la douceur et l’envie d’être câliné.', 'Conçu pour accueillir vos cires parfumées, senteurs, huiles essentielles et autres solutions parfumées.', 'Céramique laquée · Fabrication artisanale · Contenance : 38 ml'],
      o: [], v: [[49283294593365, 'Default Title', 16.9, 0, 1]], img: ['7D44BAE6-7646-4EB2-9968-62B6D0C10527.jpg'] },
    { h: 'coffret-5-parfums-dinterieur', t: 'Lot de 5 Parfums d’Intérieur',
      d: ['Notre offre exclusive : un lot de 5 sprays de parfums d’intérieur, chacun avec une fragrance unique, à prix réduit. ✨', 'Rose · Noix de Coco · Vanille · Musc · Monoï Pêche', 'Contenance : 200 mL chacun'],
      o: [], v: [[49281297940821, 'Default Title', 65.9, 89.9, 1]], img: ['229A0BB0-90CE-489E-BA7B-742762BA237E.jpg'] },
    { h: 'fondants-papillons', t: 'Lot de 3 Fondants Papillons',
      d: ['Apportez un souffle de printemps à votre intérieur avec ces jolis fondants parfumés en forme de papillon.'],
      o: [['Parfums', ['💗 Barbe à Papa', '🍃 Fleur d’Acacia', '🧼 Adoucissant', '🍑 Monoï Pêche', '☁️ Fleur de Coton', '💛 Monoï Vanillé', '🧚🏽‍♀️ Poudre de Perlimpinpin', '🍐 Poire Freesia', '🧡 Fleur d’Abricotier', '🩵 Doux Rêves']]],
      v: [[49134581252437, '💗 Barbe à Papa', 3.9, 0, 1], [49134581285205, '🍃 Fleur d’Acacia', 3.9, 0, 1], [49134581317973, '🧼 Adoucissant', 3.9, 0, 1], [49134581350741, '🍑 Monoï Pêche', 3.9, 0, 1], [49134581383509, '☁️ Fleur de Coton', 3.9, 0, 1], [49538509635925, '💛 Monoï Vanillé', 3.9, 0, 1], [49734773539157, '🧚🏽‍♀️ Poudre de Perlimpinpin', 3.9, 0, 1], [49734773571925, '🍐 Poire Freesia', 3.9, 0, 1], [49939839385941, '🧡 Fleur d’Abricotier', 3.9, 0, 1], [49939839418709, '🩵 Doux Rêves', 3.9, 0, 1]],
      img: ['BF15CC22-F866-4C6D-8B84-0D231A10D7DE.jpg', '3C7885A7-0E23-4763-A2A6-2DE88617E4CD.jpg', 'B0D0B324-5129-4238-9975-F99102ACA2ED.jpg', '6AE9EFEB-3975-4EB3-A754-A42314516377.jpg'] },
    { h: 'fondants-spirales', t: 'Fondants Spirales',
      d: ['Laissez-vous emporter par un équilibre harmonieux de parfums avec ces magnifiques fondants en spirale.'],
      o: [['Parfums', ['🍊 Clémentine Monoï', '🍓 Yaourt Fraise', '☁️ Fleur de Coton', '🌼 Fleur des Îles', '💗 Barbe à Papa', '💛 Monoï Vanillé', '🧚🏽‍♀️ Poudre de Perlimpinpin', '🍐 Poire Freesia', '🧡 Fleur d’Abricotier', '🩵 Doux Rêves', '🌸 Musty']]],
      v: [[49134373110101, '🍊 Clémentine Monoï', 2, 0, 1], [49134373142869, '🍓 Yaourt Fraise', 2, 0, 1], [49134373175637, '☁️ Fleur de Coton', 2, 0, 1], [49134373208405, '🌼 Fleur des Îles', 2, 0, 1], [49134373241173, '💗 Barbe à Papa', 2, 0, 1], [49538516517205, '💛 Monoï Vanillé', 2, 0, 1], [49734772556117, '🧚🏽‍♀️ Poudre de Perlimpinpin', 2, 0, 1], [49734772588885, '🍐 Poire Freesia', 2, 0, 1], [49939834241365, '🧡 Fleur d’Abricotier', 2, 0, 1], [49939836207445, '🩵 Doux Rêves', 2, 0, 1], [51870184374613, '🌸 Musty', 2, 0, 1]],
      img: ['A64A1324-2DBF-47A6-B3DB-CF91711E9338.jpg', 'D4555727-5218-4695-86E2-6F6C2DE9AF0E.jpg', '7BCBDD1C-3175-4292-A19E-D0F9FA1C7CDF.jpg', '7126EDC8-EEDF-4474-9DB2-93AF0A6E7CFE.jpg'] },
    { h: 'tablettes-parfumees', t: 'Tablettes Parfumées',
      d: ['Les tablettes parfumées sont le format idéal pour profiter de votre parfum préféré à petit prix.'],
      o: [['Parfum', ['🌼 Fleur des îles', '🍿 Pop Corn', '🧁 Macaron Vanille', '🍪 Cookies Chocolat', '☁️ Doux Rêves', '🍑 Fleur d’Abricotier']]],
      v: [[49133562265941, '🌼 Fleur des îles', 6.9, 0, 1], [49133562298709, '🍿 Pop Corn', 6.9, 0, 1], [49133562331477, '🧁 Macaron Vanille', 6.9, 0, 1], [49133562364245, '🍪 Cookies Chocolat', 6.9, 0, 1], [49133562397013, '☁️ Doux Rêves', 6.9, 0, 1], [49939843547477, '🍑 Fleur d’Abricotier', 6.9, 0, 1]],
      img: ['7D0233BB-D554-4065-A07F-2015C4D7F385.jpg', '9E19C0E1-EBD0-4330-839C-E8CF346A44A5.jpg', '37C763DE-8FD5-4663-86AA-74B6F5D0572D.jpg', '0B9686C8-A2E7-4557-AD34-DFC4D151CF3A.jpg'] },
    { h: '10-bougies-chauffe-plats', t: '6 Bougies Chauffe-plats',
      d: ['Ces 6 bougies chauffe-plats, vendues en un seul lot, offrent une source de lumière et de chaleur économique pour votre maison ou vos soirées.', 'Longue durée de combustion, idéales pour vos brûle-parfums, les dîners romantiques ou les soirées entre amis.'],
      o: [], v: [[49123118448981, 'Default Title', 6.9, 0, 1]], img: ['FullSizeRender_5cc74c41-d51a-4f0f-9d3e-1c1eedb98299.jpg'] },
    { h: 'cartes-cadeaux', t: 'Cartes Cadeaux',
      d: ['Le cadeau idéal pour faire plaisir à coup sûr, en laissant choisir ce dont on a envie.', 'Utilisable pour l’achat de tous les articles de la boutique Harmony Candles, uniquement sur harmonycandles.fr.'],
      o: [['Montant', ['25,00 €', '50,00 €', '100,00 €', '200,00 €']]],
      v: [[48467275055445, '25,00 €', 25, 0, 1], [48467275088213, '50,00 €', 50, 0, 1], [48467275120981, '100,00 €', 100, 0, 1], [48467275153749, '200,00 €', 200, 0, 1]],
      img: ['IMG-7375.png'] },
    { h: 'parfums-dinterieurs', t: 'Parfums d’Intérieur',
      d: ['Nos Parfums d’Intérieur offrent une solution rapide et efficace pour parfumer votre intérieur de manière intense, pour recevoir des invités ou simplement créer une atmosphère parfumée.', 'Monoï Pêche pour une ambiance gourmande, Rose pour une touche florale : transformez chaque pièce en un espace cocooning.', 'Grâce au format spray, vous contrôlez la quantité de parfum diffusée.', 'Contenance : 200 mL'],
      o: [['Parfums', ['🌷 Rose', '🥥 Noix de Coco', '🌼 Vanille', '🤎 Musc', '🍑 Monoï Pêche', '🧼 Adoucissant', '💖 Rose Vanillée']]],
      v: [[48467641205077, '🌷 Rose', 18.9, 0, 1], [48467692781909, '🥥 Noix de Coco', 18.9, 0, 1], [48467692814677, '🌼 Vanille', 18.9, 0, 1], [48467692847445, '🤎 Musc', 18.9, 0, 1], [48474340753749, '🍑 Monoï Pêche', 18.9, 0, 1], [49730721317205, '🧼 Adoucissant', 18.9, 0, 1], [49730761720149, '💖 Rose Vanillée', 18.9, 0, 1]],
      img: ['E94F1EE1-E39A-4A53-877A-167695915B49.jpg', '3C3FD971-7B69-4AAD-904E-9A719D5FD434.jpg', '1B9EC90E-DB51-4828-86C8-9CBFCD139125.jpg', '61FDB01C-4016-4796-821A-ED4792120E41.jpg'] },
  ];

  const collections = [
    { h: 'bouquets-de-fleurs', t: 'Bouquets', em: 'de fleurs', tint: '#f3d7d0', img: 'about',
      d: 'Des bouquets en cire parfumée, composés à la main : une décoration qui ne fane jamais, dont chaque fleur peut être fondue dans un brûle-parfum.',
      p: ['bouquets-de-fleurs-marron', 'bouquet-de-fleurs-xl-bleu-et-blanc', 'bouquet-de-fleurs-roses'] },
    { h: 'coffrets-idees-cadeaux', t: 'Coffrets', em: '& idées cadeaux', tint: '#f0e1cc', img: 'coffrets',
      d: 'Découvrez nos coffrets parfumés, parfaits pour faire plaisir ou simplement se faire plaisir. Des compositions soigneusement préparées, avec des créations artisanales réalisées à la main, pour toutes les occasions. 🎁',
      p: ['pot-de-coeurs-fondants', 'coffret-avec-bruleur-ted', 'coffret-de-fondants-parfumes', 'ecrin-de-roses-🌹', 'cartes-cadeaux'] },
    { h: 'fondants-parfumes', t: 'Fondants', em: 'parfumés', tint: '#dfe7d4', img: 'fondants',
      d: 'Nos fondants parfumés sont de petites merveilles visuelles, travaillées avec des détails délicats : aussi agréables à regarder qu’à utiliser.',
      p: ['tablettes-parfumees', 'fondants-papillons', 'fondants-spirales', 'fondants'] },
    { h: 'brules-parfums-et-fondants', t: 'Brûle-', em: 'parfums', tint: '#f7ddc9', img: 'brules-parfums',
      d: 'Parfaits pour une soirée cocooning ou pour accueillir vos invités avec élégance, nos brûle-parfums vous transportent dans un monde de douceur et de bien-être.',
      p: ['brule-parfum-arche', 'brule-parfum-bum', 'brule-parfum-teddy', 'brule-parfum-bubble', 'brule-parfum-ovali', '10-bougies-chauffe-plats'] },
    { h: 'parfums-dinterieurs', t: 'Parfums', em: 'd’intérieur', tint: '#ebdfd8', img: 'parfums-interieur',
      d: 'Une diffusion rapide et intense de fragrances pour sublimer votre espace : un parfum envoûtant qui transforme votre maison en véritable sanctuaire olfactif.',
      p: ['parfums-dinterieurs', 'mini-parfums-d-interieur', 'coffret-5-parfums-dinterieur'] },
    { h: 'diffuseurs-voiture', t: 'Diffuseurs', em: 'voiture', tint: '#e7e2d2', img: 'diffuseurs-voiture',
      d: 'Apportez une touche de fraîcheur à vos trajets : élégants et pratiques, nos diffuseurs parfument votre voiture pendant plusieurs semaines. 🌸',
      p: ['diffuseurs-voitures'] },
    { h: 'nos-accessoires', t: 'Nos', em: 'accessoires', tint: '#f2e4c8', img: 'accessoires',
      d: 'Une touche d’élégance pour votre rituel bougie : des accessoires dorés, pratiques et raffinés, qui prolongent la durée de vie de vos bougies. ✨',
      p: ['accessoires-pour-bougies-coupe-meches-et-eteignoir-dores'] },
    { h: 'nos-bons-plans', t: 'Nos', em: 'bons plans', tint: '#ecc6bd', img: null,
      d: 'Fins de séries, collections précédentes et légères imperfections visuelles : des pièces faites main, uniques et pleines de caractère, à prix doux. 🌷',
      p: ['poudre-parfumee', 'option-set-1258134-checkbox-2', 'sans-titre-5oct-_23-00', 'box-2-bougies-sculpturales-citrouilles', 'accessoires-pour-bougies-coupe-meches-et-eteignoir-dores', 'bouquet-feerie-de-noel-boite-sucre-d-orge'] },
  ];

  const NO_CUT = ['brule-parfum-ovali', 'brule-parfum-teddy', 'ecrin-de-roses', 'fondants', 'fondants-papillons', 'option-set-1258134-checkbox-2', 'mini-parfums-d-interieur'];

  // utilitaires partagés
  const slug = (h) => h.replace(/[^a-z0-9_-]/gi, '').replace(/-+$/, '');
  products.forEach((p) => {
    p.slug = slug(p.h);
    const prices = p.v.map((v) => v[2]);
    p.min = Math.min(...prices);
    p.max = Math.max(...prices);
    const cmp = p.v.map((v) => v[3]).filter((x) => x > p.min);
    p.compare = cmp.length ? Math.max(...cmp) : 0;
    p.available = p.v.some((v) => v[4]);
    p.collections = collections.filter((c) => c.p.includes(p.h)).map((c) => c.h);
  });

  window.HC = {
    SHOP, CDN, products, collections,
    product: (h) => products.find((p) => p.h === h || p.slug === h),
    collection: (h) => collections.find((c) => c.h === h),
    // "Brûle-" + "parfums" → "Brûle-parfums" ; sinon les deux parties séparées d'un espace
    colName: (c, emTag) => c.t + (c.t.endsWith('-') ? '' : ' ') + (emTag ? '<em>' + c.em + '</em>' : c.em),
    price: (n) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }),
    // photos retouchées en local si disponibles, sinon CDN de la boutique
    photo: (p, i = 0, w = 900) => (p.local && i === 0 ? 'assets/img/' + p.local + '.jpg' : 'assets/img/products/' + p.slug + '-' + i + '.jpg'),
    cdnPhoto: (p, i = 0, w = 900) => CDN + p.img[i] + '?width=' + w,
    // détourage studio (null quand la photo d'origine ne s'y prête pas : on garde alors la photo)
    cutout: (p) => (NO_CUT.includes(p.slug) ? null : 'assets/img/products/cut/' + p.slug + '.png'),
    shopUrl: (p) => SHOP + '/products/' + encodeURIComponent(p.h),
    cartUrl: (variantId, qty = 1) => SHOP + '/cart/' + variantId + ':' + qty,
  };
})();
