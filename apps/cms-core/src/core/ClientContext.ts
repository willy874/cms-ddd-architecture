import { QueryClient } from '@tanstack/react-query'
import { EventEmitter } from '../libs/EventEmitter'
import { StateManager } from '../libs/StateManager'
import { EventBus } from '../libs/EventBus'
import { QueryBus } from '../libs/QueryBus'
import { CommandBus } from '../libs/CommandBus'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CustomQueryBusDict {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CustomCommandBusDict {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CustomEventBusDict {}

type QueryBusDict = {
  [K in keyof CustomQueryBusDict]: CustomQueryBusDict[K]
}
type CommandBusDict = {
  [K in keyof CustomCommandBusDict]: CustomCommandBusDict[K]
}
type EventBusDict = {
  [K in keyof CustomEventBusDict]: CustomEventBusDict[K]
}

export class ClientContext {
  queryClient = new QueryClient()
  emitter = new EventEmitter()
  store = new StateManager()
  queryBus = new QueryBus<QueryBusDict>()
  commandBus = new CommandBus<CommandBusDict>()
  eventBus = new EventBus<EventBusDict>()

  constructor() {
    this.queryBus.emitter = this.emitter
    this.queryBus.queryClient = this.queryClient
    this.commandBus.emitter = this.emitter
  }
}
