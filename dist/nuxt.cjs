const require_core = require("./core-7Bqx-wyY.cjs");
require("./webpack.cjs");
//#region src/nuxt.ts
var nuxt_default = (0, require("@nuxt/kit").defineNuxtModule)({
	meta: {
		name: "web-update-notice",
		configKey: "webUpdateNotice"
	},
	setup(options, nuxt) {
		const version = Date.now().toString();
		const nuxtOptions = nuxt.options;
		nuxtOptions.nitro = nuxtOptions.nitro || {};
		nuxtOptions.nitro.routeRules = nuxtOptions.nitro.routeRules || {};
		nuxtOptions.nitro.routeRules["/version.json"] = {
			prerender: true,
			headers: { "Content-Type": "application/json" }
		};
		nuxt.hook("nitro:config", (nitroConfig) => {
			nitroConfig.virtual = nitroConfig.virtual || {};
			nitroConfig.virtual["#version-handler"] = `
        import { defineEventHandler } from 'h3';
        export default defineEventHandler(() => ({ version: "${version}" }));
      `;
			nitroConfig.handlers = nitroConfig.handlers || [];
			nitroConfig.handlers.push({
				route: "/version.json",
				handler: "#version-handler",
				method: "get"
			});
		});
		nuxt.options.app.head.script = nuxt.options.app.head.script || [];
		nuxt.options.app.head.script.push({
			tagPosition: "bodyClose",
			innerHTML: require_core.generateScript(version, options)
		});
	}
});
//#endregion
module.exports = nuxt_default;
