# Site de l'IBAE

Site officiel de l'Initiative Burkinabè pour l'Aéronautique et l'Espace. Site statique Astro, hébergé sur Cloudflare Pages. Les formulaires passent par une petite fonction Cloudflare et arrivent dans une feuille Google de l'association.

## Modifier le contenu

| Ce que tu veux changer | Où |
| --- | --- |
| Email, réseaux, chiffres, missions, partenaires, frise, mentions légales | `src/data/site.ts` |
| Bureau Exécutif et Coordination nationale | `bureau` et `coordination` dans `src/data/site.ts` |
| Métiers, voies d'études, écoles, bourses | `src/data/orientation.ts` |
| Un webinaire | `src/content/webinaires/` |
| Une actualité | `src/content/actualites/` |
| Un projet | `src/content/projets/` |
| Les photos | `src/assets/` |

Un lien ou un champ légal laissé vide est masqué sur le site.

### Ajouter la photo d'un membre

Dépose un portrait dans `src/assets/equipe/`, nommé comme l'identifiant `id` du membre dans `src/data/site.ts`, par exemple `salvador-lompo.jpg`. Il remplace tout seul la silhouette provisoire.

### Ajouter un webinaire

1. Mets l'affiche dans `src/assets/webinaires/`.
2. Copie un fichier de `src/content/webinaires/` et renomme-le avec la date, par exemple `2026-11-14-mon-theme.md`.
3. Change le titre, la date, l'affiche, les intervenants et le texte. Ajoute les `chiffres` et le lien `replay` si tu les as. Ils n'apparaissent que s'ils sont remplis.

La page, la tuile, les statistiques de la page Webinaires et le précédent/suivant se mettent à jour tout seuls.

Chaque modification envoyée sur la branche `main` republie le site automatiquement.

## Travailler sur le site en local

Sous Windows, utilise `npm.cmd` à la place de `npm` si PowerShell bloque la commande.

```
npm.cmd install
npm.cmd run dev
```

Le site s'ouvre sur http://localhost:4321. `npm.cmd run build` produit la version finale dans `dist/`. Il faut Node 22.23.4 ou plus récent.

Les formulaires ne fonctionnent pas avec `npm.cmd run dev` : ils ont besoin de la fonction Cloudflare. Ils se testent une fois le site déployé.

## Mise en ligne

Voir `DEPLOIEMENT.md`.
