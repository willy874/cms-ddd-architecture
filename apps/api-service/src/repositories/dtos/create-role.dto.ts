import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

const CreateRoleDtoSchema = z.object({
  name: z.string()
    .nonempty({ message: 'Name is required.' }),
  permissions: z.array(z.string()),
})

export class CreateRoleDto extends createZodDto(CreateRoleDtoSchema) {}
