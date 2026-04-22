import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/stats.js',
      name: 'TPStats',
      fileName: () => 'tp-stats.js',
      formats: ['iife'],
    },
    outDir: 'dist',
    emptyOutDir: false,
  },
});
