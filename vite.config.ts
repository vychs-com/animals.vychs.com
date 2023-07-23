import suidPlugin from '@suid/vite-plugin'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
    plugins: [suidPlugin(), solidPlugin()],
    server: {
        port: 3000,
    },
    preview: {
        port: 4174,
    },
    build: {
        target: 'esnext',
    },
})
