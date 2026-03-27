# web-update-notice-plugin

[![npm version](https://img.shields.io/npm/v/@xiaobailong/web-update-notice-plugin.svg)](https://www.npmjs.com/package/@xiaobailong/web-update-notice-plugin)
[![npm downloads](https://img.shields.io/npm/dm/@xiaobailong/web-update-notice-plugin.svg)](https://www.npmjs.com/package/@xiaobailong/web-update-notice-plugin)
[![License](https://img.shields.io/npm/l/@xiaobailong/web-update-notice-plugin.svg)](https://github.com/xiaobailong007/web-update-notice-plugin/blob/main/LICENSE)

一个轻量级的前端更新通知插件。当你的 Web 应用部署新版本时，它会自动检测并通知用户刷新页面，确保用户始终访问最新内容。

它的工作原理是在构建时生成版本文件，并在 HTML 中注入一段极小的检测脚本。当检测到远程版本与本地加载版本不一致时，会显示一个友好的通知弹窗提示用户，并在倒计时后自动刷新页面。

## ✨ 特性

- 📦 **多构建工具支持**：无缝集成 **Vite**、**Nuxt 3/4** 和 **Webpack**。
- 🪶 **极简轻量**：仅注入必要的内联脚本，不增加额外的打包体积。
- 🔄 **智能检测**：支持定时轮询检查，且在页面从隐藏恢复可见时（Visibility API）立即触发检查。
- 🎨 **高度定制化**：检查间隔、UI 文案、是否自动刷新等均可自由配置。
- 🛡️ **无惧缓存**：自带防缓存策略，精准绕过强缓存获取最新版本信息。

## 📦 安装

使用你喜欢的包管理器进行安装：

```bash
npm install @xiaobailong/web-update-notice-plugin -D
# 或者
pnpm add @xiaobailong/web-update-notice-plugin -D
# 或者
yarn add @xiaobailong/web-update-notice-plugin -D
```

## 🚀 使用方法

### ⚡️ 在 Vite 项目中

从 `vite` 子路径导入插件，并将其添加到 `vite.config.ts` 中：

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import webUpdateNotice from '@xiaobailong/web-update-notice-plugin/vite';

export default defineConfig({
  plugins: [
    vue(),
    webUpdateNotice({
      // 插件选项
      checkInterval: 5 * 60 * 1000, // 每 5 分钟检查一次
    }),
  ],
});
```

### 🏔️ 在 Nuxt 3/4 项目中

将 `nuxt` 子路径的模块添加到 `nuxt.config.ts` 的 `modules` 数组中。你可以通过 `webUpdateNotice` 字段进行配置：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@xiaobailong/web-update-notice-plugin/nuxt'
  ],
  
  webUpdateNotice: {
    // 插件选项
    checkInterval: 5 * 60 * 1000, // 每 5 分钟检查一次
    base: '/'
  }
})
```

### 🛠️ 在 Webpack 项目中

从 `webpack` 子路径导入插件，并添加到 `webpack.config.js` 的 `plugins` 数组中。
> **注意**：你需要配合 `html-webpack-plugin` 一起使用。

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
      // 插件选项
      checkInterval: 5 * 60 * 1000, // 每 5 分钟检查一次
      base: '/'
    })
  ]
};
```

## ⚙️ 配置选项

Vite、Nuxt 和 Webpack 的实现共享以下配置选项：

| 选项 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `checkInterval` | `number` | `60000` (1分钟) | 脚本轮询检查更新的时间间隔（单位：毫秒）。 |
| `base` | `string` | `'/'` | 应用部署的基础 URL 路径。用于拼接请求 `version.json` 文件的绝对路径。 |
| `autoRefresh` | `boolean` | `true` | 发现更新时是否显示倒计时进度条并在结束后自动刷新页面。设为 `false` 则强制用户手动点击刷新。 |
| `showButtons` | `boolean` | `true` | 是否在通知弹窗中显示“稍后更新”和“立即刷新”操作按钮。 |
| `text` | `object` | `{}` | 自定义弹窗 UI 的所有文本内容（详情见下方说明）。 |

### 📝 自定义文案配置 (`text`)

你可以通过 `text` 选项实现国际化或自定义弹窗中的文案：

```typescript
webUpdateNotice({
  text: {
    title: '✨ 发现新版本', // 弹窗标题
    desc: '系统已升级到最新版本，请刷新页面以体验新功能。', // 弹窗描述（若 autoRefresh 为 true，默认会追加倒计时提示）
    cancel: '稍后更新', // 取消/忽略按钮文案
    confirm: '立即刷新' // 确认刷新按钮文案
  }
})
```

## 💡 工作原理

1. **构建时 (Build)**：插件会在输出目录生成一个包含当前构建时间戳的 `version.json` 文件。
2. **注入脚本 (Inject)**：一段轻量级的检测脚本会被自动注入到你的 `index.html` 中。
3. **运行时 (Runtime)**：用户浏览器中的脚本会根据设定的 `checkInterval` 定期请求 `version.json`（自带防缓存参数），并将获取到的远程版本与页面初次加载时的版本进行对比。页面从后台切换回前台时，也会立即触发一次检测。
4. **通知与更新 (Notify)**：一旦发现版本不一致，即刻弹出 UI 通知。用户可选择“稍后更新”以继续当前操作，或点击“立即刷新”加载新版本；若开启了自动刷新，则在倒计时结束后自动重载。

## 🖧 部署建议 (Nginx 配置)

为确保版本更新机制绝对可靠，**强烈建议在 Nginx 中配置不缓存 `index.html`**。这样可以保证用户每次刷新都能拉取到最新的入口文件，进而加载最新的 JS/CSS 资源：

```nginx
server {
    # ... 其他配置
    
    location / {
        try_files $uri $uri/ /index.html;
        
        # 针对 HTML 文件禁用缓存
        if ($request_filename ~* ^.*?\.(html|htm)$) {
            expires -1;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
    }
}
```

## 🤝 关注作者

如果你觉得这个插件对你有帮助，欢迎关注我的公众号或添加微信交流：

| 微信公众号 | 作者微信 |
| :---: | :---: |
| <img src="https://raw.githubusercontent.com/xiaobailong007/web-update-notice-plugin/main/assets/WeChatOfficialAccount.jpg" alt="微信公众号" width="200" /> | <img src="https://raw.githubusercontent.com/xiaobailong007/web-update-notice-plugin/main/assets/WeChat.png" alt="作者微信" width="200" /> |

## 📄 开源协议

[MIT](./LICENSE) © xiaobailong007
