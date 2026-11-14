import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 5174,
    host: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    target: 'esnext',
    cssMinify: true,
    sourcemap: false,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'vite-runtime',
              test: /preload-helper|rolldown-runtime/,
              minSize: 0,
              priority: 100
            },
            {
              name: 'vendor-react',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 50
            },
            {
              name: 'vendor-lucide',
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              priority: 40
            },
            {
              name: 'vendor-firebase',
              test: /[\\/]node_modules[\\/]firebase[\\/]/,
              priority: 30
            },
            {
              name: 'data-govt-services',
              test: /governmentServicesData/,
              priority: 20
            },
            {
              name: 'data-weblinks',
              test: /weblinksData/,
              priority: 20
            }
          ]
        }
      }
    }
  }
});
