// api/checkout.js
// Fonction serverless Vercel — crée une session Stripe Checkout

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const { type, size, color, design, price } = req.body;

  // Validation
  const validTypes = ['tshirt', 'sweat', 'hoodie'];
  const validSizes = ['S', 'M', 'L'];
  const validColors = ['blanc', 'marine'];
  const validDesigns = ['1', '2', '3', '4'];
  const validPrices = { tshirt: 17, sweat: 33, hoodie: 37 };

  if (!validTypes.includes(type)) return res.status(400).json({ error: 'Type invalide' });
  if (!validSizes.includes(size)) return res.status(400).json({ error: 'Taille invalide' });
  if (!validColors.includes(color)) return res.status(400).json({ error: 'Couleur invalide' });
  if (!validDesigns.includes(design)) return res.status(400).json({ error: 'Design invalide' });
  if (validPrices[type] !== price) return res.status(400).json({ error: 'Prix invalide' });

  // Labels lisibles
  const typeLabels = { tshirt: 'T-Shirt', sweat: 'Sweat', hoodie: 'Hoodie' };
  const designLabels = {
    '1': 'Laisse Dieu agir...',
    '2': 'Toujours prêt...',
    '3': 'Per aspera ad astra',
    '4': "Verso l'Alto"
  };

  const productName = `${typeLabels[type]} Verso L'Alto`;
  const description = `Couleur: ${color} | Taille: ${size} | Design 0${design}: ${designLabels[design]}`;

  try {
    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'payment_method_types[]': 'card',
        'line_items[0][price_data][currency]': 'eur',
        'line_items[0][price_data][product_data][name]': productName,
        'line_items[0][price_data][product_data][description]': description,
        'line_items[0][price_data][unit_amount]': String(price * 100), // en centimes
        'line_items[0][quantity]': '1',
        'mode': 'payment',
        'success_url': `${process.env.BASE_URL}/success.html`,
        'cancel_url': `${process.env.BASE_URL}/`,
        // Métadonnées pour retrouver la commande dans Stripe
        'metadata[type]': type,
        'metadata[size]': size,
        'metadata[color]': color,
        'metadata[design]': design,
        // Collecte adresse de livraison
        'shipping_address_collection[allowed_countries][]': 'FR',
        // Activer les codes promo si tu en crées dans Stripe
        // 'allow_promotion_codes': 'true',
      }).toString()
    });

    if (!stripeRes.ok) {
      const errData = await stripeRes.json();
      console.error('Stripe error:', errData);
      return res.status(500).json({ error: errData.error?.message || 'Erreur Stripe' });
    }

    const session = await stripeRes.json();
    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error('Erreur serveur:', err);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}
