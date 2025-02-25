import { registerAs } from '@nestjs/config'

export default registerAs('dev', () => ({
  tokenPass: process.env.TOKEN_PASS === 'true',
}))
