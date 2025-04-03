import { EventEmitter } from './EventEmitter'
import { QueueMap } from './Queue'
import { AnyFunction, debounce, throttle } from './utils'

const COMMAND_RESULT = Symbol.for('COMMAND_RESULT')

export class BaseCommand<Name, Params extends unknown[]> {
  params: Params
  context: unknown & {} = {}

  constructor(
    public name: Name,
    ...params: Params
  ) {
    this.params = params
  }
}

interface CommandOptions {
  isBlacking?: boolean
  debounce?: number
  throttle?: number
}

export class CommandBus<Dict extends Record<string, AnyFunction>> {
  emitter = new EventEmitter()
  queueMap = new QueueMap()

  dynamicProvide(name: string, handler: (...params: unknown[]) => unknown, options: CommandOptions = {}) {
    let listener = (command: BaseCommand<string, unknown[]>) => {
      if (command.name !== name) {
        return
      }
      const fn = () => Promise.resolve(handler(...command.params))
      let promise: Promise<unknown> = Promise.resolve()
      if (options.isBlacking) {
        const queue = this.queueMap.get(name)
        promise = queue.dispatch(fn)
      }
      else {
        promise = fn()
      }
      promise.then((result) => {
        Reflect.set(command.context, COMMAND_RESULT, result)
        this.emitter.emit('command:result', command)
      })
        .catch(() => {})
    }
    if (options.debounce) {
      listener = debounce(listener, options.debounce)
    }
    if (options.throttle) {
      listener = throttle(listener, options.throttle)
    }
    this.emitter.on('command:emit', listener)
    return () => {
      this.emitter.off('command:emit', listener)
    }
  }

  dynamicCommand(command: BaseCommand<string, unknown[]>) {
    return new Promise((resolve) => {
      const listener = (c: BaseCommand<string, unknown[]>) => {
        if (command === c) {
          const result = Reflect.get(c.context, COMMAND_RESULT)
          resolve(result)
          this.emitter.off('command:result', listener)
        }
      }
      this.emitter.on('command:result', listener)
      this.emitter.emit('command:emit', command)
    })
  }

  provide<T extends keyof Dict>(name: T, handler: Dict[T], options: CommandOptions = {}): () => void {
    return this.dynamicProvide(name as string, handler, options)
  }

  command<T extends keyof Dict>(query: BaseCommand<T, Parameters<Dict[T]>>): ReturnType<Dict[T]> {
    return this.dynamicCommand(query as any) as ReturnType<Dict[T]>
  }
}
