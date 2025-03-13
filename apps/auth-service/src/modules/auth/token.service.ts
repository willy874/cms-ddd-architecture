import { Injectable } from '@nestjs/common'
import { jwtVerify, SignJWT, errors } from 'jose'
import { ACCESS_SECRET, QUERY_SECRET, REFRESH_SECRET } from '@packages/shared'
 
class JwtService {
  private secret: Uint8Array
  constructor(secret: string) {
    this.secret = new TextEncoder().encode(secret)
  }

  async isExpired(token: string) {
    try {
      await jwtVerify(token, this.secret)
      return false
    } catch (error) {
      if (error instanceof errors.JWTExpired) {
        return true
      }
      throw error
    }
  }

  verify(token: string) {
    return jwtVerify(token, this.secret)
  }

  sign(payload: object, expiresIn: string) {
    return new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(this.secret);
  }
}

@Injectable()
export class TokenService {
  private accessJwtService = new JwtService(ACCESS_SECRET)
  private refreshJwtService = new JwtService(REFRESH_SECRET)
  private queryJwtService = new JwtService(QUERY_SECRET)

  createAccessToken(payload: object) {
    return this.accessJwtService.sign(payload,  '1h')
  }

  isAccessTokenExpired(token: string) {
    return this.accessJwtService.isExpired(token)
  }

  isAccessTokenValid(token: string) {
    return this.accessJwtService.verify(token)
  }
  
  createRefreshToken(payload: object) {
    return this.refreshJwtService.sign(payload, '1d')
  }

  isRefreshTokenExpired(token: string) {
    return this.refreshJwtService.isExpired(token)
  }

  isRefreshTokenValid(token: string) {
    return this.refreshJwtService.verify(token)
  }

  createQueryToken(payload: object) {
    return this.queryJwtService.sign(payload, '5m')
  }
}
