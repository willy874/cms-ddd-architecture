import { ClientContext } from './ClientContext'

export class QueryBus {
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

  provide() {
    this.ctx.emitter.on('query:provide', (query: any) => {})
  }

  query() {}
}
