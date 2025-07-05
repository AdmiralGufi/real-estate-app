import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    host: true,
    port: process.env.PORT || 3000,
    proxy: {
      // Прокси для API запросов для обхода CORS
      '/api': {
        target: 'https://real-estate-app-bek.onrender.com',
        changeOrigin: true,
        secure: false,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }
    }
  },
  preview: {
    host: true,
    port: process.env.PORT || 3000
  }
})
