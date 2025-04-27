import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import { federation } from '@module-federation/vite'
import { loadEnv } from '@packages/shared'

const isNotNil = <T>(value?: T | undefined | null): value is T => {
  return value !== undefined && value !== null && value !== '' && !Number.isFinite(value)
}

// https://vite.dev/config/
export default defineConfig(async () => {
  loadEnv()
  const env = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    HOST: process.env.HOST,
    REMOTE_MODUlES: process.env.REMOTE_MODUlES,
    GATEWAY_API_PREFIX: process.env.GATEWAY_API_PREFIX,
    GATEWAY_API_HOST: process.env.GATEWAY_API_HOST,
    GATEWAY_API_PORT: process.env.GATEWAY_API_PORT,
    AUTH_API_PREFIX: process.env.AUTH_API_PREFIX,
    AUTH_API_HOST: process.env.AUTH_API_HOST,
    AUTH_API_PORT: process.env.AUTH_API_PORT,
    USER_API_PREFIX: process.env.USER_API_PREFIX,
    USER_API_HOST: process.env.USER_API_HOST,
    USER_API_PORT: process.env.USER_API_PORT,
    ROLE_API_PREFIX: process.env.ROLE_API_PREFIX,
    ROLE_API_HOST: process.env.ROLE_API_HOST,
    ROLE_API_PORT: process.env.ROLE_API_PORT,
  }
  console.log(env)

  return {
    plugins: [
      react(),
      svgr(),
      UnoCSS(),
      federation({
        name: 'cms_core',
        manifest: true,
        exposes: (() => {
          const remotes = env.REMOTE_MODUlES ? env.REMOTE_MODUlES.split(',') : []
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
      },
    },
    server: {
      port: env.PORT ? Number(env.PORT) : undefined,
      allowedHosts: [env.HOST].filter(isNotNil),
      proxy: {
        [`/${env.GATEWAY_API_PREFIX}`]: {
          target: `http://${env.GATEWAY_API_HOST}:${env.GATEWAY_API_PORT}`,
          changeOrigin: true,
        },
      },
    },
  }
})
