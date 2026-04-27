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
  { id: '1', key: 'tradiscout', label: 'Tradiscout c1', types: ["tshirt"], colors: ["blanc","bleu"] },
  { id: '2', key: 'double-croix', label: 'Double Croix c1', types: ["tshirt","sweat"], colors: ["blanc","bleu"] },
  { id: '3', key: 'deus-vult', label: 'Deus Vult c1', types: ["tshirt","sweat","hoodie"], colors: ["blanc","bleu"] },
  { id: '4', key: 'verso-lalto', label: 'Verso l\'Alto c1', types: ["tshirt","sweat","hoodie"], colors: ["blanc","bleu"] },
  { id: '5', key: 'christus-rex', label: 'Christus Rex c1', types: ["tshirt","sweat","hoodie"], colors: ["blanc","bleu"] },
  { id: '6', key: 'jpeuxpas', label: 'J\'peux pas j\'ai scout c1', types: ["tshirt","sweat","hoodie"], colors: ["blanc","bleu"] },
  { id: '7', key: 'mode-grand-jeu', label: 'Mode Grand Jeu c1', types: ["tshirt"], colors: ["blanc","bleu"] },
  { id: '8', key: 'braises', label: 'Braises Surgelées c1', types: ["tshirt","sweat","hoodie"], colors: ["blanc","bleu"] },
  { id: '9', key: 'st-michel', label: 'St Michel c2', types: ["tshirt","sweat","hoodie"], colors: ["blanc","bleu"] },
  { id: '10', key: 'st-jean-marie-vianney', label: 'St Jean-Marie Vianney c2', types: ["sweat","hoodie"], colors: ["blanc","bleu"] },
  { id: '11', key: 'st-george', label: 'St George c2', types: ["tshirt","sweat","hoodie"], colors: ["blanc","bleu"] },
];

const GRID_DEFAULT_TYPE  = 'sweat';
const GRID_DEFAULT_COLOR = 'bleu';

function imgSrc(typeId, colorId, designKey) {
  const t = TYPES.find(x => x.id === typeId);
  const c = COLORS.find(x => x.id === colorId);
  return `${t.code}-${c.code}-${designKey}.png`;
}

if (typeof module !== 'undefined') module.exports = { TYPES, COLORS, SIZES, DESIGNS, imgSrc };
