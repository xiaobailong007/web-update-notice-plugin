import { defineNuxtModule } from '@nuxt/kit';
import { Options, generateScript } from './core';

export default defineNuxtModule<Options>({
  meta: {
    name: 'web-update-notice',
    configKey: 'webUpdateNotice',
  },
  defaults: {
    checkInterval: 1 * 60 * 1000,
    base: '/',
  },
  setup(options, nuxt) {
    const version = Date.now().toString();
    const checkInterval = options.checkInterval!;
    const base = options.base!;

    // 1. Add a virtual server route to serve version.json
    const nuxtOptions = nuxt.options as any;
    nuxtOptions.nitro = nuxtOptions.nitro || {};
    nuxtOptions.nitro.routeRules = nuxtOptions.nitro.routeRules || {};
    nuxtOptions.nitro.routeRules['/version.json'] = {
      prerender: true,
      headers: { 'Content-Type': 'application/json' },
    };

    // Use nitro:config to add a virtual handler
    nuxt.hook('nitro:config', (nitroConfig: any) => {
      nitroConfig.virtual = nitroConfig.virtual || {};
      nitroConfig.virtual['#version-handler'] = `
        import { defineEventHandler } from 'h3';
        export default defineEventHandler(() => ({ version: "${version}" }));
      `;

      nitroConfig.handlers = nitroConfig.handlers || [];
      nitroConfig.handlers.push({
        route: '/version.json',
        handler: '#version-handler',
        method: 'get',
      });
    });

    // 2. Inject the update check script into the HTML body
    nuxt.options.app.head.script = nuxt.options.app.head.script || [];
    nuxt.options.app.head.script.push({
      tagPosition: 'bodyClose',
      innerHTML: generateScript(version, checkInterval, base),
    });
  },
});