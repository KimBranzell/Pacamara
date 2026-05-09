import { defineConfig } from 'vite';
import { v4wp } from '@kucrut/vite-for-wp';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { purgeCSSPlugin } from '@fullhuman/postcss-purgecss';

const wpExternals = [
  'react',
  'react-dom',
  '@wordpress/blocks',
  '@wordpress/block-editor',
  '@wordpress/components',
  '@wordpress/element',
  '@wordpress/i18n',
  '@wordpress/primitives',
  '@wordpress/compose',
  '@wordpress/data',
];

const wpGlobals = {
  'react': 'React',
  'react-dom': 'ReactDOM',
};

function wordpressGlobalsPlugin() {
  return {
    name: 'wordpress-globals',
    generateBundle(options, bundle) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type !== 'chunk' || chunk.name !== 'heroBlock') continue;

        chunk.code = chunk.code.replace(
          /import\{([^}]*)\}from"@wordpress\/([^"]+)"/g,
          (match, names, module) => {
            const wpVar = module === 'block-editor' ? 'blockEditor' : module;
            const transformedNames = names.replace(/ as /g, ':');
            return `const{${transformedNames}}=wp.${wpVar};`;
          }
        );

        chunk.code = chunk.code.replace(
          /import\{([^}]*)\}from"(react|react-dom)"/g,
          (match, names, pkg) => {
            const transformedNames = names.replace(/ as /g, ':');
            return `const{${transformedNames}}=${wpGlobals[pkg]};`;
          }
        );
      }
    },
  };
}

export default defineConfig(({ command }) => ({
  plugins: [
    v4wp({
      input: {
        app: 'resources/js/app.js',
        svelteApp: 'resources/js/svelte/main.js',
        heroBlock: 'resources/js/blocks/hero/index.jsx'
      },
      outDir: 'public/build'
    }),
    svelte(),
    wordpressGlobalsPlugin(),
  ],
  publicDir: command === 'build' ? false : 'public',
  build: {
    sourcemap: command !== 'build',
    rollupOptions: {
      external: wpExternals,
    },
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
                  './blocks/**/*.{php,css}',
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
