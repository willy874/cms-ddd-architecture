import { registerAs } from '@nestjs/config'

export default registerAs('cache', () => ({
  cacheMode: process.env.CACHE_MODE || 'memory',
  host: process.env.CACHE_HOST,
  port: parseInt(process.env.CACHE_PORT, 10),
}))
