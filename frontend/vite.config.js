import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
    proxy: {
      '/generate': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/ai_engine': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})
