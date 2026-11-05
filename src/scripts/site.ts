// Comportements du site. Tout le contenu reste lisible sans JavaScript.
import { code128, texteCode128 } from './code128';

const racine = document.documentElement;
const calme = () =>
  racine.classList.contains('calme') || matchMedia('(prefers-reduced-motion: reduce)').matches;
const lireStock = (cle: string) => {
  try {
    return localStorage.getItem(cle);
  } catch {
    return null;
  }
};
const ecrireStock = (cle: string, valeur: string) => {
  try {
    localStorage.setItem(cle, valeur);
  } catch {
    /* navigation privée : le choix ne sera pas conservé */
  }
};

/* En-tête : se cache en descendant, revient en remontant */
{
  const entete = document.querySelector<HTMLElement>('[data-entete]');
  let avant = scrollY;
  addEventListener(
    'scroll',
    () => {
      const y = scrollY;
      if (entete && !entete.querySelector('details[open]')) {
        entete.classList.toggle('cache', y > avant && y > 240);
      }
      avant = y;
    },
    { passive: true },
  );

  /* Menu mobile : se ferme avec Échap, au clic en dehors ou sur un lien */
  const menu = entete?.querySelector<HTMLDetailsElement>('details');
  if (menu) {
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.open) {
        menu.open = false;
        menu.querySelector('summary')?.focus();
      }
    });
    document.addEventListener('click', (e) => {
      const cible = e.target as Element;
      if (menu.open && (!menu.contains(cible) || cible.closest('a'))) menu.open = false;
    });
  }
}

/* Apparitions et compteurs */
{
  const formater = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const compter = (el: HTMLElement) => {
    const final = el.textContent ?? '';
    const morceaux = final.match(/^([\d\s]+)(?:,(\d+))?(.*)$/);
    if (!morceaux || calme()) return;
    const [, entier, decimales = '', suffixe] = morceaux;
    const cible = Number(`${entier.replace(/\D/g, '')}.${decimales || 0}`);
    if (!cible) return;
    const afficher = (n: number) =>
      decimales ? n.toFixed(decimales.length).replace('.', ',') : formater(Math.round(n));
    const debut = performance.now();
    const pas = (t: number) => {
      const p = Math.min((t - debut) / 1400, 1);
      const e = 1 - (1 - p) ** 3;
      el.textContent = p < 1 ? `${afficher(cible * e)}${suffixe}` : final;
      if (p < 1) requestAnimationFrame(pas);
    };
    requestAnimationFrame(pas);
  };

  const elements = document.querySelectorAll<HTMLElement>('[data-revele], [data-compte]');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(
      (entrees) => {
        for (const e of entrees) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.add('vu');
          if (el.hasAttribute('data-compte')) compter(el);
          obs.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px' },
    );
    elements.forEach((el) => obs.observe(el));
  } else {
    elements.forEach((el) => el.classList.add('vu'));
  }
}

