import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/cryptocurrency/', // required for GitHub Pages
  build: {
    chunkSizeWarningLimit: 1500, // optional, suppress warnings for large chunks
  },
})
