import { z } from 'zod'

export const LoginRequestDTOSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export type LoginRequestDTO = z.infer<typeof LoginRequestDTOSchema>

export const LoginResponseDTOSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  tokenType: z.string(),
})

export type LoginResponseDTO = z.infer<typeof LoginResponseDTOSchema>

export const RegisterRequestDTOSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export type RegisterRequestDTO = z.infer<typeof RegisterRequestDTOSchema>
