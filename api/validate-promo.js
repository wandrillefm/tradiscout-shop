// api/validate-promo.js
// Vérifie un code promo sans créer de session Stripe
// Appelé par le front au moment où l'utilisateur tape son code

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const { promoCode } = req.body;
  if (!promoCode) return res.status(400).json({ error: 'Code manquant' });

  // Même source de vérité que checkout.js — env var PROMO_CODES
  // Format : "ETE2025=2,SCOUT10=10"
  // → Pour ajouter/modifier/supprimer un code : modifie l'env var dans Vercel et redéploie
  const promoCodes = {};
  if (process.env.PROMO_CODES) {
    for (const entry of process.env.PROMO_CODES.split(',')) {
      const [code, discount] = entry.trim().split('=');
      if (code && discount) promoCodes[code.toUpperCase()] = parseInt(discount);
    }
  }

  const code = promoCode.trim().toUpperCase();
  if (promoCodes[code] === undefined)
    return res.status(400).json({ error: 'Code promo invalide' });

  return res.status(200).json({ valid: true, code, discountPerItem: promoCodes[code] });
}
