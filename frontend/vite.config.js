import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_KEY),
  },
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
      },
      '/projects': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/collab/ws': {
        target: 'ws://localhost:8000',
        ws: true
      }
    }
  }
})
