import { z } from 'zod'
import { Axios } from 'axios'
import { Injectable } from '@nestjs/common'
import { getEnvironment } from '@packages/shared'
import { LoginDto } from './login.dto'
import { RegisterDto } from './register.dto'

const UserSchema = z.object({
  id: z.number(),
})

const HttpResultSchema = z.object({
  data: UserSchema,
})

@Injectable()
export class AuthUserService {
  private http: Axios

  constructor() {
    const env = getEnvironment()
    this.http = new Axios({
      baseURL: `http://${env.USER_API_HOST}:${env.USER_API_PORT}/${env.USER_API_PREFIX}`,
    })
  }

  async getUserByNameAndPassword(dto: LoginDto) {
    const query = {
      username: dto.username,
      password: dto.password,
    }
    const { data } = await this.http.get('/', { params: query })
    const result = HttpResultSchema.parse(data)
    return UserSchema.or(z.null()).parse(result.data)
  }

  async getUserById(id: number) {
    const res = await this.http.get(`/${id}`)
    return UserSchema.parse(res.data.data)
  }

  async getUserByName(username: string) {
    const query = { username }
    const { data } = await this.http.get('/', { params: query })
    const result = HttpResultSchema.parse(data)
    return UserSchema.or(z.null()).parse(result.data)
  }

  async insertUser(dto: RegisterDto) {
    const command = {
      username: dto.username,
      password: dto.password,
      roles: [],
    }
    const { data } = await this.http.post('/', command)
    const result = HttpResultSchema.parse(data)
    return UserSchema.parse(result.data)
  }
}
