import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        port: 5173,
        watch: {
            usePolling: true
        }
    },
    // --- AGREGÁ ESTO ---
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './src/setupTests.js', // Archivo de configuración inicial
    }
})