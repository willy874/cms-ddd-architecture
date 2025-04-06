import { AnyFunction } from '@/libs/utils'

const EVENT_SYMBOL = Symbol.for('EVENT_SYMBOL')
const EVENT_RESULT = Symbol.for('EVENT_RESULT')

class BaseEvent<Name, Params extends unknown[]> {
  [EVENT_SYMBOL] = true
  context: unknown & {} = {}
  params: Params

  constructor(
    public name: Name,
    ...params: Params
  ) {
    this.params = params
  }

  #cancelable = false
  get cancelable() {
    return this.#cancelable
  }

  cancel() {
    this.#cancelable = true
  }
}

interface EventOptions {
  maxHandler?: number
  debounce?: number
  throttle?: number
  noack?: boolean
}

export class EventBus<Dict extends Record<string, AnyFunction>> {
  listenerMap: Map<string, AnyFunction[]> = new Map()

  #off(event: string, listener: AnyFunction) {
    const listeners = this.listenerMap.get(event) || []
    this.listenerMap.set(event, listeners.filter(l => l !== listener))
  }

  #on(event: string, listener: AnyFunction) {
    const listeners = this.listenerMap.get(event) || []
    this.listenerMap.set(event, [...listeners, listener])
    return () => {
      this.#off(event, listener)
    }
  }

  #emit(event: string, ...args: unknown[]) {
    const listeners = this.listenerMap.get(event) || []
    for (const listener of listeners) {
      listener(...args)
    }
  }

  #subscribe(
    name: string,
    callback: (e: BaseEvent<unknown, any>) => unknown,
    options: EventOptions = {},
  ): () => void {
    let count = options.maxHandler || Infinity
    const eventType = `event:${name}`
    const listener = (event: BaseEvent<any, any>) => {
      if (event.cancelable) {
        return
      }
      if (options.noack) {
        callback(event)
      }
      else {
        const result = callback(event)
        if (!Reflect.has(event.context, EVENT_RESULT)) {
          Reflect.set(event.context, EVENT_RESULT, [])
        }
        const results = Reflect.get(event.context, EVENT_RESULT) as unknown[]
        Reflect.set(event.context, EVENT_RESULT, [...results, result])
      }
      if (--count === 0) {
        this.#off(eventType, listener)
      }
    }
    this.#on(eventType, listener)
    return () => {
      this.#off(eventType, listener)
    }
  }

  #publish(event: BaseEvent<string, unknown[]>): unknown[] {
    const eventType = `event:${String(event.name)}`
    this.#emit(eventType, event)
    return Reflect.get(event.context, EVENT_RESULT) as unknown[]
  }

  subscribe<T extends keyof Dict>(name: T, callback: (e: BaseEvent<T, Parameters<Dict[T]>>) => ReturnType<Dict[T]>, options: EventOptions = {}): () => void {
    return this.#subscribe(name as string, callback as any, options)
  }

  publish<T extends keyof Dict>(event: BaseEvent<T, Parameters<Dict[T]>>): ReturnType<Dict[T]>[] {
    return this.#publish(event as any) as ReturnType<Dict[T]>[]
  }
}
