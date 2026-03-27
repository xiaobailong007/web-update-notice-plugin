import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    entry: ['src/vite.ts', 'src/nuxt.ts', 'src/webpack.ts'],
    format: ['esm'],
    dts: true,
    clean: true,
    deps: {
      neverBundle: ['vite', '@nuxt/kit', '@nuxt/schema', 'webpack', 'html-webpack-plugin']
    },
  }
});