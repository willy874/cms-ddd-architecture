import { CREATE_AUTH_HTTP_INSTANCE, CREATE_BASE_HTTP_INSTANCE } from '@/constants/query'
import { getCoreContext } from './CoreContext'

export interface HttpResult<T = unknown> {
  code: number
  message: string
  data: T
}

export function http() {
  return getCoreContext().queryBus.query(CREATE_BASE_HTTP_INSTANCE)
}

export function httpAuth() {
  return getCoreContext().queryBus.query(CREATE_AUTH_HTTP_INSTANCE)
}
