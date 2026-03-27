import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Raise warning threshold — chunks are intentionally split
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime — cached separately, changes rarely
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Animation library
          'vendor-framer': ['framer-motion'],
          // Heavy 3D library (only if used)
          'vendor-three': ['three'],
          // Radix UI primitives
          'vendor-radix': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-tabs',
            '@radix-ui/react-select',
            '@radix-ui/react-popover',
            '@radix-ui/react-scroll-area',
          ],
          // Charts
          'vendor-recharts': ['recharts'],
          // Form / validation utilities
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          // Query
          'vendor-query': ['@tanstack/react-query'],
          // Utility belt
          'vendor-utils': ['clsx', 'class-variance-authority', 'tailwind-merge', 'lodash'],
        },
      },
    },
  },
});