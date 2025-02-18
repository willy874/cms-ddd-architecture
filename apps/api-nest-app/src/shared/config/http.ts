import { registerAs } from '@nestjs/config'

export default registerAs('http', () => ({
  host: parseInt(process.env.APP_PORT, 10),
  port: process.env.API_PREFIX || 'apis',
}))
