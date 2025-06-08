import { ACCESS_SECRET, QUERY_SECRET, REFRESH_SECRET } from '@/shared/constants'
import { Jwt } from '@/shared/utils/crypto'
import { Injectable } from '@nestjs/common'

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

  isAccessTokenExpired(token: string) {
    return this.accessJwtService.isExpired(token)
  }

  isAccessTokenValid(token: string) {
    return this.accessJwtService.verify(token)
  }

  parseAccessToken(token: string) {
    return this.accessJwtService.parse(token) as Promise<JWTPayload>
  }

  createRefreshToken(payload: JWTPayload) {
    return this.refreshJwtService.sign(payload, '1d')
  }

  isRefreshTokenExpired(token: string) {
    return this.refreshJwtService.isExpired(token)
  }

  isRefreshTokenValid(token: string) {
    return this.refreshJwtService.verify(token)
  }

  parseRefreshToken(token: string) {
    return this.refreshJwtService.parse(token) as Promise<JWTPayload>
  }

  createQueryToken(payload: object) {
    return this.queryJwtService.sign(payload, '5m')
  }
}
