import { EventEmitter } from '@/libs/EventEmitter'
import { QueueMap } from './Queue'
import { AnyFunction, debounce, throttle } from '@/libs/utils'

const COMMAND_RESULT = Symbol.for('COMMAND_RESULT')

class Command<Name, Params extends unknown[]> {
  params: Params
  context: unknown & {} = {}

  constructor(
    public name: Name,
    ...params: Params
  ) {
    this.params = params
  }
}

interface CommandProvideOptions {
  isBlacking?: boolean
  debounce?: number
  throttle?: number
}

interface CommandOptions<Name, Params extends unknown[]> {
  name: Name
  params: Params
}

export class CommandBus<Dict extends Record<string, AnyFunction>> {
  emitter = new EventEmitter()
  queueMap = new QueueMap()

  #provide(name: string, handler: (...params: unknown[]) => unknown, options: CommandProvideOptions = {}) {
    let listener = (command: Command<string, unknown[]>) => {
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

  #command(args: CommandOptions<unknown, unknown[]>): Promise<unknown> {
    const { name, params } = args
    const command = new Command(name, ...params)
    return new Promise((resolve) => {
      const listener = (c: Command<string, unknown[]>) => {
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

  provide<T extends keyof Dict>(name: T, handler: Dict[T], options: CommandProvideOptions = {}): () => void {
    return this.#provide(name as string, handler, options)
  }

  command<T extends keyof Dict>(name: T, ...params: Parameters<Dict[T]>): ReturnType<Dict[T]>
  command<T extends keyof Dict>(params: CommandOptions<T, Parameters<Dict[T]>>): ReturnType<Dict[T]>
  command<T extends keyof Dict>(...args: unknown[]): ReturnType<Dict[T]> {
    if (typeof args[0] === 'string') {
      const [name, ...params] = args as [T, Parameters<Dict[T]>]
      return this.#command({ name, params }) as ReturnType<Dict[T]>
    }
    if (args.length === 1 && typeof args[0] === 'object') {
      return this.#command(args[0] as CommandOptions<T, Parameters<Dict[T]>>) as ReturnType<Dict[T]>
    }
    throw new Error('Invalid arguments for command')
  }
}
