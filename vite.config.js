import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Imagemin from 'unplugin-imagemin/vite';

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
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
      scopeBehaviour: 'local',
      generateScopedName: '[name]__[local]--[hash:base64:5]',
    },
  },
})

