// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  build: {
    outDir: './dist',
  },
  publicDir: 'public',
  server: {
    open: true,  // Opens the browser on server start
  },
  fs: {
    allow: [
      './src',                  // Allow serving from src if needed
      './custom-directory',     // Replace with the actual path of your `.well-known` directory
    ],
  },
});
