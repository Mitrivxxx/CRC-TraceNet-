import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Aspire (AddViteApp) ustawia PORT; lokalnie / Docker zostaja przy 5173.
const port = Number(process.env.PORT) || 5173;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port,
    strictPort: true,
  },
});
