// Toutes les informations à mettre à jour facilement sont ici.
// Une valeur vide ('') masque automatiquement l'élément sur le site.

export const site = {
  nom: 'Initiative Burkinabè pour l’Aéronautique et l’Espace',
  sigle: 'IBAE',
  devise: 'Hal yĩngr ãdse',
  deviseFr: 'Jusqu’aux étoiles',
  url: 'https://ibae.bf',
  description:
    'L’IBAE fait découvrir l’aéronautique et le spatial aux jeunes du Burkina Faso, encourage leur formation et les met en relation avec les professionnels du secteur.',
  email: 'ibae.bf@gmail.com',
  reseaux: {
    linkedin: 'https://www.linkedin.com/company/ibae-bf',
    instagram: 'https://www.instagram.com/ibae.bf',
    whatsapp: 'https://whatsapp.com/channel/0029Vb5jyqh9hXFEHXuoS31Z',
    facebook: '', // à compléter avec l’adresse exacte de la page Facebook
  },
  groupeWhatsapp: 'https://chat.whatsapp.com/DCMTfruYUYFGWwXUFr6EA0',
  // Jeton Cloudflare Web Analytics. Vide : aucune mesure d’audience n’est chargée.
  jetonAudience: '',
};

// Mentions légales : renseigner ces champs quand ils sont disponibles.
export const legal = {
  directeurPublication: 'Abdoul Salam Tankoano, président du Bureau Exécutif',
  numeroEnregistrement: '', // numéro du récépissé d’enregistrement de l’association
  adresse: '', // adresse postale du siège
};

export const chiffres = [
  { valeur: '50+', libelle: 'participants à la première JBAE' },
  { valeur: '300+', libelle: 'participants cumulés à nos webinaires', accent: true },
  { valeur: '1 500+', libelle: 'membres et abonnés sur nos canaux' },
  { valeur: '6', libelle: 'entités partenaires à la JBAE 2025' },
];

export const missions = [
  {
    titre: 'Sensibiliser',
    texte: 'Nous faisons connaître l’actualité et les opportunités de l’aéronautique et du spatial.',
  },
  {
    titre: 'Former',
    texte: 'Nous encourageons la formation et le partage de connaissances, pour construire les compétences dont le pays a besoin.',
  },
  {
    titre: 'Connecter',
    texte: 'Nous créons un réseau entre sympathisants, étudiants, professionnels et experts du secteur.',
  },
];

export const fondateurs = [
  'Abdoul Salam Tankoano',
  'Dalil Osée Ouattara',
  'Salvador Lompo',
  'Najma Diarra',
  'Philipe Nebie',
];

export const partenaires2025 = [
  'GeniDrone',
  'Burkina Faso Flying Labs',
  'ANAC-BF',
  'Vikba&Co',
  'Nexus Maths',
  'SpaceAirMasters',
];

// L’histoire aérienne du Burkina Faso, de la page d’accueil.
export const histoire = [
  { annee: '1961', titre: 'Air Afrique', texte: 'Onze pays africains, dont le nôtre, créent une compagnie commune.' },
  { annee: '1967', titre: 'Air Volta', texte: 'Le 17 mars, le pays se dote de sa propre compagnie aérienne.' },
  { annee: '1984', titre: 'Air Burkina', texte: 'Air Volta devient Air Burkina et continue de relier le pays au continent.' },
  { annee: '2024', titre: 'L’IBAE', texte: 'Des étudiants burkinabè créent une initiative pour l’aéronautique et l’espace.' },
  { annee: '2025', titre: 'La première JBAE', texte: 'Ouaga 2000 accueille la première Journée Burkinabè de l’Aéronautique et de l’Espace.' },
];

export const mailto = (sujet: string) =>
  `mailto:${site.email}?subject=${encodeURIComponent(sujet)}`;

export const dateLongue = (d: Date) =>
  new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);
