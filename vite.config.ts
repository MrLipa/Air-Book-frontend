import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import reactRefresh from '@vitejs/plugin-react-refresh';
import legacy from '@vitejs/plugin-legacy';
import path from 'path';

export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';
  const isTest = mode === 'test';

  return {
    plugins: [
      react(),
      !isProduction && reactRefresh(),
      legacy({
        targets: ['defaults', 'not IE 11'],
        polyfills: ['es.promise', 'es.array.iterator', 'es.object.assign'],
      }),
    ].filter(Boolean),
    base: '/',
    root: path.resolve(__dirname, './'),
    publicDir: 'public',
    clearScreen: false,
    logLevel: 'info',

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      minify: isProduction,
      sourcemap: !isProduction,
    },

    server: {
      port: 5173,
      strictPort: true,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
      },
      hmr: {
        overlay: true,
      },
    },
  };
});