/* Carrousels */
document.querySelectorAll<HTMLElement>('[data-carrousel]').forEach((racineC) => {
  const piste = racineC.querySelector<HTMLElement>('[data-piste]');
  if (!piste) return;
  const items = [...piste.children] as HTMLElement[];
  const points = racineC.querySelector<HTMLElement>('[data-points]');
  const pause = racineC.querySelector<HTMLButtonElement>('[data-pause]');
  let courant = 0;
  let minuteur = 0;
  let enPause = false;

  const boutons = items.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Aller à l’élément ${i + 1}`);
    b.addEventListener('click', () => aller(i));
    points?.appendChild(b);
    return b;
  });

  const marquer = () => boutons.forEach((b, i) => b.setAttribute('aria-current', String(i === courant)));

  function aller(i: number, fluide = true) {
    courant = (i + items.length) % items.length;
    piste!.scrollTo({ left: items[courant].offsetLeft, behavior: fluide && !calme() ? 'smooth' : 'auto' });
    marquer();
  }

  let attente = 0;
  piste.addEventListener(
    'scroll',
    () => {
      clearTimeout(attente);
      attente = window.setTimeout(() => {
        const x = piste.scrollLeft;
        const fin = x + piste.clientWidth >= piste.scrollWidth - 4;
        courant = fin
          ? items.length - 1
          : items.reduce((m, el, i) => (Math.abs(el.offsetLeft - x) < Math.abs(items[m].offsetLeft - x) ? i : m), 0);
        marquer();
      }, 90);
    },
    { passive: true },
  );

  racineC.querySelector('[data-prec]')?.addEventListener('click', () => aller(courant - 1));
  racineC.querySelector('[data-suiv]')?.addEventListener('click', () => aller(courant + 1));
  piste.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') aller(courant + 1);
    if (e.key === 'ArrowLeft') aller(courant - 1);
  });

  const lancer = () => {
    clearInterval(minuteur);
    if (racineC.dataset.auto && !enPause && !calme()) {
      minuteur = window.setInterval(() => aller(courant + 1), 6500);
    }
  };
  const stopper = () => clearInterval(minuteur);
  racineC.addEventListener('mouseenter', stopper);
  racineC.addEventListener('mouseleave', lancer);
  racineC.addEventListener('focusin', stopper);
  racineC.addEventListener('focusout', lancer);
  pause?.addEventListener('click', () => {
    enPause = !enPause;
    pause.textContent = enPause ? 'Lecture' : 'Pause';
    pause.setAttribute('aria-pressed', String(enPause));
    if (enPause) stopper();
    else lancer();
  });

  const cible = location.hash ? items.findIndex((el) => `#${el.id}` === location.hash) : -1;
  if (cible >= 0) {
    aller(cible, false);
    racineC.scrollIntoView();
  }
  addEventListener('hashchange', () => {
    const i = items.findIndex((el) => `#${el.id}` === location.hash);
    if (i >= 0) aller(i);
  });

  marquer();
  lancer();
});

/* Filtres des webinaires */
{
  const boutons = document.querySelectorAll<HTMLButtonElement>('[data-filtre]');
  const tuiles = document.querySelectorAll<HTMLElement>('[data-annee]');
  boutons.forEach((b) =>
    b.addEventListener('click', () => {
      boutons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      const f = b.dataset.filtre;
      tuiles.forEach((t) => {
        t.hidden = f !== 'tout' && t.dataset.annee !== f;
      });
    }),
  );
}

/* La Terre : globe WebGL, déplaçable à la souris ou au doigt */
document.querySelectorAll<HTMLElement>('[data-terre]').forEach((boite) => {
  const toile = boite.querySelector('canvas');
  const repere = boite.querySelector<HTMLElement>('.fin__repere');
  if (!toile) return;

  const nuanceur = `precision mediump float;
uniform sampler2D T;uniform float rot;uniform vec2 res;
const float TILT=-0.384;const float PI=3.14159265;
void main(){
  vec2 p=(gl_FragCoord.xy/res)*2.0-1.0;
  float R=0.965;float r=length(p)/R;
  if(r>1.0){float g=exp(-(r-1.0)*42.0)*0.34;gl_FragColor=vec4(vec3(0.14,0.40,0.66)*g,g);return;}
  float z=sqrt(1.0-r*r);vec3 n=vec3(p/R,z);
  float c=cos(TILT),s=sin(TILT);
  vec3 q=vec3(n.x,n.y*c+n.z*s,-n.y*s+n.z*c);
  float lat=asin(clamp(q.y,-1.0,1.0));float lon=atan(q.x,q.z)+rot;
  vec2 uv=vec2(fract(lon/(2.0*PI)+0.5),0.5-lat/PI);
  vec3 col=texture2D(T,uv).rgb;
  col*=0.34+0.66*pow(z,0.5);
  col+=vec3(0.20,0.48,0.72)*0.38*exp(-(1.0-r)*34.0);
  gl_FragColor=vec4(col,1.0);
}`;

  const gl = toile.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
  if (!gl) return;

  const compiler = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compiler(gl.VERTEX_SHADER, 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}'));
  gl.attachShader(prog, compiler(gl.FRAGMENT_SHADER, nuanceur));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const a = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(a);
  gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
  const uRot = gl.getUniformLocation(prog, 'rot');
  const uRes = gl.getUniformLocation(prog, 'res');

  const LON = (-1.52 * Math.PI) / 180;
  const LAT = (12.37 * Math.PI) / 180;
  const TILT = -0.384;
  let rot = LON;
  let vivant = false;
  let pret = false;
  let glisse = false;
  let xPrec = 0;
  let precedent = 0;

  const dimensionner = () => {
    const taille = Math.min(boite.clientWidth, 1400) * Math.min(devicePixelRatio || 1, 1.5);
    toile.width = toile.height = Math.round(taille);
    gl.viewport(0, 0, toile.width, toile.height);
    gl.uniform2f(uRes, toile.width, toile.height);
  };

  const dessiner = () => {
    gl.uniform1f(uRot, rot);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (repere) {
      const dl = LON - rot;
      const x = Math.cos(LAT) * Math.sin(dl);
      const y0 = Math.sin(LAT);
      const z0 = Math.cos(LAT) * Math.cos(dl);
      const c = Math.cos(TILT);
      const s = Math.sin(TILT);
      const y = y0 * c - z0 * s;
      const z = y0 * s + z0 * c;
      repere.style.opacity = z > 0.18 ? '1' : '0';
      repere.style.left = `${50 + x * 48.25}%`;
      repere.style.top = `${50 - y * 48.25}%`;
    }
  };

  const boucle = (ms: number) => {
    const dt = Math.min(ms - precedent, 60);
    precedent = ms;
    if (!glisse) rot -= dt * 0.00007;
    if (pret) dessiner();
    if (vivant && !calme()) requestAnimationFrame(boucle);
  };

  const image = new Image();
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    pret = true;
    dimensionner();
    dessiner();
    boite.classList.add('active');
  };

  new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting && !image.src) image.src = '/terre-texture.webp';
      const avant = vivant;
      vivant = e.isIntersecting;
      if (vivant && !avant) {
        precedent = performance.now();
        requestAnimationFrame(boucle);
      }
    },
    { rootMargin: '200px' },
  ).observe(boite);

  addEventListener('resize', () => {
    if (!pret) return;
    dimensionner();
    dessiner();
  });

  boite.addEventListener('pointerdown', (e) => {
    glisse = true;
    xPrec = e.clientX;
    boite.setPointerCapture(e.pointerId);
    boite.style.cursor = 'grabbing';
  });
  boite.addEventListener('pointermove', (e) => {
    if (!glisse) return;
    rot -= (e.clientX - xPrec) * 0.004;
    xPrec = e.clientX;
    if (calme() && pret) dessiner();
  });
  const lacher = () => {
    glisse = false;
    boite.style.cursor = '';
  };
  boite.addEventListener('pointerup', lacher);
  boite.addEventListener('pointercancel', lacher);
});

