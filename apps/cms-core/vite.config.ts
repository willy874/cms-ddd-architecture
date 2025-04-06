import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { federation } from '@module-federation/vite'
import { loadEnv } from '@packages/shared'

loadEnv()

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'cms_core',
      manifest: true,
      exposes: {
        './ui': './src/remotes/ui',
        './layout': './src/remotes/layout',
        './auth': './src/remotes/auth',
      },
      shared: {
        'react': {
          singleton: true,
        },
        'react-dom': {
          singleton: true,
        },
      },
    }),
  ],
  define: {
    'process.env': {
      BASE_URL: JSON.stringify(process.env.BASE_URL),
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      [`/${process.env.GATEWAY_API_PREFIX}`]: {
        target: `http://${process.env.GATEWAY_API_HOST}:${process.env.GATEWAY_API_PORT}`,
        changeOrigin: true,
      },
    },
  },
})
