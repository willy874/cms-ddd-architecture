import { ClientContext } from './ClientContext'
import { QueueMap } from './Queue'
import { debounce, throttle } from './utils'

const COMMAND_SYMBOL = Symbol.for('COMMAND_SYMBOL')
const COMMAND_RESULT = Symbol.for('COMMAND_RESULT')

export class BaseCommand<Name, Params extends unknown[]> {
  [COMMAND_SYMBOL] = true
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

export class CommandBus {
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
        this.ctx.emitter.emit('command:result', command)
      })
        .catch(() => {})
    }
    if (options.debounce) {
      listener = debounce(listener, options.debounce)
    }
    if (options.throttle) {
      listener = throttle(listener, options.throttle)
    }
    this.ctx.emitter.on('command:emit', listener)
    return () => {
      this.ctx.emitter.off('command:emit', listener)
    }
  }

  dynamicCommand(command: BaseCommand<string, unknown[]>) {
    return new Promise((resolve) => {
      const listener = (c: BaseCommand<string, unknown[]>) => {
        if (command === c) {
          const result = Reflect.get(c.context, COMMAND_RESULT)
          resolve(result)
          this.ctx.emitter.off('command:result', listener)
        }
      }
      this.ctx.emitter.on('command:result', listener)
      this.ctx.emitter.emit('command:emit', command)
    })
  }
}
