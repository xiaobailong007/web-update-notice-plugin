export interface Options {
  /**
   * Interval to check for updates (in milliseconds)
   * @default 5 * 60 * 1000 (5 minutes)
   */
  checkInterval?: number;
  /**
   * Base URL for the version.json request
   * @default '/'
   */
  base?: string;
}

export function generateScript(version: string, checkInterval: number, base: string) {
  const baseUrl = base.endsWith('/') ? base : `${base}/`;
  
  return `
    (function() {
      try {
        const initialVersion = "${version}";
        const checkInterval = ${checkInterval};
        let hasShownUpdate = false;
        const baseUrl = "${baseUrl}";

        function showNotification() {
          if (document.getElementById('update-notification')) return;
          
          const div = document.createElement('div');
          div.id = 'update-notification';
          div.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #fff; box-shadow: 0 12px 48px rgba(0,0,0,0.15); border-radius: 16px; padding: 32px; z-index: 99999; display: flex; flex-direction: column; align-items: center; gap: 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; min-width: 340px; text-align: center;';
          
          div.innerHTML = \`
              <div style="width: 64px; height: 64px; background: #ecf5ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px;">
                  🚀
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                  <div style="font-size: 20px; font-weight: 600; color: #303133;">\\u53d1\\u73b0\\u65b0\\u7248\\u672c</div>
                  <div style="font-size: 14px; color: #606266;">\\u7cfb\\u7edf\\u5df2\\u66f4\\u65b0\\uff0c\\u5c06\\u5728 5 \\u79d2\\u540e\\u81ea\\u52a8\\u5237\\u65b0</div>
              </div>
              <div style="width: 100%; height: 4px; background: #f2f3f5; border-radius: 2px; overflow: hidden; margin-top: 8px;">
                  <div style="height: 100%; background: #409eff; animation: progress 5s linear forwards;"></div>
              </div>
              <style>
                  @keyframes progress { from { width: 0%; } to { width: 100%; } }
              </style>
          \`;
          
          document.body.appendChild(div);
          
          setTimeout(() => {
              window.location.reload();
          }, 5000);
        }

        function checkUpdate() {
          if (document.hidden) return;
          
          const versionUrl = baseUrl + 'version.json?t=' + Date.now();
          
          fetch(versionUrl)
            .then(res => {
              if (!res.ok) throw new Error('Network response was not ok');
              return res.json();
            })
            .then(data => {
              if (data.version && data.version !== initialVersion && !hasShownUpdate) {
                hasShownUpdate = true;
                showNotification();
              }
            })
            .catch(err => {
              console.warn('Failed to check version:', err);
            });
        }
        
        // Periodic check
        setInterval(checkUpdate, checkInterval);
        
        // Visibility check
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                checkUpdate();
            }
        });
      } catch (e) {
        console.error('Update check script error:', e);
      }
    })();
  `;
}