/* Bouton pause des animations */
{
  const b = document.querySelector<HTMLButtonElement>('[data-calme]');
  const texte = () => {
    if (b) b.textContent = racine.classList.contains('calme') ? 'Relancer les animations' : 'Mettre les animations en pause';
  };
  texte();
  b?.addEventListener('click', () => {
    const actif = racine.classList.toggle('calme');
    ecrireStock('ibae-calme', actif ? '1' : '0');
    texte();
    if (!actif) location.reload();
  });
}

/* Cookies */
{
  const CLE = 'ibae-consentement';
  const DUREE = 182 * 864e5;
  const bandeau = document.querySelector<HTMLElement>('[data-cookies-bandeau]');
  const dialogue = document.querySelector<HTMLDialogElement>('[data-cookies-dialogue]');
  const caseMesure = document.querySelector<HTMLInputElement>('[data-cookies-mesure]');

  const lire = (): { mesure: boolean; date: number } | null => {
    try {
      const v = JSON.parse(lireStock(CLE) ?? 'null');
      return v && Date.now() - v.date < DUREE ? v : null;
    } catch {
      return null;
    }
  };

  const chargerAudience = () => {
    const jeton = racine.dataset.audience;
    if (!jeton || document.getElementById('audience')) return;
    const s = document.createElement('script');
    s.id = 'audience';
    s.defer = true;
    s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    s.dataset.cfBeacon = JSON.stringify({ token: jeton });
    document.head.appendChild(s);
  };

  const enregistrer = (mesure: boolean) => {
    ecrireStock(CLE, JSON.stringify({ mesure, date: Date.now() }));
    if (bandeau) bandeau.hidden = true;
    if (mesure) chargerAudience();
  };

  const choix = lire();
  if (choix) {
    if (choix.mesure) chargerAudience();
  } else if (bandeau) {
    bandeau.hidden = false;
  }

  document.querySelectorAll<HTMLElement>('[data-cookies]').forEach((b) =>
    b.addEventListener('click', () => {
      const t = b.dataset.cookies;
      enregistrer(t === 'tout' ? true : t === 'choix' ? Boolean(caseMesure?.checked) : false);
    }),
  );
  document.querySelectorAll('[data-cookies-ouvrir]').forEach((b) =>
    b.addEventListener('click', () => {
      if (caseMesure) caseMesure.checked = Boolean(lire()?.mesure);
      dialogue?.showModal();
    }),
  );
}

