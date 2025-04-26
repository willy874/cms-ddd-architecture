import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

export const LoginDtoSchema = z.object({
  username: z.string().nonempty({ message: 'Username is required.' }),
  password: z.string().nonempty({ message: 'Password is required.' }),
})

export class LoginDto extends createZodDto(LoginDtoSchema) {}
