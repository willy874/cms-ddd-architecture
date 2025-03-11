import Redis from 'ioredis';
import { getEnvironment } from '@packages/shared';

let redis: Redis | null = null;

export function getRedis() {
  if (!redis) {
    throw new Error('The cache service is not available.');
  }
  return redis;
}

export function initRedis() {
  const { CACHE_HOST, CACHE_PORT } = getEnvironment();
  if (CACHE_HOST && CACHE_PORT) {
    const instance = new Redis({
      host: CACHE_HOST,
      port: CACHE_PORT,
    })
    redis = instance
  }
}