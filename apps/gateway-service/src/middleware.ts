import { Jwt } from '@packages/shared';
import { to } from 'await-to-js';
import { Redis } from 'ioredis';
import type { Request, Response, NextFunction } from 'express';
import { ACCESS_SECRET } from '@packages/shared';

const jwt = new Jwt(ACCESS_SECRET);
const redisClient = new Redis({
  host: process.env.CACHE_HOST || 'localhost',
  port: Number(process.env.CACHE_PORT) || 6379,
})

export function createAuthMiddleware() {
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
    const [jwtError, jwtPayload] = await to(jwt.parse(token));
    if (jwtError) {
      res.status(401).send('Unauthorized');
      return;
    }
    if (!jwtPayload || !jwtPayload.jti) {
      res.status(401).send('Unauthorized');
      return;
    }
    const [cacheError, tokenCacheString] = await to(redisClient.get(jwtPayload.jti));
    if (cacheError || !tokenCacheString) {
      res.status(401).send('Unauthorized');
      return;
    }
    const tokenCache = JSON.parse(tokenCacheString);
    if (!tokenCache || tokenCache.accessToken !== token) {
      res.status(401).send('Unauthorized');
      return;
    }
    console.log(`Token Passed`);
    next();
  }
}