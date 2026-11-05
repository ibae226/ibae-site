import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projets = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projets' }),
  schema: ({ image }) =>
    z.object({
      titre: z.string(),
      statut: z.enum(['realise', 'preparation']),
      ordre: z.number(),
      resume: z.string(),
      image: image(),
      alt: z.string(),
      legende: z.string().optional(),
      lien: z.string().optional(),
      lienTexte: z.string().optional(),
    }),
});

const personne = z.object({ nom: z.string(), role: z.string() });

const webinaires = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/webinaires' }),
  schema: ({ image }) =>
    z.object({
      titre: z.string(),
      sousTitre: z.string().optional(),
      date: z.coerce.date(),
      heure: z.string().optional(),
      plateforme: z.string(),
      serie: z.string().optional(),
      affiche: image(),
      alt: z.string(),
      intervenants: z.array(personne),
      prive: z.boolean().default(false),
      moderateur: personne.optional(),
      chiffres: z.array(z.object({ valeur: z.string(), libelle: z.string() })).default([]),
      citation: z.string().optional(),
      replay: z.string().optional(),
    }),
});

const actualites = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/actualites' }),
  schema: ({ image }) =>
    z.object({
      titre: z.string(),
      date: z.coerce.date(),
      resume: z.string(),
      image: image(),
      alt: z.string(),
      credit: z.string().optional(),
    }),
});

export const collections = { projets, webinaires, actualites };
