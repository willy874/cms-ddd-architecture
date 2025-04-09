export type ExtractParams<Path extends string> =
  Path extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractParams<`/${Rest}`>
    : Path extends `${string}:${infer Param}`
      ? Param
      : never

function urlInjectParams<T extends string>(url: T, params: Record<ExtractParams<T>, string | number | string[]>): string {
  let result: string = url
  for (const key in params) {
    const value = Reflect.get(params, key)
    if (Array.isArray(value)) {
      result = result.replace(`:${key}`, String(value))
    }
    if (typeof value === 'string' || typeof value === 'number') {
      result = result.replace(`:${key}`, String(value))
    }
  }
  return result
}

interface CreateUrlParams<T extends string> {
  url: T
  baseUrl?: string
  params?: Record<ExtractParams<T>, string | number | string[]>
  query?: string[][] | Record<string, string> | string | URLSearchParams
}

export function createHttpUrl<T extends string>(options: CreateUrlParams<T>): string {
  const { url, baseUrl, params, query } = options
  let result = urlInjectParams(url, params || {} as any)
  const replaceSlash = (u: string) => {
    const [protocol, path] = u.split('://')
    return `${protocol}://${path.replace(/\/+/g, '/')}`
  }
  const searchParams = new URLSearchParams(query)
  if (searchParams.size) {
    result += `?${searchParams}`
  }
  if (baseUrl) {
    if (/^https?\/\/:/.test(result)) {
      return replaceSlash(baseUrl)
    }
    if (/^https?\/\/:/.test(baseUrl)) {
      return replaceSlash(`${baseUrl}/${result}`)
    }
    return replaceSlash(`${location.origin}/${baseUrl}/${result}`)
  }
  if (/^https?\/\/:/.test(result)) {
    return replaceSlash(result)
  }
  return replaceSlash(`${location.origin}/${result}`)
}
