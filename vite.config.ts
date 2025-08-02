import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"], // Isolate vendor libs
          home: ["./src/pages/Index"], 
          contact: ["./src/pages/Contact"], // Separate Contact page
          blog: ["./src/pages/Blog"], // Separate Blog page
          blogPost: ["./src/pages/BlogPost"], // Separate BlogPost page
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})