// vite.config.js

import { defineConfig } from 'vite';
import sveltekit from '@sveltejs/adapter-static';

export default defineConfig({
  plugins: [sveltekit()],
  build: {
    rollupOptions: {
      external: ['echarts', 'd3']
    }
  }
});