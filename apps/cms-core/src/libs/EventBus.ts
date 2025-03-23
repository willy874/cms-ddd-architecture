import { EventEmitter } from './EventEmitter'
import { AnyFunction, debounce, throttle } from './utils'

const EVENT_SYMBOL = Symbol.for('EVENT_SYMBOL')
const EVENT_RESULT = Symbol.for('EVENT_RESULT')

export class BaseEvent<Name, Params extends unknown[]> {
  [EVENT_SYMBOL] = true
  context: unknown & {} = {}
  params: Params

  cancelable = false

  constructor(
    public name: Name,
    ...params: Params
  ) {
    this.params = params
  }

  cancel() {
    this.cancelable = true
  }
}

interface EventOptions {
  actionCount?: number
  debounce?: number
  throttle?: number
}

export class EventBus<Dict extends Record<string, AnyFunction>> {
  emitter = new EventEmitter()

  dynamicOn(
    name: string,
    callback: (e: BaseEvent<unknown, any>) => unknown,
    options: EventOptions = {},
  ): () => void {
    let count = options.actionCount || Infinity
    const eventType = `event:${name}`
    let listener = (event: BaseEvent<any, any>) => {
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
        this.emitter.off(eventType, listener)
      }
    }
    if (options.debounce) {
      listener = debounce(listener, options.debounce)
    }
    if (options.throttle) {
      listener = throttle(listener, options.throttle)
    }
    this.emitter.on(eventType, listener)
    return () => {
      this.emitter.off(eventType, listener)
    }
  }

  dynamicEmit(event: BaseEvent<string, unknown[]>): unknown[] {
    const eventType = `event:${String(event.name)}`
    this.emitter.emit(eventType, event)
    return Reflect.get(event.context, EVENT_RESULT) as unknown[]
  }

  on<T extends keyof Dict>(name: T, callback: (e: BaseEvent<T, Parameters<Dict[T]>>) => ReturnType<Dict[T]>, options: EventOptions = {}): () => void {
    return this.dynamicOn(name as string, callback as any, options)
  }

  emit<T extends keyof Dict>(event: BaseEvent<T, Parameters<Dict[T]>>): ReturnType<Dict[T]>[] {
    return this.dynamicEmit(event as any) as ReturnType<Dict[T]>[]
  }
}
