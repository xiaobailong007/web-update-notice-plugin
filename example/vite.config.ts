import { defineConfig } from 'vite';
import { webUpdateNotice } from '../src/vite';

export default defineConfig({
  plugins: [
    webUpdateNotice({
      checkInterval: 2000, // 2秒检测一次，方便测试
    })
  ]
});