import { Injectable } from '@nestjs/common'
import { JwtService, TokenExpiredError } from '@nestjs/jwt'
import { ACCESS_SECRET, QUERY_SECRET, REFRESH_SECRET } from '@/shared/constants'

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
  ) {}

  isAccessTokenExpired(token: string) {
    try {
      this.jwtService.verify(token, { secret: ACCESS_SECRET })
    }
    catch (error) {
      if (error instanceof TokenExpiredError) {
        return true
      }
      throw error
    }
    return false
  }

  isRefreshTokenExpired(token: string) {
    try {
      this.jwtService.verify(token, { secret: REFRESH_SECRET })
    }
    catch (error) {
      if (error instanceof TokenExpiredError) {
        return true
      }
      throw error
    }
    return false
  }

  createAccessToken(payload: object) {
    return this.jwtService.sign(payload, { secret: ACCESS_SECRET, expiresIn: '1h' })
  }

  createRefreshToken(payload: object) {
    return this.jwtService.sign(payload, { secret: REFRESH_SECRET, expiresIn: '7d' })
  }

  createQueryToken(payload: object) {
    return this.jwtService.sign(payload, { secret: QUERY_SECRET, expiresIn: '5m' })
  }
}
