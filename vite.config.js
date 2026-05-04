import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages: base = /<repo-name>/
// Lokale Entwicklung: base = /
const REPO_NAME = 'pension-investment-calculator'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? `/${REPO_NAME}/` : '/',
  test: {
    environment: 'node',
    globals: true,
  },
}))
