export interface FetcherConfig {
  url: string
  method: string
  body?: any
  query?: string[][] | Record<string, string> | URLSearchParams | string
  params?: Record<string, any>
  headers?: Record<string, string>
}

export interface FetcherResponse<Data = any> {
  data: Data
  status: number
  headers: Headers
}

export interface ApiFetcher {
  request: (config: FetcherConfig) => Promise<FetcherResponse>
}

export interface HttpResult<T = unknown> {
  code: number
  message: string
  data: T
}
