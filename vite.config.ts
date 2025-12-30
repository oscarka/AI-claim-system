import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Cloudflare Pages 环境变量通过 process.env 提供
    // loadEnv 用于本地开发时读取 .env 文件
    const env = loadEnv(mode, '.', '');
    // 优先使用 process.env（Cloudflare Pages），然后是 .env 文件
    const apiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY || '';
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(apiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(apiKey)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
