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
  { valeur: '700+', libelle: 'participants à nos webinaires', accent: true },
  { valeur: '2 100+', libelle: 'abonnés et membres sur nos réseaux' },
  { valeur: '4,27/5', libelle: 'appréciation de nos activités par les participants' },
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

// Équipe. L'identifiant donne le nom de la photo : src/assets/equipe/<id>.jpg
export const bureau = [
  {
    id: 'abdoul-salam-tankoano',
    nom: 'Abdoul Salam Tankoano',
    poste: 'Président du Bureau Exécutif',
    parcours: 'Ingénierie aérospatiale, UIR et IMT',
    mission: 'Porte la vision de l’IBAE, représente l’association et conduit ses relations extérieures.',
  },
  {
    id: 'salvador-lompo',
    nom: 'Salvador Lompo',
    poste: 'Secrétaire Général',
    parcours: 'Ingénierie aérospatiale, UIR',
    mission: 'Veille au respect des règles, tient le registre des membres et organise les adhésions.',
  },
  {
    id: 'najma-diarra',
    nom: 'Najma Diarra',
    poste: 'Responsable financière',
    parcours: 'Ingénierie aérospatiale, UIR',
    mission: 'Gère les comptes et les cotisations, établit le budget et monte les dossiers de financement.',
  },
  {
    id: 'philipe-nebie',
    nom: 'Philipe Nebie',
    poste: 'Responsable de la communication',
    parcours: 'Ingénierie aérospatiale, UIR',
    mission: 'Anime nos réseaux, notre site et notre newsletter, et veille sur notre identité visuelle.',
  },
  {
    id: 'dalil-osee-ouattara',
    nom: 'Dalil Osée Ouattara',
    poste: 'Responsable projets et événements',
    parcours: 'Ingénierie aérospatiale, ISAE-ENSMA',
    mission: 'Organise les webinaires et la JBAE, et pilote les projets de l’association.',
  },
];

export const coordination = [
  {
    id: 'coordinateur-national',
    nom: 'Isaac Ouedraogo',
    poste: 'Coordinateur national',
    parcours: 'Technicien en information de vol d’aérodrome (AFIS), SAFA',
    mission: 'Représente l’IBAE au Burkina Faso, anime l’équipe de terrain et informe le Bureau Exécutif.',
  },
  {
    id: 'coordinateur-national-adjoint',
    nom: 'Cheick Dera',
    poste: 'Coordinateur national adjoint',
    parcours: 'Électronique et automatisme, ESTA',
    mission: 'Seconde le coordinateur, suit les démarches administratives et appuie la logistique des événements.',
  },
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
