import { defineConfig } from 'vite';
import { v4wp } from '@kucrut/vite-for-wp';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { purgeCSSPlugin } from '@fullhuman/postcss-purgecss';

export default defineConfig(({ command }) => ({
  plugins: [
    v4wp({
      input: {
        app: 'resources/js/app.js',
        svelteApp: 'resources/js/svelte/main.js'
      },
      outDir: 'public/build'
    }),
    svelte()
  ],
  publicDir: command === 'build' ? false : 'public',
  build: {
    sourcemap: command !== 'build'
  },
  css: {
    postcss: {
      plugins:
        command === 'build'
          ? [
              purgeCSSPlugin({
                content: [
                  './resources/**/*.{js,svelte}',
                  './parts/**/*.html',
                  './templates/**/*.html',
                  './patterns/**/*.php',
                  './*.php'
                ],
                defaultExtractor: (content) => content.match(/[A-Za-z0-9-_:/]+/g) || [],
                safelist: {
                  standard: [
                    'current-menu-item',
                    'current-menu-parent',
                    'menu-item-has-children',
                    'screen-reader-text'
                  ],
                  deep: [/^wp-/, /^is-/, /^has-/, /^align/]
                }
              })
            ]
          : []
    }
  }
}));