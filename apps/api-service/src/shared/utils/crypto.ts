import { SHA256 } from 'crypto-js'
import { HASH_SECRET } from '../constants'

export { Jwt } from '@packages/shared'

export const hash = (str: string) => {
  return SHA256(str + HASH_SECRET).toString()
}
