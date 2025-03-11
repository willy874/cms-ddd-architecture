import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

const UpdateRoleDtoSchema = z.object({
  name: z.string(),
})

export class UpdateRoleDto extends createZodDto(UpdateRoleDtoSchema) {}