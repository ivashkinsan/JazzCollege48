import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Imagemin from 'unplugin-imagemin/vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    Imagemin({
      mode: 'squoosh', // Или 'sharp', если Squoosh не подходит
      cache: true // Включаем кэширование
    }),
  ],
  resolve: {
    alias: {
      '@nestjs/testing': path.resolve(__dirname, 'node_modules/@nestjs/testing'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'],
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
      scopeBehaviour: 'local',
      generateScopedName: '[name]__[local]--[hash:base64:5]',
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
})
