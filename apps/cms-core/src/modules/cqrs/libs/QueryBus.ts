import { QueryClient } from '@tanstack/query-core'
import { AnyFunction, debounce, throttle } from '@/libs/utils'
import { EventEmitter } from '@/libs/EventEmitter'

const QUERY_RESULT = Symbol.for('QUERY_RESULT')

class Query<Name, Params extends unknown[]> {
  context: unknown & {} = {}
  params: Params
  isRefetch = false

  constructor(
    public name: Name,
    ...params: Params
  ) {
    this.params = params
  }
}

interface QueryProvideOptions {
  cache?: boolean
  debounce?: number
  throttle?: number
  only?: boolean
}
interface QueryOptions<Name, Params extends unknown[]> {
  name: Name
  params: Params
  isRefetch?: boolean
}

export class QueryBus<Dict extends Record<string, AnyFunction>> {
  emitter = new EventEmitter()
  queryClient = new QueryClient()
  #dict: Dict = {} as Dict

  #cacheHandler(query: Query<string, unknown[]>, handler: (...params: unknown[]) => unknown) {
    const queryKeys = [query.name, ...query.params]
    const diffValue = (oldValue: unknown, newValue: unknown) => {
      if (Object.is(oldValue, newValue)) {
        return oldValue
      }
      this.queryClient.setQueryData(queryKeys, newValue)
      return newValue
    }
    const cache = this.queryClient.getQueryData(queryKeys)
    if (typeof cache === 'undefined' || query.isRefetch) {
      const result = handler()
      if (result instanceof Promise) {
        return Promise.resolve(result).then(res => diffValue(cache, res))
      }
      else {
        return diffValue(cache, result)
      }
    }
    return cache
  }

  #provide(name: string, handler: (...params: unknown[]) => unknown, options: QueryProvideOptions = {}) {
    if (options.only && this.#dict[name]) {
      throw new Error(`Query name "${name}" already exists.`)
    }
    Reflect.set(this.#dict, name, handler)
    let listener = (query: Query<string, unknown[]>) => {
      if (query.name !== name) {
        return
      }
      const result = options.cache
        ? this.#cacheHandler(query, handler)
        : handler(...query.params)
      Reflect.set(query.context, QUERY_RESULT, result)
      this.emitter.emit('query:result', query)
    }
    if (options.debounce) {
      listener = debounce(listener, options.debounce)
    }
    if (options.throttle) {
      listener = throttle(listener, options.throttle)
    }
    this.emitter.on('query:emit', listener)
    return () => {
      this.emitter.off('query:emit', listener)
    }
  }

  #query(args: QueryOptions<unknown, unknown[]>) {
    const { name, params, isRefetch = false } = args
    const empty = Symbol('empty')
    let result: unknown = empty
    const query = new Query(name, ...params)
    query.isRefetch = isRefetch
    const listener = (q: Query<string, unknown[]>) => {
      if (query === q) {
        result = Reflect.get(q.context, QUERY_RESULT)
        this.emitter.off('query:result', listener)
      }
    }
    this.emitter.on('query:result', listener)
    this.emitter.emit('query:emit', query)
    this.emitter.off('query:result', listener)
    if (empty === result) {
      throw new Error('Query result not found')
    }
    return result
  }

  provide<T extends keyof Dict>(name: T, handler: Dict[T], options: QueryProvideOptions = {}): () => void {
    return this.#provide(name as string, handler, options)
  }

  query<T extends keyof Dict>(name: T, ...params: Parameters<Dict[T]>): ReturnType<Dict[T]>
  query<T extends keyof Dict>(params: QueryOptions<T, Parameters<Dict[T]>>): ReturnType<Dict[T]>
  query<T extends keyof Dict>(...args: unknown[]): ReturnType<Dict[T]> {
    if (args.length === 1 && typeof args[0] === 'object') {
      return this.#query(args[0] as QueryOptions<T, Parameters<Dict[T]>>) as ReturnType<Dict[T]>
    }
    if (typeof args[0] === 'string') {
      const [name, params = []] = args as [T, Parameters<Dict[T]>]
      return this.#query({ name, params }) as ReturnType<Dict[T]>
    }
    throw new Error('Invalid arguments for query')
  }

  has(name: string): boolean {
    return !!this.#dict[name]
  }
}
