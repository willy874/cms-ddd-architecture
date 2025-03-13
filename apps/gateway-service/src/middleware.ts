import { jwtVerify, errors } from 'jose';
import { to } from 'await-to-js';
import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { ACCESS_SECRET } from '@packages/shared';

const AuthInfoSchema = z.object({})

export function createAuthMiddleware() {
  const secret = new TextEncoder().encode(ACCESS_SECRET);
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
      if (jwtError instanceof errors.JWTExpired) {
        res.status(401).send('Unauthorized');
        return;
      }
      res.status(401).send('Unauthorized');
      return;
    }
    if (!result) {
      res.status(401).send('Unauthorized');
      return;
    }
    next();
  }
}