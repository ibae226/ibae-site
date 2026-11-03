# Mettre le site en ligne sur ibae.bf

Compte environ 45 minutes. Tu as besoin de ton compte GitHub, du compte Cloudflare qui contient le domaine `ibae.bf` et du compte Google de l'association.

## 1. Vérifier le site sur ton PC (facultatif)

Ouvre un terminal dans `Desktop\IBAE\IBAE_Site\ibae-site`, puis :

```
npm.cmd install
npm.cmd run dev
```

Ouvre http://localhost:4321. Arrête avec `Ctrl + C`.

## 2. Compléter les informations manquantes

Ouvre `src/data/site.ts` et remplis si tu les as :

- `numeroEnregistrement` et `adresse` dans `legal` ;
- le lien `facebook` dans `reseaux`.

Un champ vide est simplement masqué.

## 3. Envoyer le code sur GitHub

1. Sur github.com, crée un dépôt **privé** nommé `ibae-site`. Ne coche rien : ni README, ni .gitignore, ni licence.
2. Dans le terminal, toujours dans le dossier `ibae-site`, lance ces commandes une par une.

```
git init -b main
git config user.name "IBAE"
git config user.email "ibae.bf@gmail.com"
git add .
git commit -m "Site IBAE"
git remote add origin https://github.com/ibae226/ibae-site.git
git push -u origin main
```

Remplace `ibae226` si tu utilises un autre compte GitHub. Les deux lignes `git config` évitent que ton adresse personnelle apparaisse dans l'historique du dépôt.

## 4. Créer le projet sur Cloudflare Pages

1. Connecte-toi à Cloudflare, sur le compte qui contient `ibae.bf`.
2. Ouvre **Workers & Pages**.
3. Clique sur **Create application**, puis **Pages**, puis **Connect to Git**.
4. Choisis **GitHub**, autorise Cloudflare, sélectionne le dépôt `ibae-site`, puis clique sur **Install & Authorize** et **Begin setup**.
5. Remplis ainsi :

| Champ | Valeur |
| --- | --- |
| Project name | `ibae-site` |
| Production branch | `main` |
| Framework preset | `Astro` |
| Build command | `npm run build` |
| Build output directory | `dist` |

6. Clique sur **Save and Deploy**. La construction prend quelques minutes.
7. Ouvre l'adresse en `.pages.dev` que Cloudflare affiche et vérifie le site.

Si la construction échoue à cause de Node, ajoute la variable `NODE_VERSION` = `22.23.4` dans **Settings**, **Variables and Secrets**, puis relance.

## 5. Brancher ibae.bf

1. Dans le projet Pages, ouvre **Custom domains**, puis **Set up a domain**.
2. Saisis `ibae.bf`, clique sur **Continue** et confirme. Cloudflare crée lui-même l'enregistrement DNS.
3. Recommence avec `www.ibae.bf`.
4. Attends que les deux domaines passent en **Active**, puis ouvre https://ibae.bf.

Le domaine doit être dans le **même compte Cloudflare** que le projet Pages. Sinon, Cloudflare refusera `ibae.bf`.

S'il y a un conflit avec un ancien enregistrement `A`, `AAAA` ou `CNAME` sur `ibae.bf` ou `www`, va dans **DNS**, note sa valeur et supprime-le, puis recommence. Ne touche pas aux enregistrements `MX` ni `TXT` : ils servent aux emails.

## 6. Activer les formulaires

Sans cette étape, le site fonctionne, mais les formulaires affichent une erreur. Les réponses arriveront dans une feuille Google et par email sur ibae.bf@gmail.com. Pour obtenir un fichier Excel, ouvre la feuille, puis **Fichier**, **Télécharger**, **Microsoft Excel (.xlsx)**.

### Dans Google

1. Ouvre une fenêtre de navigation privée, connecte-toi uniquement avec le compte de l'association et crée une feuille Google nommée `Formulaires IBAE`. Apps Script gère mal plusieurs comptes connectés. Ne crée aucune colonne : le script s'en charge.
2. Ouvre **Extensions**, puis **Apps Script**.
3. Efface le contenu, colle celui de `outils/google-apps-script.gs` et enregistre.
4. Crée un secret. Dans PowerShell :

```
[guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N")
```

5. Dans Apps Script, ouvre **Paramètres du projet**, puis **Propriétés du script**. Ajoute la propriété `SECRET` avec cette valeur.
6. Clique sur **Déployer**, **Nouveau déploiement**, choisis **Application Web**.
7. Choisis **Exécuter en tant que : Moi** et **Qui a accès : Tout le monde**, puis **Déployer**. Google demandera d'autoriser l'accès à la feuille et l'envoi d'emails. S'il indique que l'application n'est pas validée, c'est normal pour ton propre script : clique sur **Paramètres avancés**, sur le lien d'accès au projet, puis sur **Autoriser**.
8. Copie l'adresse qui se termine par `/exec`.

« Tout le monde » est nécessaire, car Cloudflare appelle le script sans compte Google. Le secret empêche les autres de s'en servir. Ne le mets jamais dans le code ni sur GitHub.

### Dans Cloudflare

1. Dans le projet Pages, ouvre **Settings**, puis **Variables and Secrets**.
2. Ajoute pour **Production** :

| Type | Nom | Valeur |
| --- | --- | --- |
| Text | `FORMULAIRES_URL` | l'adresse `/exec` |
| Secret | `FORMULAIRES_SECRET` | le secret créé plus haut |

3. Ouvre **Deployments**, puis relance le dernier déploiement avec **Retry deployment**.
4. Envoie un message depuis https://ibae.bf/contact/ et vérifie la feuille et ta boîte mail.

Si tu modifies le script plus tard, crée une nouvelle version dans **Déployer**, **Gérer les déploiements**, sans changer d'adresse.

## 7. Mesurer l'audience (facultatif)

1. Dans Cloudflare, ouvre **Web Analytics** et ajoute le site `ibae.bf`.
2. Choisis la pose manuelle du code et copie la valeur `token`.
3. Colle-la dans `jetonAudience` de `src/data/site.ts`, puis publie.

N'active pas l'option automatique de Web Analytics dans le projet Pages : elle chargerait l'outil sans attendre l'accord du visiteur, alors que le bandeau de cookies promet le contraire.

## 8. Publier une modification

Après chaque changement, dans le dossier du site :

```
git add .
git commit -m "Décris ton changement"
git push
```

Cloudflare republie le site tout seul en quelques minutes.

## Avant d'annoncer le site

- Vérifie que les personnes visibles sur les photos sont d'accord, en particulier celle de l'accueil.
- Vérifie le crédit photo dans les mentions légales.
- Fais relire les mentions légales et la confidentialité, surtout les durées de conservation, puis renseigne-toi sur les formalités auprès de la CIL.

## En cas de problème

| Message | Cause probable |
| --- | --- |
| `npm.ps1 cannot be loaded` | Utilise `npm.cmd` au lieu de `npm`. |
| Le formulaire affiche une erreur | Variables absentes, ou déploiement non relancé après leur ajout. |
| Rien n'arrive dans la feuille | Adresse `/exec` incorrecte, secret différent, ou script non déployé pour « Tout le monde ». |
| Cloudflare refuse `ibae.bf` | Le domaine est sur un autre compte, ou un ancien enregistrement DNS bloque. |
