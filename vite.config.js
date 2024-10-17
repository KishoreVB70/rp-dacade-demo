// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',  // Set the root to the 'src' folder
  build: {
    outDir: '../dist',  // Output the build files to the 'dist' directory
  }
});
