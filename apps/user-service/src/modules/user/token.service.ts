import { Injectable,  } from '@nestjs/common'
import { jwtVerify, SignJWT } from 'jose'
import { ACCESS_SECRET, QUERY_SECRET, REFRESH_SECRET } from '@packages/shared'
 
class JwtService {
  verify(token: string, secret: string) {
    return jwtVerify(token, new TextEncoder().encode(secret))
  }

  sign(payload: object, secret: string, expiresIn: string) {
    return new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(new TextEncoder().encode(secret));
  }
}

@Injectable()
export class TokenService {
  constructor(private jwtService = new JwtService()) {}

  async isAccessTokenExpired(token: string) {
    try {
      return await this.jwtService.verify(token, ACCESS_SECRET)
    }
    catch (error) {
      return Promise.resolve(false)
    }
  }

  async isRefreshTokenExpired(token: string) {
    try {
      return await this.jwtService.verify(token, REFRESH_SECRET)
    }
    catch (error) {
      return Promise.resolve(false)
    }
  }

  createAccessToken(payload: object) {
    return this.jwtService.sign(payload, ACCESS_SECRET,  '1h')
  }

  createRefreshToken(payload: object) {
    return this.jwtService.sign(payload, ACCESS_SECRET,  '1h')
  }

  createQueryToken(payload: object) {
    return this.jwtService.sign(payload, QUERY_SECRET, '5m')
  }
}
