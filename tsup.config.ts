import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/vite.ts', 'src/nuxt.ts', 'src/webpack.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: ['vite', '@nuxt/kit', '@nuxt/schema', 'webpack', 'html-webpack-plugin'],
});