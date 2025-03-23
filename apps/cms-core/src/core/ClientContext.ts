import { QueryClient } from '@tanstack/react-query'
import { EventEmitter } from '../libs/EventEmitter'
import { StateManager } from '../libs/StateManager'
import { EventBus } from '../libs/EventBus'
import { QueryBus } from '../libs/QueryBus'
import { CommandBus } from '../libs/CommandBus'

export class ClientContext {
  queryClient = new QueryClient()
  emitter = new EventEmitter()
  store = new StateManager()
  eventBus = new EventBus()
  queryBus = new QueryBus()
  commandBus = new CommandBus()

  constructor() {
    this.queryBus.emitter = this.emitter
    this.queryBus.queryClient = this.queryClient
    this.commandBus.emitter = this.emitter
  }
}
