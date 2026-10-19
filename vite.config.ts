import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base so the build can be hosted from any sub-path (GitHub Pages, etc.).
  base: './',
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1500,
  },
});
