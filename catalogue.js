// ─────────────────────────────────────────────
//  CATALOGUE TRADISCOUT
//  Source de vérité unique — front + API
// ─────────────────────────────────────────────

const COLLECTIONS = [
  { id: 'scouts',  label: 'Classiques'  },
  { id: 'saints',  label: 'Chretien'  },
  { id: 'humour',  label: '2nd deg'  },
];

const TYPES = [
  { id: 'tshirt', label: 'T-Shirt', code: '1', price: 25 },
  { id: 'sweat',  label: 'Sweat',   code: '2', price: 40 },
  { id: 'hoodie', label: 'Hoodie',  code: '3', price: 45 },
];

const COLORS = [
  { id: 'blanc', label: 'Blanc',  code: '1' },
  { id: 'bleu',  label: 'Marine', code: '2' },
];

const SIZES = ['S', 'M', 'L'];

// ─── DESIGNS ───────────────────────────────
// Chaque produit :
//   id          → identifiant unique (string)
//   key         → slug URL-safe
//   label       → nom affiché
//   description → courte phrase affichée dans la lightbox
//   types       → sous-ensemble de TYPES disponibles
//   colors      → sous-ensemble de COLORS disponibles
//   images      → liste de noms de fichiers dans /images/
//                 (n'importe quel nom, lifestyle ou pack shot)
//   collection  → id d'une COLLECTION

const DESIGNS = [
  {
    id: '1', key: 'tradiscout', label: 'Tradiscout',
    description: 'Rien de plus basique',
    types:  ['tshirt','sweat','hoodie'],
    colors: ['blanc', 'bleu'],
    images: ['1-1-tradiscout.png', '1-2-tradiscout.png'],
    collection: 'scouts',
  },
  {
    id: '2', key: 'double-croix', label: 'Double Croix',
    description: 'Variante',
    types:  ['tshirt', 'sweat','hoodie'],
    colors: ['blanc', 'bleu'],
    images: ['1-1-double-croix.png', '1-2-double-croix.png', '2-1-double-croix.png'],
    collection: 'scouts',
  },
  {
    id: '3', key: 'deus-vult', label: 'Deus Vult',
    description: 'Comme au temps des templiers',
    types:  ['tshirt', 'sweat'],
    colors: ['blanc', 'bleu'],
    images: ['1-1-deus-vult.png', '1-2-deus-vult.png', '2-2-deus-vult.png'],
    collection: 'scouts',
  },
  {
    id: '4', key: 'verso-lalto', label: 'Verso l\'Alto',
    description: 'Devise de Saint Pier Georgio Frassati',
    types:  ['tshirt', 'sweat'],
    colors: ['blanc', 'bleu'],
    images: ['1-1-verso-lalto.png', '2-1-verso-lalto.png'],
    collection: 'scouts',
  },
  {
    id: '5', key: 'mode-grand-jeu', label: 'Mode Grand Jeu',
    description: 'Hans Zimmer dans les oreilles et un foulard dans la ceinture',
    types:  ['tshirt'],
    colors: ['blanc', 'bleu'],
    images: ['1-2-mode-grand-jeu.png'],
    collection: 'humour',
  },
  {
    id: '6', key: 'braises', label: 'Braises Surgelées',
    description: 'Le saint graal',
    types:  ['tshirt','sweat','hoodie'],
    colors: ['blanc', 'bleu'],
    images: ['1-1-braises.png', '2-1-braises.png'],
    collection: 'humour',
  },
  {
    id: '7', key: 'christus-rex', label: 'Christus Rex',
    description: 'Mexique.',
    types:  ['tshirt','sweat','hoodie'],
    colors: ['blanc', 'bleu'],
    images: ['1-1-christus-rex.png', '1-2-christus-rex.png'],
    collection: 'saints',
  },
  {
    id: '8', key: 'st-michel', label: 'St Michel',
    description: 'Le goat',
    types:  ['tshirt','sweat','hoodie'],
    colors: ['blanc', 'bleu'],
    images: ['1-1-st-michel.png', '2-2-st-michel.png'],
    collection: 'saints',
  },
  {
    id: '9', key: 'st-jean-marie-vianney', label: 'St Jean-Marie Vianney',
    description: 'En esprit de sainteté',
    types:  ['tshirt','sweat','hoodie'],
    colors: ['blanc', 'bleu'],
    images: ['2-1-st-jean-marie-vianney.png', '3-2-st-jean-marie-vianney.png'],
    collection: 'saints',
  },
  {
    id: '10', key: 'st-george', label: 'St George',
    description: 'St patron des éclaireurs',
    types:  ['tshirt', 'sweat', 'hoodie'],
    colors: ['blanc', 'bleu'],
    images: ['1-1-st-george.png', '2-1-st-george.png'],
    collection: 'saints',
  },
  {
    id: '11', key: 'jpeuxpas', label: 'J\'peux pas j\'ai scout',
    description: 'La seule excuse valable un samedi matin.',
    types:  ['tshirt', 'sweat', 'hoodie'],
    colors: ['blanc', 'bleu'],
    images: ['1-1-jpeuxpas.png', '1-2-jpeuxpas.png', '2-2-jpeuxpas.png'],
    collection: 'humour',
  },
];

// ─── HELPERS ───────────────────────────────

/** Première image d'un design (fallback carte grille) */
function coverImg(designKey) {
  const d = DESIGNS.find(x => x.key === designKey);
  return d && d.images.length ? d.images[0] : 'placeholder.png';
}

if (typeof module !== 'undefined') {
  module.exports = { COLLECTIONS, TYPES, COLORS, SIZES, DESIGNS, coverImg };
}
