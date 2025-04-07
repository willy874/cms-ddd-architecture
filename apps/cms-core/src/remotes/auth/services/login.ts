import { http } from '@/libs/http'
import { LoginRequestDTO, LoginResponseDTO } from '../models/login'

export function useApiLogin() {
  return (body: LoginRequestDTO): Promise<LoginResponseDTO> => {
    return http().request({
      url: '/auth/login',
      method: 'POST',
      body,
    })
      .then((res) => {
        return res.data
      })
  }
}
