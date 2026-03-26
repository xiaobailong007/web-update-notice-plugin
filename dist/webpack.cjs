Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
const require_core = require("./core-7Bqx-wyY.cjs");
let webpack = require("webpack");
let html_webpack_plugin = require("html-webpack-plugin");
html_webpack_plugin = __toESM(html_webpack_plugin);
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
				stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
			}, (assets) => {
				const content = JSON.stringify({ version: this.version });
				compilation.emitAsset("version.json", new compiler.webpack.sources.RawSource(content));
			});
		});
		compiler.hooks.compilation.tap(pluginName, (compilation) => {
			if (html_webpack_plugin.default && html_webpack_plugin.default.getHooks) html_webpack_plugin.default.getHooks(compilation).alterAssetTags.tapAsync(pluginName, (data, cb) => {
				const scriptContent = require_core.generateScript(this.version, this.options);
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
exports.WebUpdateNoticePlugin = WebUpdateNoticePlugin;
exports.default = WebUpdateNoticePlugin;
exports.__toESM = __toESM;
