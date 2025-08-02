import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://gajpati-backend.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  preview: {
    proxy: {
      '/api': {
        target: 'https://gajpati-backend.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
    allowedHosts: ['gajpatifrontend.onrender.com'],
  },
  build: {
    sourcemap: true, // Enable source maps for debugging
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          home: ['./src/pages/Index'],
          contact: ['./src/pages/Contact'],
          blog: ['./src/pages/Blog'],
          blogPost: ['./src/pages/BlogPost'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});