import { jwtVerify } from 'jose';
import { to } from 'await-to-js';
import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { getEnvironment, ACCESS_SECRET } from '@packages/shared';
import { getRedis } from './redis';

const AuthInfoSchema = z.object({})

export function createAuthMiddleware() {
  const env = getEnvironment();
  const secret = new TextEncoder().encode(ACCESS_SECRET);
  const redis = getRedis();
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