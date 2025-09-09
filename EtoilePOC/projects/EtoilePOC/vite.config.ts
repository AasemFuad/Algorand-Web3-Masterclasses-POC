import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Algorand-Web3-Masterclasses-POC/', // <-- repo name with leading/trailing slashes
})
