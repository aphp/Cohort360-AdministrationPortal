/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import svgr from 'vite-plugin-svgr'

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build'
    },
    server: {
      port: 3000
    },
    plugins: [react(), tsconfigPaths(), svgr()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.ts'],
      css: false,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'lcov'],
        reportsDirectory: './coverage',
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/**/*.test.{ts,tsx}',
          'src/setupTests.ts',
          'src/react-app-env.d.ts',
          'src/index.tsx',
          'src/assets/**'
        ]
      }
    }
  }
})
