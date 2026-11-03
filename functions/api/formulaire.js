// Fonction Cloudflare Pages : reçoit les formulaires et les transmet à la feuille Google de l'association.
// Variables à définir dans Cloudflare Pages : FORMULAIRES_URL et FORMULAIRES_SECRET.

const CHAMPS = {
  contact: { requis: ['nom', 'email', 'objet', 'message', 'consentement'], options: [] },
  adhesion: {
    requis: ['nom', 'email', 'telephone', 'ville', 'pays', 'statut', 'motivation', 'consentement'],
    options: ['organisation', 'domaine', 'poles'],
  },
};

const LONGUEUR_MAX = 3000;
const DELAI_MIN_MS = 2500;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const accepteJson = (request) => (request.headers.get('accept') || '').includes('application/json');

const repondre = (request, ok, statut, code) => {
  if (accepteJson(request)) {
    return new Response(JSON.stringify({ ok, code }), {
      status: statut,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
    });
  }
  const url = new URL(request.url);
  return Response.redirect(`${url.origin}${ok ? '/merci/' : '/oups/'}`, 303);
};

const lireCorps = async (request) => {
  const type = request.headers.get('content-type') || '';
  if (type.includes('application/json')) return request.json();
  const form = await request.formData();
  const donnees = {};
  for (const [cle, valeur] of form) {
    donnees[cle] = donnees[cle] ? `${donnees[cle]}, ${valeur}` : String(valeur);
  }
  return donnees;
};

export async function onRequestPost({ request, env }) {
  const origine = request.headers.get('origin');
  if (origine && new URL(origine).host !== new URL(request.url).host) {
    return repondre(request, false, 403, 'origine');
  }

  let d;
  try {
    d = await lireCorps(request);
  } catch {
    return repondre(request, false, 400, 'corps');
  }

  if (!d || typeof d !== 'object' || !Object.hasOwn(CHAMPS, d.formulaire)) {
    return repondre(request, false, 400, 'formulaire');
  }
  const regles = CHAMPS[d.formulaire];

  // Pièges à robots : on répond « ok » sans rien enregistrer.
  const debut = Number(d.t0);
  if (d.site_web || (debut && Date.now() - debut < DELAI_MIN_MS)) return repondre(request, true, 200, 'ok');

  const propre = {};
  for (const champ of [...regles.requis, ...regles.options]) {
    const valeur = String(d[champ] ?? '').trim().slice(0, LONGUEUR_MAX);
    if (regles.requis.includes(champ) && !valeur) return repondre(request, false, 422, `manque:${champ}`);
    propre[champ] = valeur;
  }
  if (!EMAIL.test(propre.email)) return repondre(request, false, 422, 'email');

  if (!env.FORMULAIRES_URL || !env.FORMULAIRES_SECRET) return repondre(request, false, 503, 'configuration');

  try {
    const r = await fetch(env.FORMULAIRES_URL, {
      method: 'POST',
      headers: { 'content-type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ secret: env.FORMULAIRES_SECRET, formulaire: d.formulaire, donnees: propre }),
      redirect: 'follow',
    });
    const reponse = await r.json().catch(() => ({}));
    if (!r.ok || !reponse.ok) return repondre(request, false, 502, 'relais');
  } catch {
    return repondre(request, false, 502, 'relais');
  }

  return repondre(request, true, 200, 'ok');
}

export function onRequest() {
  return new Response('Méthode non autorisée', { status: 405, headers: { allow: 'POST' } });
}
