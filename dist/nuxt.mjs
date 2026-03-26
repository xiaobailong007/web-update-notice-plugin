import { t as generateScript } from "./core-By7uh7u6.mjs";
import { defineNuxtModule } from "@nuxt/kit";
//#region src/nuxt.ts
var nuxt_default = defineNuxtModule({
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
			innerHTML: generateScript(version, options)
		});
	}
});
//#endregion
export { nuxt_default as default };
