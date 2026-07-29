import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base` must match the GitHub Pages sub-path (https://<user>.github.io/w-box/).
// Override with BASE_PATH=/ when serving from a domain root.
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH ?? '/w-box/',
});
