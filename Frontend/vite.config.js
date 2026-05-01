import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/n8n-auth": {
          target: env.VITE_N8N_AUTH_TARGET || "https://abrar1.app.n8n.cloud",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/n8n-auth/, "/webhook"),
          secure: false,
        },
        "/n8n-resume": {
          target: env.VITE_N8N_RESUME_TARGET || "https://abrar1.app.n8n.cloud",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/n8n-resume/, "/webhook"),
          secure: false,
        },
        "/n8n-api": {
          target: "https://abrar1.app.n8n.cloud",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/n8n-api/, ""),
          secure: false,
        },
      },
    },
  };
});
