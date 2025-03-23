import { QueryClient } from '@tanstack/react-query'
import { EventEmitter } from '@/libs/EventEmitter'
import { StateManager } from '@/libs/StateManager'
import { EventBus } from '@/libs/EventBus'
import { QueryBus } from '@/libs/QueryBus'
import { CommandBus } from '@/libs/CommandBus'
import { StorageManager } from '@/libs/StorageManager'
import { getGlobal } from '@/libs/utils'
import { CoreContext } from '@/libs/CoreContext'

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

export class PortalContext implements CoreContext {
  queryClient = new QueryClient()
  emitter = new EventEmitter()
  store = new StateManager()
  queryBus = new QueryBus<QueryBusDict>()
  commandBus = new CommandBus<CommandBusDict>()
  eventBus = new EventBus<EventBusDict>()
  localStorage = new StorageManager(localStorage)
  sessionStorage = new StorageManager(sessionStorage)

  constructor() {
    this.queryBus.emitter = this.emitter
    this.queryBus.queryClient = this.queryClient
    this.commandBus.emitter = this.emitter
    this.eventBus.emitter = this.emitter
  }
}

const PORTAL_CONTEXT = Symbol.for('PORTAL_CONTEXT')

export const init = () => {
  const globalTarget = getGlobal()
  Reflect.set(globalTarget, PORTAL_CONTEXT, new PortalContext())
}

export const getPortalContext = (): PortalContext => {
  const globalTarget = getGlobal()
  const context = Reflect.get(globalTarget, PORTAL_CONTEXT)
  if (!context) {
    throw new Error('ClientContext not found')
  }
  return context
}

declare module '@/libs/CoreContext' {
  export interface CoreContext {
    queryClient: QueryClient
    emitter: EventEmitter
    store: StateManager
    queryBus: QueryBus<QueryBusDict>
    commandBus: CommandBus<CommandBusDict>
    eventBus: EventBus<EventBusDict>
    localStorage: StorageManager
    sessionStorage: StorageManager
  }
}
