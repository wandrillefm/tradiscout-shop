// api/checkout.js
// Gère un panier avec plusieurs articles + sauvegarde dans Supabase
// Supporte les codes promo et les prix configurables via env vars Vercel

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const { items, promoCode } = req.body;

  // ── Prix de base ──────────────────────────────────────────────────────
  // Modifiables via env vars Vercel sans toucher au code.
  // Exemple semaine -2€ : PRICE_TSHIRT=15, PRICE_SWEAT=31, PRICE_HOODIE=35
  const basePrices = {
    tshirt: parseInt(process.env.PRICE_TSHIRT  ?? '17'),
    sweat:  parseInt(process.env.PRICE_SWEAT   ?? '33'),
    hoodie: parseInt(process.env.PRICE_HOODIE  ?? '37'),
  };

  // ── Codes promo ───────────────────────────────────────────────────────
  // Env var PROMO_CODES format : "CODE1=remise,CODE2=remise"
  // Exemple : "ETE2025=2,SCOUT10=10"
  const promoCodes = {};
  if (process.env.PROMO_CODES) {
    for (const entry of process.env.PROMO_CODES.split(',')) {
      const [code, discount] = entry.trim().split('=');
      if (code && discount) promoCodes[code.toUpperCase()] = parseInt(discount);
    }
  }

  let discountPerItem = 0;
  let appliedPromo    = null;

  if (promoCode) {
    const code = promoCode.trim().toUpperCase();
    if (promoCodes[code] !== undefined) {
      discountPerItem = promoCodes[code];
      appliedPromo    = code;
    } else {
      return res.status(400).json({ error: 'Code promo invalide' });
    }
  }

  // ── Validation ────────────────────────────────────────────────────────
  // → Pour ajouter un design : ajoute son id dans validDesigns ET son label dans designLabels
  const validTypes   = ['tshirt', 'sweat', 'hoodie'];
  const validSizes   = ['S', 'M', 'L'];
  const validColors  = ['blanc', 'bleu'];
  const validDesigns = ['1', '2', '3', '4', '5', '6', '7', '8'];

  if (!Array.isArray(items) || items.length === 0)
    return res.status(400).json({ error: 'Panier vide' });

  for (const item of items) {
    if (!validTypes.includes(item.type))     return res.status(400).json({ error: 'Type invalide' });
    if (!validSizes.includes(item.size))     return res.status(400).json({ error: 'Taille invalide' });
    if (!validColors.includes(item.color))   return res.status(400).json({ error: 'Couleur invalide' });
    if (!validDesigns.includes(item.design)) return res.status(400).json({ error: 'Design invalide' });

    const expectedPrice = basePrices[item.type] - discountPerItem;
    if (item.price !== expectedPrice)
      return res.status(400).json({ error: `Prix invalide pour ${item.type} (attendu: ${expectedPrice}€)` });
  }

  // ── Labels ────────────────────────────────────────────────────────────
  const typeLabels = {
    tshirt: 'T-Shirt',
    sweat:  'Sweat',
    hoodie: 'Hoodie',
  };
  const designLabels = {
    '1': 'Tradiscout',
    '2': 'Double Croix',
    '3': 'Deus Vult',
    '4': "Verso l'Alto",
    '5': 'Christus Rex',
    '6': "J'peux pas j'ai scout",
    '7': 'Mode Grand Jeu',
    '8': 'Braises Surgelées',
  };

  // ── Construire les line_items Stripe ──────────────────────────────────
  const grouped = {};
  for (const item of items) {
    const key = `${item.type}-${item.size}-${item.color}-${item.design}`;
    if (!grouped[key]) grouped[key] = { ...item, qty: 0 };
    grouped[key].qty++;
  }

  const lineItemsParams = {};
  Object.values(grouped).forEach((item, i) => {
    const name       = `${typeLabels[item.type]} — ${designLabels[item.design]}`;
    const promoLabel = appliedPromo ? ` [${appliedPromo} -${discountPerItem}€]` : '';
    const desc       = `Couleur: ${item.color} | Taille: ${item.size} | ${designLabels[item.design]}${promoLabel}`;
    lineItemsParams[`line_items[${i}][price_data][currency]`]                  = 'eur';
    lineItemsParams[`line_items[${i}][price_data][product_data][name]`]        = name;
    lineItemsParams[`line_items[${i}][price_data][product_data][description]`] = desc;
    lineItemsParams[`line_items[${i}][price_data][unit_amount]`]               = String(item.price * 100);
    lineItemsParams[`line_items[${i}][quantity]`]                              = String(item.qty);
  });

  // ── Créer session Stripe ──────────────────────────────────────────────
  let session;
  try {
    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        ...lineItemsParams,
        'payment_method_types[]': 'card',
        'mode': 'payment',
        'success_url': `${process.env.BASE_URL}/success.html`,
        'cancel_url': `${process.env.BASE_URL}/`,
        'shipping_address_collection[allowed_countries][]': 'FR',
      }).toString()
    });
    if (!stripeRes.ok) {
      const errData = await stripeRes.json();
      console.error('Stripe error:', errData);
      return res.status(500).json({ error: errData.error?.message || 'Erreur Stripe' });
    }
    session = await stripeRes.json();
  } catch (err) {
    console.error('Stripe fetch error:', err);
    return res.status(500).json({ error: 'Erreur lors de la création du paiement' });
  }

  // ── Sauvegarder dans Supabase ─────────────────────────────────────────
  try {
    const total = items.reduce((s, i) => s + i.price, 0);
    const supabaseRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/commandes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        stripe_session_id:  session.id,
        articles: items.map(i => ({
          type:    i.type,
          taille:  i.size,
          couleur: i.color,
          design:  designLabels[i.design],
          prix:    i.price
        })),
        total,
        nb_articles:        items.length,
        statut:             'en_attente',
        code_promo:         appliedPromo ?? null,
        remise_par_article: discountPerItem > 0 ? discountPerItem : null,
      })
    });
    if (!supabaseRes.ok) console.error('Supabase error:', await supabaseRes.text());
  } catch (err) {
    console.error('Supabase fetch error:', err);
  }

  return res.status(200).json({
    url: session.url,
    promoApplied: appliedPromo ? { code: appliedPromo, discountPerItem } : null
  });
}
