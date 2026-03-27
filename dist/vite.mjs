import { t as generateScript } from "./core-By7uh7u6.mjs";
//#region src/vite.ts
function webUpdateNotice(options = {}) {
	let version;
	return {
		name: "vite-plugin-web-update-notice",
		configResolved() {
			version = Date.now().toString();
		},
		generateBundle() {
			this.emitFile({
				type: "asset",
				fileName: "version.json",
				source: JSON.stringify({ version })
			});
		},
		transformIndexHtml(html) {
			return {
				html,
				tags: [{
					tag: "script",
					children: generateScript(version, options),
					injectTo: "body"
				}]
			};
		}
	};
}
//#endregion
export { webUpdateNotice };
