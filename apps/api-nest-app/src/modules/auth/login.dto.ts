// import { IsString, IsNotEmpty } from 'class-validator'
import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

// export class LoginDto {
//   @IsString()
//   @IsNotEmpty()
//   username: string

//   @IsString()
//   @IsNotEmpty()
//   password: string
// }

export const LoginDtoSchema = z.object({
  username: z.string().nonempty({ message: 'Username is required.' }),
  password: z.string().nonempty({ message: 'Password is required.' }),
})

export class LoginDto extends createZodDto(LoginDtoSchema) {}
