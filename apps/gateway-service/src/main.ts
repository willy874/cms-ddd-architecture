import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createAuthMiddleware } from './middleware';
import { getEnvironment, loadEnv } from '@packages/shared'

async function init() {
  loadEnv()
}

init()
  .then(() => {
    
    const env = getEnvironment();

    const app = express();
    const authMiddleware = createAuthMiddleware()
    if (env.NODE_ENV === 'development') {
      app.use((req, _res, next) => {
        console.log(`Request URL: ${req.url}`);
        next();
      });
    }

    if (env.AUTH_API_PORT) {
      console.log('AUTH:', `http://${env.AUTH_API_HOST}:${env.AUTH_API_PORT}`);
      app.use(
        `/${env.GATEWAY_API_PREFIX}/${env.AUTH_API_PREFIX}`,
        createProxyMiddleware({
          target: `http://${env.AUTH_API_HOST}:${env.AUTH_API_PORT}`,
          changeOrigin: true,
          pathRewrite: (path) => env.AUTH_API_PREFIX + path,
        }),
      );
      console.log(`The auth service proxy is using.`);
    }
    if (env.USER_API_PORT) {
      console.log('USER:', `http://${env.USER_API_HOST}:${env.USER_API_PORT}`);
      app.use(
        `/${env.GATEWAY_API_PREFIX}/${env.USER_API_PREFIX}`,
        authMiddleware,
        createProxyMiddleware({
          target: `http://${env.USER_API_HOST}:${env.USER_API_PORT}`,
          changeOrigin: true,
          pathRewrite: (path) => env.USER_API_PREFIX + path,
        })
      );
      console.log(`The user service proxy is using.`);
    }

    if (env.ROLE_API_PORT) {
      console.log('ROLE:', `http://${env.ROLE_API_HOST}:${env.ROLE_API_PORT}`);
      app.use(
        `/${env.GATEWAY_API_PREFIX}/${env.ROLE_API_PREFIX}`,
        authMiddleware,
        createProxyMiddleware({
          target: `http://${env.ROLE_API_HOST}:${env.ROLE_API_PORT}`,
          changeOrigin: true,
          pathRewrite: (path) => env.ROLE_API_PREFIX + path,
        })
      );
      console.log(`The role service proxy is using.`);
    }

    if (env.PERMISSION_API_PORT) {
      console.log('PERMISSION:', `http://${env.PERMISSION_API_HOST}:${env.PERMISSION_API_PORT}`);
      app.use(
        `/${env.GATEWAY_API_PREFIX}/${env.PERMISSION_API_PREFIX}`,
        authMiddleware,
        createProxyMiddleware({
          target: `http://${env.PERMISSION_API_HOST}:${env.PERMISSION_API_PORT}`,
          changeOrigin: true,
          pathRewrite: (path) => env.PERMISSION_API_PREFIX + path,
        })
      );
      console.log(`The permission service proxy is using.`);
    }
    if (env.GATEWAY_API_PORT) {
      console.log('GATEWAY:', `http://${env.GATEWAY_API_HOST}:${env.GATEWAY_API_PORT}`);
      app.listen(env.GATEWAY_API_PORT, () => {
        console.log(`The gateway is running.`);
      })
    }
  });