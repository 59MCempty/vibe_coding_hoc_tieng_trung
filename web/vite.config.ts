import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// PWA (vite-plugin-pwa, chế độ injectManifest) sẽ được cấu hình ở T076 (US6).
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
