import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  build: {
    lib: {
      entry: 'app/preload/index.ts',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: ['electron'],
    },
    target: 'node22',
    outDir: '.vite/build/preload',
    emptyOutDir: false,
  },
});
