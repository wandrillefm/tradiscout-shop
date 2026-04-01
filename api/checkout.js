// api/checkout.js
// Gère un panier avec plusieurs articles + sauvegarde dans Supabase

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const { items } = req.body;

  // ── Validation ──────────────────────────────────────────────────────
  const validTypes = ['tshirt', 'sweat', 'hoodie'];
  const validSizes = ['S', 'M', 'L'];
  const validColors = ['blanc', 'bleu'];
  const validDesigns = ['1', '2', '3', '4'];
  const validPrices = { tshirt: 17, sweat: 33, hoodie: 37 };

  if (!Array.isArray(items) || items.length === 0)
    return res.status(400).json({ error: 'Panier vide' });

  for (const item of items) {
    if (!validTypes.includes(item.type)) return res.status(400).json({ error: 'Type invalide' });
    if (!validSizes.includes(item.size)) return res.status(400).json({ error: 'Taille invalide' });
    if (!validColors.includes(item.color)) return res.status(400).json({ error: 'Couleur invalide' });
    if (!validDesigns.includes(item.design)) return res.status(400).json({ error: 'Design invalide' });
    if (validPrices[item.type] !== item.price) return res.status(400).json({ error: 'Prix invalide' });
  }

  // ── Labels ──────────────────────────────────────────────────────────
  const typeLabels = { tshirt: 'T-Shirt', sweat: 'Sweat', hoodie: 'Hoodie' };
  const designLabels = {
    '1': 'Tradiscout',
    '2': 'Double Croix',
    '3': 'Deus Vult',
    '4': "Verso l'Alto"
  };

  // ── Construire les line_items Stripe ────────────────────────────────
  // On regroupe les articles identiques (même type+taille+couleur+design)
  const grouped = {};
  for (const item of items) {
    const key = `${item.type}-${item.size}-${item.color}-${item.design}`;
    if (!grouped[key]) grouped[key] = { ...item, qty: 0 };
    grouped[key].qty++;
  }

  const lineItemsParams = {};
  Object.values(grouped).forEach((item, i) => {
    const name = `${typeLabels[item.type]} Verso L'Alto`;
    const desc = `Couleur: ${item.color} | Taille: ${item.size} | Design 0${item.design}: ${designLabels[item.design]}`;
    lineItemsParams[`line_items[${i}][price_data][currency]`] = 'eur';
    lineItemsParams[`line_items[${i}][price_data][product_data][name]`] = name;
    lineItemsParams[`line_items[${i}][price_data][product_data][description]`] = desc;
    lineItemsParams[`line_items[${i}][price_data][unit_amount]`] = String(item.price * 100);
    lineItemsParams[`line_items[${i}][quantity]`] = String(item.qty);
  });

  // ── Créer session Stripe ─────────────────────────────────────────────
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

  // ── Sauvegarder dans Supabase ────────────────────────────────────────
  try {
    const total = items.reduce((s, i) => s + i.price, 0);

    const supabaseRes = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/commandes`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          stripe_session_id: session.id,
          articles: items.map(i => ({
            type: i.type,
            taille: i.size,
            couleur: i.color,
            design: `Design 0${i.design} — ${designLabels[i.design]}`,
            prix: i.price
          })),
          total,
          nb_articles: items.length,
          statut: 'en_attente'
        })
      }
    );

    if (!supabaseRes.ok) {
      // On log l'erreur mais on n'empêche pas le checkout
      const errText = await supabaseRes.text();
      console.error('Supabase error:', errText);
    }
  } catch (err) {
    console.error('Supabase fetch error:', err);
    // Pas bloquant — le paiement continue quand même
  }

  return res.status(200).json({ url: session.url });
}
