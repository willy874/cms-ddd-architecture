import { AxiosError, AxiosResponse, isAxiosError, Method } from 'axios'
import { ApiFetcherArgs, InitClientArgs } from '@ts-rest/core'
import { flattenAxiosConfigHeaders } from '@/shared/http'
import { http } from './common'

const restApi = async ({ path, method, headers, body }: ApiFetcherArgs) => {
  try {
    const result = await http().request({
      method: method as Method,
      url: path,
      headers,
      data: body,
    })
    return {
      status: result.status,
      body: result.data,
      headers: new Headers(flattenAxiosConfigHeaders(method, result.headers)),
    }
  }
  catch (e: Error | AxiosError | unknown) {
    if (isAxiosError(e)) {
      const error = e as AxiosError
      const response = error.response as AxiosResponse
      return {
        status: response.status,
        body: response.data,
        headers: new Headers(flattenAxiosConfigHeaders(method, response.headers)),
      }
    }
    throw e
  }
}

export const defaultOptions = {
  baseUrl: '',
  api: restApi,
  validateResponse: true,
} as const satisfies InitClientArgs
