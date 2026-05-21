import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress "use client" directive warnings from lucide-react and transitives
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' || warning.message.includes('use client')) {
          return;
        }
        warn(warning);
      },
    },
  },
});
