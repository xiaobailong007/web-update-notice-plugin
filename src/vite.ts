import type { PluginOption } from 'vite';
import { Options, generateScript } from './core';

export function webUpdateNotice(options: Options = {}): PluginOption {
  let version: string;

  return {
    name: 'vite-plugin-web-update-notice' as const,
    configResolved() {
      version = Date.now().toString();
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify({ version }),
      });
    },
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'script',
            children: generateScript(version, options),
            injectTo: 'body',
          },
        ],
      };
    },
  };
}

export default webUpdateNotice;