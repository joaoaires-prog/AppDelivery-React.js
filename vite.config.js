import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      scopeBehaviour: 'local',
    },
  },
  // >>> ADICIONE ESTA SEÇÃO AQUI <<<
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Importante: Garanta que esta é a porta exata do seu backend (server.js)
        changeOrigin: true, // Necessário para evitar problemas de CORS em algumas situações
        // rewrite: (path) => path.replace(/^\/api/, ''), // NÃO É NECESSÁRIO AQUI, POIS SEU BACKEND JÁ TEM '/api' NAS ROTAS
      },
    },
  },
});
