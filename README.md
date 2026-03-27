# web-update-notice-plugin

一个轻量级的插件，当你的 Web 应用部署新版本时，它会自动通知用户刷新页面。

它的工作原理是在你的 HTML 中注入一段小脚本，定期检查版本变化。当检测到新版本时，它会显示一个友好的通知提示用户刷新，并在 5 秒后自动刷新页面。

✨ **同时支持 Vite、Nuxt 3/4 和 Webpack！** ✨

## 安装

使用你喜欢的包管理器安装该插件：

```bash
npm install @xiaobailong/web-update-notice-plugin -D
# 或者
pnpm add @xiaobailong/web-update-notice-plugin -D
# 或者
yarn add @xiaobailong/web-update-notice-plugin -D
```

## 使用方法

### 在 Vite 项目中

从 `vite` 子路径导入 Vite 插件，并将其添加到你的 `vite.config.ts` 中：

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import webUpdateNotice from '@xiaobailong/web-update-notice-plugin/vite';

export default defineConfig({
  plugins: [
    vue(),
    webUpdateNotice({
      // 选项
      checkInterval: 5 * 60 * 1000, // 每 5 分钟检查一次
    }),
  ],
});
```

### 在 Nuxt 3/4 项目中

将 `nuxt` 子路径的模块添加到你的 `nuxt.config.ts` 的 modules 数组中。你可以使用 `webUpdateNotice` 键来配置它：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@xiaobailong/web-update-notice-plugin/nuxt'
  ],
  
  webUpdateNotice: {
    // 选项
    checkInterval: 5 * 60 * 1000, // 每 5 分钟检查一次
    base: '/'
  }
})
```

### 在 Webpack 项目中

从 `webpack` 子路径导入插件，并将其添加到你的 `webpack.config.js` 的 `plugins` 数组中。注意：你需要同时使用 `html-webpack-plugin`。

```javascript
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { WebUpdateNoticePlugin } = require('@xiaobailong/web-update-notice-plugin/webpack');

module.exports = {
  // ... 其他配置
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new WebUpdateNoticePlugin({
      // 选项
      checkInterval: 5 * 60 * 1000, // 每 5 分钟检查一次
      base: '/'
    })
  ]
};
```

## 配置选项

Vite、Nuxt 和 Webpack 的实现共享相同的配置选项：

| 选项 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `checkInterval` | `number` | `60000` (1 分钟) | 脚本轮询检查更新的时间间隔（毫秒）。 |
| `base` | `string` | `'/'` | 你的应用部署的基础 URL 路径。用于构建获取 `version.json` 文件的 URL。 |
| `autoRefresh` | `boolean` | `true` | 发现更新时是否显示进度条并在倒计时结束后自动刷新页面。设为 `false` 则需要用户手动刷新。 |
| `showButtons` | `boolean` | `true` | 是否在通知弹窗中显示“稍后更新”和“立即刷新”按钮。 |
| `text` | `object` | `{}` | 自定义弹窗文案配置（详情见下方说明）。 |

### 自定义文案配置 (`text` 选项)

你可以通过 `text` 选项自定义通知弹窗中的所有文案：

```typescript
webUpdateNotice({
  text: {
    title: '发现新版本', // 弹窗标题
    desc: '系统已更新，请刷新页面', // 弹窗描述内容（如果 autoRefresh 为 true，默认会带有倒计时说明）
    cancel: '稍后更新', // 取消按钮文案
    confirm: '立即刷新' // 确认按钮文案
  }
})
```

## 工作原理

1. **构建时**：插件会生成一个包含当前构建时间戳的 `version.json` 文件。
2. **在浏览器中**：一段轻量级的脚本会被注入到你的 `index.html` 中。
3. **运行时**：该脚本会定期获取 `version.json`（绕过缓存），并将远程版本与加载时的版本进行比较。
4. **通知**：如果发现版本不一致，会显示一个 UI 通知。用户可以选择“稍后更新”以暂停刷新，或点击“立即刷新”快速加载新版本。当页面从隐藏状态重新变为可见时，它也会立即进行一次检查。

## 部署建议 (Nginx 配置)

为了确保用户在页面刷新时总是能获取到最新的 `index.html`（从而加载到最新的 JS/CSS 资源），强烈建议在 Nginx 中配置 **不缓存 `index.html`**：

```nginx
server {
    # 不缓存 index.html，确保每次刷新都拉取最新内容
    location / {
        try_files $uri $uri/ /index.html;
        
        if ($request_filename ~* ^.*?.(html|htm)$) {
            expires -1;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
    }
}
```

## 关注公众号

![公众号](https://raw.githubusercontent.com/xiaobailong007/web-update-notice-plugin/main/assets/qrcode.png)

## 开源协议

MIT
