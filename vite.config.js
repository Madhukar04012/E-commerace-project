import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            'framer-motion',
            '@emotion/react',
            '@emotion/styled',
            '@mui/material',
            'firebase'
          ],
          utils: [
            'lodash',
            'fuse.js',
            'i18next',
            'react-i18next'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
