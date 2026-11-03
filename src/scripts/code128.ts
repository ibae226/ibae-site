// Code-barres Code 128 (jeu B) : celui de la carte d'embarquement se scanne pour de vrai.
const MOTIFS =
  '212222222122222221121223121322131222122213122312132212221213221312231212112232122132122231113222123122123221223211221132221231213212223112312131311222321122321221312212322112322211212123212321232121111323131123131321112313132113132311211313231113231311112133112331132131113123113321133121313121211331231131213113213311213131311123311321331121312113312311332111314111221411431111111224111422121124121421141122141221112214112412122114122411142112142211241211221114413111241112134111111242121142121241114212124112124211411212421112421211212141214121412121111143111341131141114113114311411113411311113141114131311141411131';
const DEPART_B = '211214';
const ARRET = '2331112';

const motif = (valeur: number) => MOTIFS.slice(valeur * 6, valeur * 6 + 6);

export function texteCode128(entree: string) {
  return entree
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^\x20-\x7e]/g, '');
}

/** Renvoie le tracé SVG du code-barres et sa largeur en modules. */
export function code128(entree: string) {
  const valeurs = [...texteCode128(entree)].map((c) => c.charCodeAt(0) - 32);
  const controle = valeurs.reduce((somme, v, i) => somme + v * (i + 1), 104) % 103;
  const suite = DEPART_B + valeurs.map(motif).join('') + motif(controle) + ARRET;

  let x = 0;
  let trace = '';
  [...suite].forEach((largeur, i) => {
    const l = Number(largeur);
    if (i % 2 === 0) trace += `M${x} 0h${l}v40h-${l}z`;
    x += l;
  });
  return { trace, largeur: x };
}
