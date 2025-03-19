import { ClientContext } from './ClientContext'
import { AnyFunction, debounce, throttle } from './utils'

const QUERY_SYMBOL = Symbol.for('QUERY_SYMBOL')
const QUERY_RESULT = Symbol.for('QUERY_RESULT')

export class BaseQuery<Name, Params extends unknown[]> {
  [QUERY_SYMBOL] = true
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
  #ctx!: ClientContext

  private get ctx() {
    if (!this.#ctx) {
      throw new Error('EventBus not initialized')
    }
    return this.#ctx
  }

  init(cache: ClientContext) {
    if (this.#ctx) {
      throw new Error('EventBus already initialized')
    }
    this.#ctx = cache
  }

  dynamicProvide(name: string, handler: (...params: unknown[]) => unknown, options: QueryOptions = {}) {
    let listener = (query: BaseQuery<string, unknown[]>) => {
      if (query.name !== name) {
        return
      }
      const queryKeys = [name, ...query.params]
      let result = this.ctx.query.getQueryData(queryKeys)
      if (options.cache) {
        if (typeof result === 'undefined' || query.isRefetch) {
          const newResult = handler(...query.params)
          if (!Object.is(result, newResult)) {
            result = newResult
            this.ctx.query.setQueryData(queryKeys, result)
          }
        }
      }
      else {
        result = handler(...query.params)
      }
      Reflect.set(query.context, QUERY_RESULT, result)
      this.ctx.emitter.emit('query:result', query)
    }
    if (options.debounce) {
      listener = debounce(listener, options.debounce)
    }
    if (options.throttle) {
      listener = throttle(listener, options.throttle)
    }
    this.ctx.emitter.on('query:emit', listener)
    return () => {
      this.ctx.emitter.off('query:emit', listener)
    }
  }

  dynamicQuery(query: BaseQuery<string, unknown[]>) {
    const empty = Symbol('empty')
    let result: unknown = empty
    const listener = (q: BaseQuery<string, unknown[]>) => {
      if (query === q) {
        result = Reflect.get(q.context, QUERY_RESULT)
        this.ctx.emitter.off('query:result', listener)
      }
    }
    this.ctx.emitter.on('query:result', listener)
    this.ctx.emitter.emit('query:emit', query)
    this.ctx.emitter.off('query:result', listener)
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
