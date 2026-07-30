import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base` must match the GitHub Pages sub-path exactly, including case: the repo
// is named `W-box`, so deploy-pages publishes to
// https://kris-wanggg.github.io/W-box/ and asset paths have to agree.
// Override with BASE_PATH=/ when serving from a domain root.
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH ?? '/W-box/',
});
