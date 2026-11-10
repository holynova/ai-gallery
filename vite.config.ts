import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { version } from './package.json'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'pages' ? '/ai-gallery/' : '/',
  define: { __APP_VERSION__: JSON.stringify(`v${version}`) },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}))
