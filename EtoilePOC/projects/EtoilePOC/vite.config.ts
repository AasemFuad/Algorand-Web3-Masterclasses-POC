import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills' // <-- named export

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // optional, but helps when some libs import via node: protocol
      protocolImports: true,
    }),
  ],
  // keep this for GitHub Pages
  base: '/Algorand-Web3-Masterclasses-POC/',
  // give wallet libs a browser-safe 'global'
  define: {
    global: 'globalThis',
  },
  // helps Vite pre-bundle these shims when needed
  optimizeDeps: {
    include: ['buffer', 'process'],
  },
})
