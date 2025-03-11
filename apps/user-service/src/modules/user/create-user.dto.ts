import { IsString, IsNotEmpty, Matches } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]{4,}$/, { message: 'Username must be at least 4 characters long and contain only letters and numbers.' })
  username: string

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, { message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number and must be at least 8 characters long.' })
  password: string

  roles: string[]
}
