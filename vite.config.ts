import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Traductor_es-en-en-es/',
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})