import { QueryFunctionContext, queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getQueryClient } from '@/shared/client'
import { authClient as client } from '@/resources'

export const TEST_QUERY_KEY = ['test'] as const

type RequestDTO = Parameters<typeof client.test>[0]
type ResponseDTO = Awaited<ReturnType<typeof client.test>>['body']

export const fetchTest = (params?: RequestDTO) => {
  return client.test({ query: params })
    .then((res) => {
      if (res.status === 200) {
        return res.body
      }
      return Promise.reject(new Error('Error fetching data'))
    })
}

const pokemonOptions = (params?: RequestDTO) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const queryFn = (context: QueryFunctionContext<typeof TEST_QUERY_KEY>): Promise<ResponseDTO> => {
    // console.log('context', context)
    return fetchTest(params)
  }
  return queryOptions({
    queryKey: TEST_QUERY_KEY,
    queryFn,
  } as const)
}

export const useTestQuery = (params?: RequestDTO) => {
  return useSuspenseQuery(pokemonOptions(params))
}

export async function prefetchData(params?: RequestDTO) {
  const queryClient = getQueryClient()
  const options = pokemonOptions(params)
  await queryClient.prefetchQuery(options)
  const result = queryClient.getQueryData(options.queryKey)
  return result as ResponseDTO
}
