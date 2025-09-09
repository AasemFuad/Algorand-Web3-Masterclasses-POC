// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 👇 MUST match your repo name EXACTLY (case-sensitive)
  base: '/Algorand-Web3-Masterclasses-POC/',
  // 👇 Build into /docs so GitHub Pages can serve it
  build: { outDir: 'docs' },
})
