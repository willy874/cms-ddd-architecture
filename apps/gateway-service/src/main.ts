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
    const {
      // GATEWAY_API_PREFIX,
      GATEWAY_API_PORT,
      // GATEWAY_API_HOST,
      AUTH_API_PREFIX,
      AUTH_API_HOST,
      AUTH_API_PORT,
      USER_API_PREFIX,
      USER_API_HOST,
      USER_API_PORT,
    } = getEnvironment();

    const app = express();

    const authMiddleware = createAuthMiddleware()

    if (AUTH_API_PORT) {
      app.use(
        AUTH_API_PREFIX, 
        createProxyMiddleware({
          target: `http://${AUTH_API_HOST}:${AUTH_API_PORT}`,
          changeOrigin: true,
        })
      );
      console.log(`The auth service proxy is using.`);
    }
    if (USER_API_PORT) {
      app.use(
        USER_API_PREFIX, 
        authMiddleware,
        createProxyMiddleware({
          target: `http://${USER_API_HOST}:${USER_API_PORT}`,
          changeOrigin: true,
        })
      );
      console.log(`The user service proxy is using.`);
    }

    if (GATEWAY_API_PORT) {
      app.listen(GATEWAY_API_PORT, () => {
        console.log(`The gateway is running.`);
      })
    }
  });