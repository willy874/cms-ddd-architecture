import { SHA256 } from 'crypto-js'
import { HASH_SECRET } from '../constants'

export const CRYPTO_PROVIDER = 'CRYPTO_PROVIDER'

export class CryptoService {
  hash(str: string) {
    return SHA256(str + HASH_SECRET).toString()
  }
}

export const cryptoProvider = {
  provide: CRYPTO_PROVIDER,
  useClass: CryptoService,
}
