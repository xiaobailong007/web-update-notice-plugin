Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_core = require("./core-7Bqx-wyY.cjs");
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
					children: require_core.generateScript(version, options),
					injectTo: "body"
				}]
			};
		}
	};
}
//#endregion
exports.webUpdateNotice = webUpdateNotice;
