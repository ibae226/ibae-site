import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ibae.bf',
  integrations: [sitemap({ filter: (page) => !/\/(merci|oups)\/$/.test(page) })],
  build: { inlineStylesheets: 'auto' },
});
