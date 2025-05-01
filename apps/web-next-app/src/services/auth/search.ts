import { QueryFunctionContext, queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getQueryClient } from '@/shared/client'
import { authClient as client } from '@/resources'

export const SEARCH_QUERY_KEY = ['search'] as const

type RequestDTO = Parameters<typeof client.search>[0]
type ResponseDTO = Awaited<ReturnType<typeof client.search>>['body']

export const fetchSearch = (params?: RequestDTO) => {
  return client.search({ query: params })
    .then((res) => {
      if (res.status === 200) {
        return res.body
      }
      return Promise.reject(new Error('Error fetching data'))
    })
}

const pokemonOptions = (params?: RequestDTO) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const queryFn = (context: QueryFunctionContext<typeof SEARCH_QUERY_KEY>): Promise<ResponseDTO> => {
    // console.log('context', context)
    return fetchSearch(params)
  }
  return queryOptions({
    queryKey: SEARCH_QUERY_KEY,
    queryFn,
  } as const)
}

export const useSearchQuery = (params?: RequestDTO) => {
  return useSuspenseQuery(pokemonOptions(params))
}

export async function prefetchSearch(params?: RequestDTO) {
  const queryClient = getQueryClient()
  const options = pokemonOptions(params)
  await queryClient.prefetchQuery(options)
  const result = queryClient.getQueryData(options.queryKey)
  return result
}
