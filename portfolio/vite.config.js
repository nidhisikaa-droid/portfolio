import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,
    open: false
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
