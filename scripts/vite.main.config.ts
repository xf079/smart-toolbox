import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  build: {
    lib: {
      entry: 'app/index.ts',
      formats: ['es'],
      fileName: () => 'main.js',
    },
    rollupOptions: {
      external: ['electron', 'electron-squirrel-startup'],
    },
    target: 'node22',
    outDir: '.vite/build',
    emptyOutDir: false,
  },
});
