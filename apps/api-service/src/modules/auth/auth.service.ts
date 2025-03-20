import { z } from 'zod'
import { Injectable } from '@nestjs/common'
import { CacheService } from '@/shared/cache'
import { AuthUserService } from './user.service'
import { RegisterDto } from './register.dto'
import { TokenService } from './token.service'
import { LoginDto } from './login.dto'

const JwtPayloadSchema = z.object({
  uid: z.number(),
  permissions: z.array(z.string()),
})

type JwtPayload = z.infer<typeof JwtPayloadSchema>

const TokenPayloadSchema = z.object({
  uid: z.number(),
  accessToken: z.string(),
  refreshToken: z.string(),
})

// type TokenPayload = z.infer<typeof TokenPayloadSchema>

const UserPayloadSchema = z.object({
  user: z.unknown(),
  permissions: z.array(z.string()),
})

// type UserPayload = z.infer<typeof UserPayloadSchema>

const CachePayloadSchema = TokenPayloadSchema.merge(UserPayloadSchema)

type CachePayload = z.infer<typeof CachePayloadSchema>

@Injectable()
export class AuthService {
  constructor(
    private cacheService: CacheService,
    private tokenService: TokenService,
    private userService: AuthUserService,
  ) {}

  loginCheck(dto: LoginDto) {
    return this.userService.loginCheck(dto)
  }

  createUser(dto: RegisterDto) {
    this.userService.insertUser(dto)
  }

  async generateTokens(uid: number) {
    const user = await this.userService.getUserById(uid)
    const jwtPayload = JwtPayloadSchema.parse({
      uid,
      permissions: [],
    } satisfies JwtPayload)
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.createAccessToken(jwtPayload),
      this.tokenService.createRefreshToken(jwtPayload),
    ])
    const cachePayload = CachePayloadSchema.parse({
      uid,
      user,
      permissions: jwtPayload.permissions,
      accessToken,
      refreshToken,
    } satisfies CachePayload)
    await Promise.all([
      this.cacheService.set(accessToken, JSON.stringify(cachePayload)),
      this.cacheService.set(refreshToken, JSON.stringify(cachePayload)),
    ])
    return {
      accessToken,
      refreshToken,
    }
  }

  async removeToken(token: string) {
    const cachePayload = await this.cacheService.get(token) || 'null'
    if (cachePayload) {
      const tokenPayload = TokenPayloadSchema.parse(JSON.parse(cachePayload))
      await Promise.all([
        this.cacheService.del(tokenPayload.accessToken),
        this.cacheService.del(tokenPayload.refreshToken),
      ])
      return true
    }
    return false
  }

  async getTokenPayloadByToken(token: string) {
    const value = await this.cacheService.get(token)
    if (!value) {
      return null
    }
    return TokenPayloadSchema.parse(JSON.parse(value))
  }

  async getUserPayloadByToken(token: string) {
    const value = await this.cacheService.get(token)
    if (!value) {
      return null
    }
    return UserPayloadSchema.parse(JSON.parse(value))
  }
}
