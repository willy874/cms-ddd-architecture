import { User } from './user.entity'

export class AuthRegisterRequestDto {
  public username?: string
  public password?: string

  constructor({ username, password }: Partial<User>) {
    Object.assign(this, { username, password })
  }

  clone() {
    return JSON.parse(JSON.stringify(this))
  }
}

export class AuthUserMeResponseDto {
  public username: string

  constructor({ username }: User) {
    Object.assign(this, { username })
  }

  clone() {
    return JSON.parse(JSON.stringify(this))
  }
}
