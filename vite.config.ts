import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [react(), tailwindcss()],
    define: {
        global: 'globalThis',
    },
    server: {
        open: '/examples/web/index.html',
        host: true,
    },
    resolve: {
        alias: {
            '@camera': resolve(__dirname, './src/camera'),
            '@core': resolve(__dirname, './src/core'),
            '@transport': resolve(__dirname, './src/transport'),
            '@factories': resolve(__dirname, './src/factories'),
            '@api': resolve(__dirname, './src/api'),
            '@constants': resolve(__dirname, './src/constants'),
        },
    },
    build: {
        lib: {
            entry: {
                web: resolve(__dirname, 'src/web.ts'),
                node: resolve(__dirname, 'src/node.ts'),
            },
            name: 'Fuse',
        },
        rollupOptions: {
            external: ['fs', 'path', 'usb', 'node:fs', 'node:path'],
        },
    },
})