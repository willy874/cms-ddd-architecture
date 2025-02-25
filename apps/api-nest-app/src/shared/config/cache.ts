import { registerAs } from '@nestjs/config'

export default registerAs('cache', () => ({
  cacheMode: process.env.CACHE_MODE || 'memory',
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT, 10),
}))
