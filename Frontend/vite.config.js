import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/n8n-api': {
          target: env.VITE_N8N_TARGET || 'https://n8n.avijit-bera.cfd',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/n8n-api/, '/webhook'),
          secure: false
        },
        '/n8n-api-test': {
          target: env.VITE_N8N_TARGET || 'https://n8n.avijit-bera.cfd',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/n8n-api-test/, '/webhook-test'),
          secure: false
        }
      }
    }
  }
})
