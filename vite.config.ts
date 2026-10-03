import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves this repo at /portfolio/, so dev and preview use the same base.
export default defineConfig({ base: '/portfolio/', plugins: [react()] })
