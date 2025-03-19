import { ClientContext } from './ClientContext'

export class MutationBus {
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
}
