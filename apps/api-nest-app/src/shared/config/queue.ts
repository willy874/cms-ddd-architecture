import { registerAs } from '@nestjs/config'

export default registerAs('queue', () => ({
  host: process.env.QUEUE_HOST,
  port: parseInt(process.env.QUEUE_PORT, 10),
  user: process.env.QUEUE_USER,
  password: process.env.QUEUE_PASSWORD,
}))
