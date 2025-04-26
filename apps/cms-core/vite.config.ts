import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import { federation } from '@module-federation/vite'
import { loadEnv } from '@packages/shared'

// https://vite.dev/config/
export default defineConfig(async () => {
  loadEnv()
  const REMOTE_MODUlES = process.env.REMOTE_MODUlES
  const PORT = process.env.PORT
  const HOST = process.env.HOST

  return {
    plugins: [
      react(),
      svgr(),
      UnoCSS(),
      federation({
        name: 'cms_core',
        manifest: true,
        exposes: (() => {
          const remotes = REMOTE_MODUlES ? REMOTE_MODUlES.split(',') : []
          return Object.fromEntries(
            remotes.map((remote) => [`./${remote}`, `./src/remotes/${remote}`]),
          )
        })(),
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
        // 'remotes/ui': 'cms_core/ui',
      },
    },
    server: {
      host: HOST,
      port: PORT ? Number(PORT) : undefined,
      proxy: {
        [`/${process.env.GATEWAY_API_PREFIX}`]: {
          target: `http://${process.env.GATEWAY_API_HOST}:${process.env.GATEWAY_API_PORT}`,
          changeOrigin: true,
        },
      },
    },
  }
})
