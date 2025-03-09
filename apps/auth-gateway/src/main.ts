import { config } from 'dotenv';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import Redis from 'ioredis';
import { z } from 'zod';
import { jwtVerify } from 'jose';
import { to } from 'await-to-js';

const EnvironmentSchema = z.object({
  APP_PORT: z.string().transform((v) => parseInt(v, 10)),
  // auth service
  AUTH_API_PREFIX: z.string(),
  AUTH_HOST: z.string(),
  AUTH_PORT: z.string().transform((v) => parseInt(v, 10)),
  // cache service
  CACHE_HOST: z.string(),
  CACHE_PORT: z.string().transform((v) => parseInt(v, 10)),
})

async function init() {
  const env = Object.assign({}, config({ path: '.env.local' }).parsed, process.env);
  return EnvironmentSchema.parse(env);
}

const AuthInfoSchema = z.object({})

const secret = new TextEncoder().encode('secret-key');

function authMiddleware(redis: Redis) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers['authorization'];
    if (!authorization) {
      res.status(401).send('Unauthorized');
      return;
    }
    const [type, token] = authorization.split(' ');
    if (type !== 'Bearer') {
      res.status(401).send('Unauthorized');
      return;
    }
    const [jwtError, result] = await to(jwtVerify(token, secret))
    if (jwtError) {
      res.status(401).send('Unauthorized');
      return;
    }
    if (result) {
      res.status(401).send('Unauthorized');
      return;
    }
    const [redisError, info] = await to(redis.get(authorization))
    if (redisError) {
      res.status(500).send('Internal Server Error');
      return;
    }
    if (!info) {
      res.status(401).send('Unauthorized');
      return;
    }
    const [parseError] = await to(Promise.resolve().then(() => AuthInfoSchema.parse(JSON.parse(info))))
    if (parseError) {
      res.status(401).send('Unauthorized');
      return;
    }
    next();
  }
}

init().then(({
  APP_PORT,
  AUTH_API_PREFIX,
  AUTH_HOST,
  AUTH_PORT,
  CACHE_HOST,
  CACHE_PORT,
}) => {
  const app = express();

  const redis = new Redis({
    host: CACHE_HOST,
    port: CACHE_PORT,
  })

  app.use(
    AUTH_API_PREFIX, 
    authMiddleware(redis),
    createProxyMiddleware({
      target: `http://${AUTH_HOST}:${AUTH_PORT}`,
      changeOrigin: true,
    })
  );
  
  app.listen(APP_PORT, () => {
    console.log(`The auth-gateway is running.`);
  })
})
