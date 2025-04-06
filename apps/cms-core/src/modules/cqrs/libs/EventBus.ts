import { AnyFunction, debounce, throttle } from '@/libs/utils'

const EVENT_SYMBOL = Symbol.for('EVENT_SYMBOL')
const EVENT_RESULT = Symbol.for('EVENT_RESULT')

class BaseEvent<Name, Handler extends AnyFunction> {
  [EVENT_SYMBOL] = true
  context: unknown & {} = {}
  params: Parameters<Handler>
  results: ReturnType<Handler>[]

  constructor(
    public name: Name,
    ...params: Parameters<Handler>
  ) {
    this.params = params
    this.results = []
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
}

interface ChannelOptions {
  debounce?: number
  throttle?: number
  noack?: boolean
}

class EventChannel<Name, Handler extends AnyFunction> {
  listeners: ((event: BaseEvent<Name, Handler>) => ReturnType<Handler>)[] = []
  emit: (...args: Parameters<Handler>) => ReturnType<Handler>[]

  constructor(private name: Name, options: ChannelOptions = {}) {
    const emit: this['emit'] = (...params) => {
      const event = new BaseEvent<Name, Handler>(this.name, ...params)
      for (const listener of this.listeners) {
        listener(event)
      }
      return [] as any
    }
    this.emit = emit
    if (options.debounce) {
      this.emit = debounce(emit, options.debounce)
    }
    if (options.throttle) {
      this.emit = throttle(emit, options.throttle)
    }
  }

  on(callback: (event: BaseEvent<Name, Handler>) => ReturnType<Handler>) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback)
    }
  }

  off(callback: (event: BaseEvent<Name, Handler>) => ReturnType<Handler>) {
    this.listeners = this.listeners.filter(l => l !== callback)
  }

  subscribe(callback: Handler, options: EventOptions = {}): () => void {
    let count = options.maxHandler || Infinity
    const listener = (event: BaseEvent<any, AnyFunction>) => {
      if (event.cancelable) {
        return
      }
      const result = callback(event)
      if (!Reflect.has(event.context, EVENT_RESULT)) {
        Reflect.set(event.context, EVENT_RESULT, [])
      }
      const results = Reflect.get(event.context, EVENT_RESULT) as unknown[]
      Reflect.set(event.context, EVENT_RESULT, [...results, result])
      if (--count === 0) {
        this.off(listener)
      }
      return result
    }
    return this.on(listener)
  }

  publish(event: BaseEvent<Name, Handler>) {
    return this.emit(...event.params)
  }
}

export class EventBus<Dict extends Record<string, AnyFunction>> {
  private channels: Map<any, EventChannel<any, AnyFunction>> = new Map()

  channel<T extends keyof Dict>(name: T, options: ChannelOptions) {
    if (this.channels.has(name as string)) {
      return this.channels.get(name as string) as EventChannel<T, Dict[T]>
    }
    const channel = new EventChannel<T, Dict[T]>(name, options)
    this.channels.set(name, channel)
    return this
  }

  subscribe<T extends keyof Dict>(name: T, callback: (e: BaseEvent<T, Dict[T]>) => ReturnType<Dict[T]>, options: EventOptions = {}): () => void {
    const channel = this.channels.get(name)
    if (!channel) {
      throw new Error(`Channel ${String(name)} not found`)
    }
    return channel.subscribe(callback, options)
  }

  publish<T extends keyof Dict>(event: BaseEvent<T, Dict[T]>): ReturnType<Dict[T]>[] {
    const channel = this.channels.get(event.name)
    if (!channel) {
      throw new Error(`Channel ${String(event.name)} not found`)
    }
    return channel.emit(...event.params)
  }
}
