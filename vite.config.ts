import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sitemapPlugin } from './plugins/sitemap'

export default defineConfig({
  plugins: [react(), tailwindcss(), sitemapPlugin()],
})
