import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite' // Ensure this is installed

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(), 
  ],
})
