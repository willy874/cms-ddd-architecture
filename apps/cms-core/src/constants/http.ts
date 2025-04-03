export interface HttpResult<T = unknown> {
  code: number
  message: string
  data: T
}

export enum HttpErrorCode {
  TOKEN_EMPTY = 40101,
  TOKEN_INVALID = 40102,
  TOKEN_EXPIRED = 40103,
}

export const TOKEN_TYPE = 'Bearer'
