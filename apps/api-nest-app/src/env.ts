import { config } from 'dotenv'
import { join } from 'node:path'
import { cwd } from 'node:process'

const output = config({ path: join(cwd(), '.env') })
export const env = Object.assign({}, process.env, output.parsed)
