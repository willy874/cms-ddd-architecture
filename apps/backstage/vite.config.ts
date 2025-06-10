import { withFilter, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

const isNotNil = <T>(value?: T | undefined | null): value is T => {
  return value !== undefined && value !== null && value !== '' && !Number.isFinite(value)
}

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
    allowedHosts: [process.env.HOST].filter(isNotNil),
    proxy: {
      [`/${process.env.GATEWAY_API_PREFIX}`]: {
        target: `http://${process.env.GATEWAY_API_HOST}:${process.env.GATEWAY_API_PORT}`,
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    withFilter(
      svgr(),
      { load: { id: /\.svg\?react$/ } },
    ),
  ],
})
