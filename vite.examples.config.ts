import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  root: resolve(__dirname, 'examples/web'),
  publicDir: false,
  build: {
    outDir: resolve(__dirname, 'examples/web/dist'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      // Map the library imports to the source code for development
      '@jpglab/fuse/web': resolve(__dirname, 'src/web.ts'),
      '@jpglab/fuse/node': resolve(__dirname, 'src/node.ts'),
      '@jpglab/fuse': resolve(__dirname, 'src/web.ts'),
      // Keep the same aliases from main config
      '@': resolve(__dirname, './src'),
      '@camera': resolve(__dirname, './src/camera'),
      '@core': resolve(__dirname, './src/core'),
      '@transport': resolve(__dirname, './src/transport'),
      '@factories': resolve(__dirname, './src/factories'),
      '@client': resolve(__dirname, './src/client'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  optimizeDeps: {
    exclude: ['usb'],
  },
})