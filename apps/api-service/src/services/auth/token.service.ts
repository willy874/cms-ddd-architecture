import { ACCESS_SECRET, QUERY_SECRET, REFRESH_SECRET } from '@/shared/constants'
import { Jwt } from '@/shared/utils/crypto'
import { Injectable } from '@nestjs/common'

export const ACCESS_TOKEN_EXPIRED_TIME = 60 * 60 // 1 hours

export const REFRESH_TOKEN_EXPIRED_TIME = 60 * 60 * 24 * 7 // 7 days

export interface JWTPayload {
  iss?: string
  sub?: string
  aud?: string | string[]
  jti?: string
  nbf?: number
  exp?: number
  iat?: number
  [propName: string]: unknown
}

@Injectable()
export class TokenService {
  private accessJwtService = new Jwt(ACCESS_SECRET)
  private refreshJwtService = new Jwt(REFRESH_SECRET)
  private queryJwtService = new Jwt(QUERY_SECRET)

  createAccessToken(payload: JWTPayload) {
    return this.accessJwtService.sign(payload, '1h')
  }

  parseAccessToken(token: string) {
    return this.accessJwtService.parse(token) as Promise<JWTPayload>
  }

  createRefreshToken(payload: JWTPayload) {
    return this.refreshJwtService.sign(payload, '1d')
  }

  parseRefreshToken(token: string) {
    return this.refreshJwtService.parse(token) as Promise<JWTPayload>
  }

  createQueryToken(payload: object) {
    return this.queryJwtService.sign(payload, '5m')
  }
}
