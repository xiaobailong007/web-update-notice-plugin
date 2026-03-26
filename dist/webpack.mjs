import { t as generateScript } from "./core-By7uh7u6.mjs";
import { Compilation } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
//#region src/webpack.ts
var WebUpdateNoticePlugin = class {
	options;
	version;
	constructor(options = {}) {
		this.options = options;
		this.version = Date.now().toString();
	}
	apply(compiler) {
		const pluginName = "WebUpdateNoticePlugin";
		compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
			compilation.hooks.processAssets.tap({
				name: pluginName,
				stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
			}, (assets) => {
				const content = JSON.stringify({ version: this.version });
				compilation.emitAsset("version.json", new compiler.webpack.sources.RawSource(content));
			});
		});
		compiler.hooks.compilation.tap(pluginName, (compilation) => {
			if (HtmlWebpackPlugin && HtmlWebpackPlugin.getHooks) HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(pluginName, (data, cb) => {
				const scriptContent = generateScript(this.version, this.options);
				data.assetTags.scripts.push({
					tagName: "script",
					voidTag: false,
					meta: { plugin: pluginName },
					innerHTML: scriptContent,
					attributes: {}
				});
				cb(null, data);
			});
		});
	}
};
//#endregion
export { WebUpdateNoticePlugin, WebUpdateNoticePlugin as default };
