const TYPES = [
  { id: 'tshirt', label: 'T-Shirt', code: '1', price: 25 },
  { id: 'sweat', label: 'Sweat', code: '2', price: 40 },
  { id: 'hoodie', label: 'Hoodie', code: '3', price: 45 },
];

const COLORS = [
  { id: 'blanc', label: 'Blanc', code: '1' },
  { id: 'bleu', label: 'Marine', code: '2' },
];

const SIZES = ['S', 'M', 'L'];

const DESIGNS = [
  { id: '1', key: 'tradiscout', label: 'Tradiscout', description: 'Le logo historique du compte.\nPorte le blason avec fierté.', types: ["tshirt"], colors: ["blanc","bleu"] },
  { id: '2', key: 'double-croix', label: 'Double Croix', description: 'Deux croix entrelacées, symbole de foi.\nSimple, fort, intemporel.', types: ["tshirt","sweat"], colors: ["blanc","bleu"] },
  { id: '3', key: 'deus-vult', label: 'Deus Vult', description: 'Le cri de ralliement des croisés.\nPour ceux qui n\'ont pas peur d\'avancer.', types: ["tshirt","sweat","hoodie"], colors: ["blanc","bleu"] },
  { id: '4', key: 'verso-lalto', label: 'Verso l\'Alto', description: 'Toujours plus haut — devise de scout.\nUn appel à dépasser ses limites.', types: ["tshirt","sweat","hoodie"], colors: ["blanc","bleu"] },
  { id: '5', key: 'christus-rex', label: 'Christus Rex', description: 'Le Christ Roi, au centre de tout.\nDesign épuré pour un message fort.', types: ["tshirt","sweat","hoodie"], colors: ["blanc","bleu"] },
  { id: '6', key: 'jpeuxpas', label: 'J\'peux pas j\'ai scout', description: 'La réponse classique du scout engagé.\nHumour et fierté mêlés.', types: ["tshirt","sweat","hoodie"], colors: ["blanc","bleu"] },
  { id: '7', key: 'mode-grand-jeu', label: 'Mode Grand Jeu', description: 'Pour les nuits en forêt et les grandes aventures.\nMode grand jeu : activé.', types: ["tshirt"], colors: ["blanc","bleu"] },
  { id: '8', key: 'braises', label: 'Braises Surgelées', description: 'Le feu sacré, même au cœur de l\'hiver.\nUn oxymore qui dit tout.', types: ["tshirt","sweat","hoodie"], colors: ["blanc","bleu"] },
  { id: '9', key: 'st-michel', label: 'St Michel', description: 'Le prince des anges, patron des scouts.\nSon épée pointe vers le ciel.', types: ["tshirt","sweat","hoodie"], colors: ["blanc","bleu"] },
  { id: '10', key: 'st-jean-marie-vianney', label: 'St Jean-Marie Vianney', description: 'Le saint curé d\'Ars, modèle de persévérance.\nPatron des prêtres et des âmes simples.', types: ["sweat","hoodie"], colors: ["blanc","bleu"] },
  { id: '11', key: 'st-george', label: 'St George', description: 'Le chevalier saint Georges, terrasseur de dragons.\nCourage et droiture en bannière.', types: ["tshirt","sweat","hoodie"], colors: ["blanc","bleu"] },
];

const GRID_DEFAULT_TYPE  = 'sweat';
const GRID_DEFAULT_COLOR = 'bleu';

function imgSrc(typeId, colorId, designKey) {
  const t = TYPES.find(x => x.id === typeId);
  const c = COLORS.find(x => x.id === colorId);
  return `${t.code}-${c.code}-${designKey}.png`;
}

if (typeof module !== 'undefined') module.exports = { TYPES, COLORS, SIZES, DESIGNS, imgSrc };
