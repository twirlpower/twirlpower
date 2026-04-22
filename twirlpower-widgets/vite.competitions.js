import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/competitions.js',
      name: 'TPCompetitions',
      fileName: () => 'tp-competitions.js',
      formats: ['iife'],
    },
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
