# 🚀 Guide de déploiement — Tradiscout Shop

## Structure du projet
```
tradiscout-shop/
├── index.html        ← La boutique
├── success.html      ← Page après paiement
├── vercel.json       ← Config Vercel
└── api/
    └── checkout.js   ← Fonction backend Stripe
```

---

## Étape 1 — Préparer Stripe

1. Va sur **dashboard.stripe.com**
2. Assure-toi d'être en **mode Test** (toggle en haut à gauche)
3. Va dans **Développeurs → Clés API**
4. Copie ta **Clé secrète** (commence par `sk_test_...`)

> ⚠️ Ne mets JAMAIS cette clé dans ton HTML ou ton JS côté client.

---

## Étape 2 — Déployer sur Vercel

### Option A — Via GitHub (recommandée)

1. Crée un repo GitHub avec les fichiers du projet
2. Va sur **vercel.com** → "New Project"
3. Importe ton repo GitHub
4. Vercel détecte automatiquement la config

### Option B — Via CLI Vercel

```bash
npm install -g vercel
cd tradiscout-shop
vercel
```

---

## Étape 3 — Configurer les variables d'environnement ⚠️ CRUCIAL

C'est ici que tout se jouait avant. Sans ça, ça plante.

1. Dans ton projet Vercel → **Settings → Environment Variables**
2. Ajoute ces deux variables :

| Nom | Valeur |
|-----|--------|
| `STRIPE_SECRET_KEY` | `sk_test_XXXXXXXXXX` (ta clé Stripe test) |
| `BASE_URL` | `https://ton-projet.vercel.app` (ton URL Vercel sans slash final) |

3. Clique **Save**
4. **Redéploie** le projet (important — les variables ne s'appliquent qu'au prochain déploiement)

---

## Étape 4 — Tester

1. Ouvre ton URL Vercel
2. Configure un vêtement complet et clique "Commander"
3. Sur la page Stripe, utilise la carte test : **4242 4242 4242 4242**
   - Date : n'importe quelle date future (ex: 12/28)
   - CVC : n'importe quoi (ex: 123)
4. Tu dois atterrir sur `/success.html`
5. Vérifie dans Stripe Dashboard → Paiements que la commande apparaît

---

## Étape 5 — Passer en production (quand tu es prêt)

1. Dans Stripe, passe en **mode Live**
2. Copie ta **clé secrète Live** (`sk_live_...`)
3. Dans Vercel → Settings → Environment Variables
4. Remplace `STRIPE_SECRET_KEY` par la clé live
5. Redéploie

---

## Personnaliser les citations

Dans `index.html`, cherche la section `<!-- DESIGN / CITATION -->` et modifie les textes des 4 boutons. Fais de même dans `api/checkout.js` dans l'objet `designLabels`.

---

## Voir les commandes

Toutes les commandes apparaissent dans **Stripe Dashboard → Paiements**.
Les métadonnées (type, taille, couleur, design) sont visibles dans chaque paiement.

---

## En cas de bug

Si le checkout plante, va dans **Vercel → ton projet → Functions → Logs**
Tu verras l'erreur exacte de la fonction `api/checkout.js`.
