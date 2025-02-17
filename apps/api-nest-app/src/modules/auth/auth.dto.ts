import { User } from './user.entity'

export class AuthRegisterRequestDto {
  public username: string
  public password: string

  constructor({ username, password }: Partial<User>) {
    this.username = username
    this.password = password
  }
}

export class AuthUserMeResponseDto {
  public username: string

  constructor(user: User) {
    this.username = user.username
  }
}
