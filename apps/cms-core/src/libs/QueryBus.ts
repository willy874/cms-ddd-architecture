import { QueryClient } from '@tanstack/react-query'
import { AnyFunction, debounce, throttle } from './utils'
import { EventEmitter } from './EventEmitter'

const QUERY_RESULT = Symbol.for('QUERY_RESULT')

export class BaseQuery<Name, Params extends unknown[]> {
  context: unknown & {} = {}
  params: Params
  isRefetch = false

  constructor(
    public name: Name,
    ...params: Params
  ) {
    this.params = params
  }

  refetch() {
    this.isRefetch = true
    return this
  }
}

interface QueryOptions {
  cache?: boolean
  debounce?: number
  throttle?: number
}

export class QueryBus<Dict extends Record<string, AnyFunction>> {
  emitter = new EventEmitter()
  queryClient = new QueryClient()

  private cacheHandler(query: BaseQuery<string, unknown[]>, handler: (...params: unknown[]) => unknown) {
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

  dynamicProvide(name: string, handler: (...params: unknown[]) => unknown, options: QueryOptions = {}) {
    let listener = (query: BaseQuery<string, unknown[]>) => {
      if (query.name !== name) {
        return
      }
      const result = options.cache
        ? this.cacheHandler(query, handler)
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

  dynamicQuery(query: BaseQuery<string, unknown[]>) {
    const empty = Symbol('empty')
    let result: unknown = empty
    const listener = (q: BaseQuery<string, unknown[]>) => {
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

  provide<T extends keyof Dict>(name: T, handler: Dict[T], options: QueryOptions = {}): () => void {
    return this.dynamicProvide(name as string, handler, options)
  }

  query<T extends keyof Dict>(query: BaseQuery<T, Parameters<Dict[T]>>): ReturnType<Dict[T]> {
    return this.dynamicQuery(query as any) as ReturnType<Dict[T]>
  }
}
