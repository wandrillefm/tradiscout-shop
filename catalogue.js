// ════════════════════════════════════════════════════════════════════════
// CATALOGUE TRADISCOUT — édite uniquement ce fichier pour gérer les produits
// ════════════════════════════════════════════════════════════════════════

// ── TYPES DE VÊTEMENTS ───────────────────────────────────────────────────
// id    : identifiant interne (ne pas changer)
// label : nom affiché sur le site
// code  : numéro utilisé dans le nom des fichiers image (X dans X-Y-design.png)
// price : prix de base en euros (peut être surchargé par env var Vercel)
const TYPES = [
  { id: 'tshirt', label: 'T-Shirt', code: '1', price: 17 },
  { id: 'sweat',  label: 'Sweat',   code: '2', price: 33 },
  { id: 'hoodie', label: 'Hoodie',  code: '3', price: 37 },
];

// ── COULEURS ─────────────────────────────────────────────────────────────
// id    : identifiant interne
// label : nom affiché sur le site
// code  : numéro utilisé dans le nom des fichiers image (Y dans X-Y-design.png)
const COLORS = [
  { id: 'blanc', label: 'Blanc',  code: '1' },
  { id: 'bleu',  label: 'Marine', code: '2' },
];

// ── TAILLES ──────────────────────────────────────────────────────────────
const SIZES = ['S', 'M', 'L'];

// ── DESIGNS ──────────────────────────────────────────────────────────────
// id    : identifiant envoyé au serveur (unique, ne pas changer après mise en prod)
// key   : nom du design dans le nom des fichiers image (Z dans X-Y-Z.png)
// label : nom affiché sur le site
//
// Convention fichiers image : X-Y-key.png
//   X = code du type   (1=tshirt, 2=sweat, 3=hoodie)
//   Y = code couleur   (1=blanc,  2=bleu)
//   key = valeur "key" ci-dessous
//
// Exemples :
//   2-2-christus-rex.png   → sweat marine christus-rex
//   1-1-braises-surgelees.png → tshirt blanc braises-surgelees
//
// → Pour ajouter un design : ajoute une ligne ici, upload les images, redéploie
// → L'id doit aussi être ajouté dans validDesigns + designLabels dans checkout.js
const DESIGNS = [
  { id: '1', key: 'tradiscout',      label: 'Tradiscout'              },
  { id: '2', key: 'double-croix',    label: 'Double Croix'            },
  { id: '3', key: 'deus-vult',       label: 'Deus Vult'               },
  { id: '4', key: 'verso-lalto',     label: "Verso l'Alto"            },
  { id: '5', key: 'christus-rex',    label: 'Christus Rex'            },
  { id: '6', key: 'jpeuxpas',        label: "J'peux pas j'ai scout"   },
  { id: '7', key: 'mode-grand-jeu',  label: 'Mode Grand Jeu'          },
  { id: '8', key: 'braises',         label: 'Braises Surgelées'       },
];

// ── IMAGE PAR DÉFAUT SUR LA GRILLE ───────────────────────────────────────
// Type et couleur affichés sur la card de présentation
const GRID_DEFAULT_TYPE  = 'sweat';  // id du type
const GRID_DEFAULT_COLOR = 'bleu';   // id de la couleur

// ════════════════════════════════════════════════════════════════════════
// NE PAS MODIFIER EN DESSOUS — logique interne
// ════════════════════════════════════════════════════════════════════════

function imgSrc(typeId, colorId, designKey) {
  const t = TYPES.find(x => x.id === typeId);
  const c = COLORS.find(x => x.id === colorId);
  return `${t.code}-${c.code}-${designKey}.png`;
}
