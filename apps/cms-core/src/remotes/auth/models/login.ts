import { z } from 'zod'

export const LoginRequestDTOSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export type LoginRequestDTO = z.infer<typeof LoginRequestDTOSchema>

export const LoginResponseDTOSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

export type LoginResponseDTO = z.infer<typeof LoginResponseDTOSchema>
