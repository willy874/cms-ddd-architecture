import { ClientContext } from './ClientContext'
import { AnyFunction, debounce, throttle } from './utils'

interface IBaseEvent<Name, Params> {
  name: Name
  context: unknown & {}
  params: Params
}

const EVENT_SYMBOL = Symbol.for('EVENT_SYMBOL')
const EVENT_RESULT = Symbol.for('EVENT_RESULT')

export class BaseEvent<Name, Params extends unknown[]> implements IBaseEvent<Name, Params> {
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
  _ctx!: ClientContext

  private get ctx() {
    if (!this._ctx) {
      throw new Error('EventBus not initialized')
    }
    return this._ctx
  }

  init(cache: ClientContext) {
    if (this._ctx) {
      throw new Error('EventBus already initialized')
    }
    this._ctx = cache
  }

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
        this.ctx.emitter.off(eventType, listener)
      }
    }
    if (options.debounce) {
      listener = debounce(listener, options.debounce)
    }
    if (options.throttle) {
      listener = throttle(listener, options.throttle)
    }
    this.ctx.emitter.on(eventType, listener)
    return () => {
      this.ctx.emitter.off(eventType, listener)
    }
  }

  dynamicEmit(event: IBaseEvent<string, any>): unknown[] {
    const eventType = `event:${String(event.name)}`
    if (event instanceof BaseEvent) {
      this.ctx.emitter.emit(eventType, event)
    }
    else {
      this.ctx.emitter.emit(eventType, new BaseEvent(event.name, ...event.params))
    }
    return Reflect.get(event.context, EVENT_RESULT) as unknown[]
  }

  on<T extends keyof Dict>(name: T, callback: (e: BaseEvent<T, Parameters<Dict[T]>>) => ReturnType<Dict[T]>): () => void {
    return this.dynamicOn(name as string, callback as any)
  }

  emit<T extends keyof Dict>(event: IBaseEvent<T, Parameters<Dict[T]>>): ReturnType<Dict[T]>[] {
    return this.dynamicEmit(event as any) as ReturnType<Dict[T]>[]
  }
}
