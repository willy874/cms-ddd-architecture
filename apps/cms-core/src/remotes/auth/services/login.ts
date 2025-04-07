import { http, httpAuth } from '@/libs/http'
import { LoginRequestDTO, LoginResponseDTO, RegisterRequestDTO } from '../models/login'
import { HttpResult } from '@/modules/http'

export function apiLogin(body: LoginRequestDTO): Promise<HttpResult<LoginResponseDTO>> {
  return http().request({
    url: '/auth/login',
    method: 'POST',
    body,
  })
    .then((res) => res.data)
}

export function apiCheckLogin(): Promise<void> {
  return httpAuth().request({
    url: '/auth/check',
    method: 'GET',
  }).then(() => {})
}

export function apiRegister(body: RegisterRequestDTO): Promise<void> {
  return http().request({
    url: '/auth/register',
    method: 'POST',
    body,
  })
    .then(() => {})
}
