import { User } from './imports/user'

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
