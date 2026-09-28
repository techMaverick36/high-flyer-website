import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sitemapPlugin } from './plugins/sitemap'

export default defineConfig({
  plugins: [react(), tailwindcss(), sitemapPlugin()],
  build: {
    rollupOptions: {
      output: {
        // Splits the single ~382 kB bundle so the vendor code — which rarely
        // changes — can be cached across deploys instead of being re-fetched
        // whenever app code changes.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          state: ['@reduxjs/toolkit', 'react-redux', 'zustand'],
          sanity: ['@sanity/client', '@sanity/image-url'],
        },
      },
    },
  },
})