/* Carte d'embarquement : le tampon tombe et le talon se détache quand l'adhésion est envoyée */
const embarquer = () => {
  const carte = document.querySelector<HTMLElement>('[data-carte]');
  if (!carte) return;
  carte.classList.add('embarque');
  const { top, bottom } = carte.getBoundingClientRect();
  if (top < 0 || bottom > innerHeight) {
    carte.scrollIntoView({ block: 'center', behavior: calme() ? 'auto' : 'smooth' });
  }
};

/* Formulaires */
document.querySelectorAll<HTMLFormElement>('form[data-formulaire]').forEach((f) => {
  const etat = f.querySelector<HTMLElement>('[data-etat]');
  const bouton = f.querySelector<HTMLButtonElement>('button[type="submit"]');
  const debut = f.querySelector<HTMLInputElement>('input[name="t0"]');
  if (debut) debut.value = String(Date.now());

  const objet = new URLSearchParams(location.search).get('objet');
  const select = f.querySelector<HTMLSelectElement>('select[name="objet"]');
  if (objet && select && [...select.options].some((o) => o.value === objet)) select.value = objet;

  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!f.reportValidity()) return;
    const donnees: Record<string, string> = {};
    new FormData(f).forEach((v, k) => {
      const texte = String(v);
      donnees[k] = donnees[k] ? `${donnees[k]}, ${texte}` : texte;
    });
    if (bouton) bouton.disabled = true;
    if (etat) {
      etat.dataset.type = '';
      etat.textContent = 'Envoi en cours…';
    }
    try {
      const r = await fetch('/api/formulaire', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(donnees),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) throw new Error('envoi');
      f.reset();
      embarquer();
      if (etat) {
        etat.dataset.type = 'ok';
        etat.textContent = f.dataset.merci ?? 'Merci, votre message est bien envoyé.';
      }
    } catch {
      if (etat) {
        etat.dataset.type = 'erreur';
        etat.textContent = 'L’envoi n’a pas abouti. Réessayez ou écrivez-nous à ibae.bf@gmail.com.';
      }
    } finally {
      if (bouton) bouton.disabled = false;
    }
  });
});

/* Carte d'embarquement de la page d'adhésion : elle se remplit pendant la saisie */
{
  const carte = document.querySelector<HTMLElement>('[data-carte]');
  if (carte) {
    const champ = (nom: string) => document.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${nom}"]`);
    const nom = champ('nom');
    const ville = champ('ville');
    const statut = champ('statut');
    const ecrire = (cle: string, texte: string) =>
      carte.querySelectorAll(`[data-carte-${cle}]`).forEach((el) => {
        el.textContent = texte;
      });

    const barres = carte.querySelector('[data-carte-barres]');
    const empreinte = (texte: string) => [...texte].reduce((h, c) => (Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0), 2166136261);

    const maj = () => {
      const n = nom?.value.trim() ?? '';
      const v = ville?.value.trim() ?? '';
      const code = texteCode128(v).replace(/[^A-Z]/g, '').slice(0, 3);
      ecrire('nom', n || 'Votre nom');
      ecrire('ville', v || 'Ouagadougou');
      ecrire('code', code.length === 3 ? code : 'OUA');
      ecrire('statut', statut?.value || 'À choisir');
      const h = empreinte(n);
      ecrire('siege', n ? `${(h % 30) + 1}${'ABCDEF'[(h >>> 8) % 6]}` : '1A');

      const contenu = n ? `IBAE ${texteCode128(n).slice(0, 16)}`.trim() : 'IBAE.BF';
      const { trace, largeur } = code128(contenu);
      ecrire('code-barres', contenu);
      barres?.setAttribute('viewBox', `0 0 ${largeur} 40`);
      barres?.querySelector('path')?.setAttribute('d', trace);
    };

    ecrire(
      'date',
      new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }).replace('.', '').toUpperCase(),
    );
    [nom, ville, statut].forEach((c) => c?.addEventListener('input', maj));
    maj();
  }
}
