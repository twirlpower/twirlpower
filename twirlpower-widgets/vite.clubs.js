import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/clubs.js',
      name: 'TPClubs',
      fileName: () => 'tp-clubs.js',
      formats: ['iife'],
    },
    outDir: 'dist',
    emptyOutDir: false,
  },
});
