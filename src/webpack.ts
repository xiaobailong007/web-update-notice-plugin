import { Compiler, Compilation } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Options, generateScript } from './core';

export class WebUpdateNoticePlugin {
  private options: Options;
  private version: string;

  constructor(options: Options = {}) {
    this.options = {
      checkInterval: 5 * 60 * 1000,
      base: '/',
      ...options,
    };
    this.version = Date.now().toString();
  }

  apply(compiler: Compiler) {
    const pluginName = 'WebUpdateNoticePlugin';

    // 1. Emit version.json asset
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        (assets) => {
          const content = JSON.stringify({ version: this.version });
          compilation.emitAsset(
            'version.json',
            new compiler.webpack.sources.RawSource(content)
          );
        }
      );
    });

    // 2. Inject script into HTML
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      // HtmlWebpackPlugin hook
      if (HtmlWebpackPlugin && HtmlWebpackPlugin.getHooks) {
        HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(
          pluginName,
          (data, cb) => {
            const scriptContent = generateScript(
              this.version,
              this.options.checkInterval!,
              this.options.base!
            );

            // Add script tag to body
            data.assetTags.scripts.push({
              tagName: 'script',
              voidTag: false,
              meta: { plugin: pluginName },
              innerHTML: scriptContent,
              attributes: {}
            });

            cb(null, data);
          }
        );
      }
    });
  }
}

export default WebUpdateNoticePlugin;