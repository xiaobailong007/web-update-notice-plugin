//#region src/core.ts
function scriptTemplate(version, options) {
	try {
		const initialVersion = version;
		let hasShownUpdate = false;
		const checkInterval = options.checkInterval || 6e4;
		const base = options.base || "/";
		const baseUrl = base.endsWith("/") ? base : `${base}/`;
		const autoRefresh = options.autoRefresh !== false;
		const showButtons = options.showButtons !== false;
		const text = options.text || {};
		const titleText = text.title || "发现新版本";
		const descText = text.desc || (autoRefresh ? "系统已更新，将在 <span id=\"update-countdown\">5</span> 秒后自动刷新" : "系统已更新，请刷新页面");
		const cancelText = text.cancel || "稍后更新";
		const confirmText = text.confirm || "立即刷新";
		function showNotification() {
			if (document.getElementById("update-notification")) return;
			const div = document.createElement("div");
			div.id = "update-notification";
			div.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #fff; box-shadow: 0 12px 48px rgba(0,0,0,0.15); border-radius: 16px; padding: 32px; z-index: 99999; display: flex; flex-direction: column; align-items: center; gap: 20px; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif; min-width: 340px; text-align: center;";
			div.innerHTML = `
          <div style="width: 64px; height: 64px; background: #ecf5ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px;">
              🚀
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="font-size: 20px; font-weight: 600; color: #303133;">${titleText}</div>
              <div style="font-size: 14px; color: #606266;">${descText}</div>
          </div>
          ${autoRefresh ? `
          <div style="width: 100%; height: 4px; background: #f2f3f5; border-radius: 2px; overflow: hidden; margin-top: 8px;">
              <div id="update-progress-bar" style="height: 100%; background: #409eff; animation: progress 5s linear forwards;"></div>
          </div>
          ` : ""}
          ${showButtons ? `
          <div style="display: flex; gap: 12px; margin-top: 12px; width: 100%;">
              <button id="update-cancel-btn" style="flex: 1; padding: 8px 16px; border: 1px solid #dcdfe6; background: #fff; color: #606266; border-radius: 4px; cursor: pointer; font-size: 14px; transition: all 0.2s;">${cancelText}</button>
              <button id="update-confirm-btn" style="flex: 1; padding: 8px 16px; border: none; background: #409eff; color: #fff; border-radius: 4px; cursor: pointer; font-size: 14px; transition: all 0.2s;">${confirmText}</button>
          </div>
          ` : ""}
          <style>
              @keyframes progress { from { width: 0%; } to { width: 100%; } }
              #update-cancel-btn:hover { background: #f5f7fa; color: #409eff; border-color: #c6e2ff; }
              #update-confirm-btn:hover { background: #66b1ff; }
          </style>
      `;
			document.body.appendChild(div);
			let countdown = 5;
			const countdownEl = document.getElementById("update-countdown");
			const cancelBtn = document.getElementById("update-cancel-btn");
			const confirmBtn = document.getElementById("update-confirm-btn");
			const progressBar = document.getElementById("update-progress-bar");
			let timer;
			if (autoRefresh) timer = setInterval(() => {
				countdown--;
				if (countdownEl) countdownEl.innerText = countdown.toString();
				if (countdown <= 0) {
					clearInterval(timer);
					window.location.reload();
				}
			}, 1e3);
			if (cancelBtn) cancelBtn.onclick = () => {
				clearInterval(timer);
				if (progressBar) progressBar.style.animationPlayState = "paused";
				document.body.removeChild(div);
			};
			if (confirmBtn) confirmBtn.onclick = () => {
				clearInterval(timer);
				window.location.reload();
			};
		}
		function checkUpdate() {
			if (document.hidden) return;
			const versionUrl = baseUrl + "version.json?t=" + Date.now();
			fetch(versionUrl).then((res) => {
				if (!res.ok) throw new Error("Network response was not ok");
				return res.json();
			}).then((data) => {
				if (data.version && data.version !== initialVersion && !hasShownUpdate) {
					hasShownUpdate = true;
					showNotification();
				}
			}).catch((err) => {
				console.warn("Failed to check version:", err);
			});
		}
		setInterval(checkUpdate, checkInterval);
		document.addEventListener("visibilitychange", () => {
			if (document.visibilityState === "visible") checkUpdate();
		});
	} catch (e) {
		console.error("Update check script error:", e);
	}
}
function generateScript(version, options) {
	return `(${scriptTemplate.toString()})("${version}", ${JSON.stringify(options)});`;
}
//#endregion
export { generateScript as t };
