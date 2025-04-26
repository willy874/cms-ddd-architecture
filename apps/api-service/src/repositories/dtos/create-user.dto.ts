import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

const CreateUserDtoSchema = z.object({
  username: z.string()
    .min(4, 'Username must be at least 4 characters long!')
    .nonempty('Please enter username!'),
  password: z.string()
    .nonempty('Please enter password!')
    .regex(/^[a-zA-Z0-9~!@#$%^&*()_+=;',./<>?:"{}|"`\-[\]\\]*$/, {
      message: 'Password must contain only letters, numbers, and special characters!',
    })
    .min(8, 'Password must be at least 8 characters long!'),
  roles: z.array(z.string()),
})

export class CreateUserDto extends createZodDto(CreateUserDtoSchema) {}
