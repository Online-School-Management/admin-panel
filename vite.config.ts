import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // React Query
          'query-vendor': ['@tanstack/react-query'],
          // Form handling
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          // Radix UI components
          'ui-vendor': [
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
          ],
          // Utilities
          'utils-vendor': ['axios', 'date-fns', 'zustand'],
          // Icons
          'icons-vendor': ['lucide-react'],
        },
      },
    },
    // Increase chunk size warning limit since we're manually chunking
    chunkSizeWarningLimit: 1000,
    // Enable minification (esbuild is faster and built-in)
    minify: 'esbuild',
    // Enable source maps for debugging (disable in production for smaller bundle)
    sourcemap: false,
    // Optimize for production
    target: 'es2015',
    cssCodeSplit: true,
  },
  server: {
    port: 3000,
    open: true,
  },
})


