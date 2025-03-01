import { HASH_SECRET } from '@/shared/constants'
import { SHA256 } from 'crypto-js'

export function hash(str: string) {
  return SHA256(str + HASH_SECRET).toString()
}
