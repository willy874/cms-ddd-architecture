import { z } from 'zod'
import { Inject, Injectable } from '@nestjs/common'
import { CACHE_PROVIDER, CacheService } from '@/shared/cache'
import { TokenService } from '@/shared/token'
import { AuthUserService } from './user'
import { LoginDto } from './login.dto'
import { RegisterDto } from './register.dto'
import { QueryBus } from '@nestjs/cqrs'
import { FindUserQuery } from '@/shared/queries'

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

const UserSchema = z.object({
  id: z.number(),
})

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_PROVIDER) private cacheService: CacheService,
    private queryBus: QueryBus,
    private tokenService: TokenService,
    private userService: AuthUserService,
  ) {}

  async getUserByNameAndPassword(dto: LoginDto) {
    const query = new FindUserQuery({
      type: 'login',
      username: dto.username,
      password: dto.password,
    })
    const result = await this.queryBus.execute(query)
    return UserSchema.parse(result.data)
  }

  async getUserById(id: number) {
    const query = new FindUserQuery({
      type: 'userid',
      id,
    })
    const result = await this.queryBus.execute(query)
    return result.data
  }

  createUser(dto: RegisterDto) {
    this.userService.createUser(dto)
  }

  async isAlreadyExistsByUsername(username: string) {
    const user = await this.userService.getUserByName(username)
    return !!user
  }

  async generateTokens(uid: number) {
    const user = await this.getUserById(uid)
    const jwtPayload = JwtPayloadSchema.parse({
      uid,
      permissions: [],
    } satisfies JwtPayload)
    const accessToken = this.tokenService.createAccessToken(jwtPayload)
    const refreshToken = this.tokenService.createRefreshToken(jwtPayload)
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
