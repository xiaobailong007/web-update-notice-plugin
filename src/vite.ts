import type { Plugin } from 'vite';
import { Options, generateScript } from './core';

export function webUpdateNotice(options: Options = {}): Plugin {
  const { checkInterval = 5 * 60 * 1000, base = '/' } = options;
  let version: string;

  return {
    name: 'vite-plugin-web-update-notice',
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
            children: generateScript(version, checkInterval, base),
            injectTo: 'body',
          },
        ],
      };
    },
  };
}

export default webUpdateNotice;