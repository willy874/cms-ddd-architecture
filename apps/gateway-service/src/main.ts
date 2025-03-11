import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createAuthMiddleware } from './middleware';
import { getEnvironment, loadEnv } from '@packages/shared'
import { initRedis } from './redis';

async function init() {
  loadEnv()
  initRedis()
}

init()
  .then(() => {
    const env = getEnvironment();
    const app = express();
    const authMiddleware = createAuthMiddleware()

    if (env.AUTH_API_PORT) {
      app.use(
        env.AUTH_API_PREFIX, 
        createProxyMiddleware({
          target: `http://${env.AUTH_API_HOST}:${env.AUTH_API_PORT}`,
          changeOrigin: true,
        })
      );
      console.log(`The auth service proxy is using.`);
    }
    if (env.USER_API_PORT) {
      app.use(
        env.USER_API_PREFIX, 
        authMiddleware,
        createProxyMiddleware({
          target: `http://${env.USER_API_HOST}:${env.USER_API_PORT}`,
          changeOrigin: true,
        })
      );
      console.log(`The user service proxy is using.`);
    }

    if (env.ROLE_API_PORT) {
      app.use(
        env.ROLE_API_PREFIX, 
        authMiddleware,
        createProxyMiddleware({
          target: `http://${env.ROLE_API_HOST}:${env.ROLE_API_PORT}`,
          changeOrigin: true,
        })
      );
      console.log(`The role service proxy is using.`);
    }

    if (env.PERMISSION_API_PORT) {
      app.use(
        env.PERMISSION_API_PREFIX, 
        authMiddleware,
        createProxyMiddleware({
          target: `http://${env.PERMISSION_API_HOST}:${env.PERMISSION_API_PORT}`,
          changeOrigin: true,
        })
      );
      console.log(`The permission service proxy is using.`);
    }

    if (env.GATEWAY_API_PORT) {
      app.listen(env.GATEWAY_API_PORT, () => {
        console.log(`The gateway is running.`);
      })
    }
  });