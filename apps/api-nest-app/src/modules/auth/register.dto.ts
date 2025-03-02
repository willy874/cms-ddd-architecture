// import { IsString, IsNotEmpty, Matches } from 'class-validator'
import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

// export class RegisterDto {
//   @IsString()
//   @IsNotEmpty()
//   @Matches(/^[a-zA-Z0-9]{4,}$/, { message: 'Username must be at least 4 characters long and contain only letters and numbers.' })
//   username: string
//
//   @IsString()
//   @IsNotEmpty()
//   @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, { message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number and must be at least 8 characters long.' })
//   password: string
// }

export const RegisterDtoSchema = z.object({
  username: z.string()
    .nonempty({ message: 'Username is required.' })
    .regex(/^[a-zA-Z0-9]{4,}$/, { message: 'Username must be at least 4 characters long and contain only letters and numbers.' }),
  password: z.string()
    .nonempty({ message: 'Password is required.' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, { message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number and must be at least 8 characters long.' }),
})

export class RegisterDto extends createZodDto(RegisterDtoSchema) {}
