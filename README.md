# web-update-notice-plugin

一个轻量级的插件，当你的 Web 应用部署新版本时，它会自动通知用户刷新页面。

它的工作原理是在你的 HTML 中注入一段小脚本，定期检查版本变化。当检测到新版本时，它会显示一个友好的通知提示用户刷新，并在 5 秒后自动刷新页面。

✨ **同时支持 Vite、Nuxt 3 和 Webpack！** ✨

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

### 在 Nuxt 3 项目中

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
| `checkInterval` | `number` | `300000` (5 分钟) | 脚本轮询检查更新的时间间隔（毫秒）。 |
| `base` | `string` | `'/'` | 你的应用部署的基础 URL 路径。用于构建获取 `version.json` 文件的 URL。 |

## 工作原理

1. **构建时**：插件会生成一个包含当前构建时间戳的 `version.json` 文件。
2. **在浏览器中**：一段轻量级的脚本会被注入到你的 `index.html` 中。
3. **运行时**：该脚本会定期获取 `version.json`（绕过缓存），并将远程版本与加载时的版本进行比较。
4. **通知**：如果发现版本不一致，会显示一个 UI 通知，并在短暂延迟后自动刷新页面。当页面从隐藏状态重新变为可见时，它也会立即进行一次检查。

## 开源协议

MIT
