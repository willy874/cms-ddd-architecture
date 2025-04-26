import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

const UpdatePermissionDtoSchema = z.object({
  name: z.string()
    .min(4, 'Permission name must be at least 4 characters long!')
    .nonempty('Please enter permission name!'),
  description: z.string()
    .nonempty('Please enter permission description!')
    .min(8, 'Permission description must be at least 8 characters long!'),
  roles: z.array(z.string()),
})

export class UpdatePermissionDto extends createZodDto(UpdatePermissionDtoSchema) {}
