import { Jwt } from '@packages/shared';
import { to } from 'await-to-js';
import type { Request, Response, NextFunction } from 'express';
import { ACCESS_SECRET } from '@packages/shared';

const jwt = new Jwt(ACCESS_SECRET);

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
    const [jwtError, isTokenExpired] = await to(jwt.isExpired(token));
    if (isTokenExpired) {
      res.status(401).send('Unauthorized');
      return; 
    }
    if (jwtError) {
      res.status(401).send('Unauthorized');
      return;
    }
    console.log(`Token Passed`);
    next();
  }
}