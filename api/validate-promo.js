// api/validate-promo.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const { promoCode } = req.body;
  if (!promoCode) return res.status(400).json({ error: 'Code manquant' });

  // Format env var : "TRASCO=0.2,SCOUT10=0.1"  (valeur = fraction, ex. 0.2 = 20%)
  const promoCodes = {};
  if (process.env.PROMO_CODES) {
    for (const entry of process.env.PROMO_CODES.split(',')) {
      const [code, discount] = entry.trim().split('=');
      if (code && discount) promoCodes[code.toUpperCase()] = parseFloat(discount);
    }
  }

  const code = promoCode.trim().toUpperCase();
  if (promoCodes[code] === undefined)
    return res.status(400).json({ error: 'Code promo invalide' });

  return res.status(200).json({
    valid: true,
    code,
    discountPercent: promoCodes[code],
  });
}
