import { QueryClient } from '@tanstack/react-query'
import { AnyRouter, RootRoute } from '@tanstack/react-router'
import { EventEmitter } from '@/libs/EventEmitter'
import { StateManager } from '@/libs/StateManager'
import { EventBus } from '@/libs/EventBus'
import { QueryBus } from '@/libs/QueryBus'
import { CommandBus } from '@/libs/CommandBus'
import { StorageManager } from '@/libs/StorageManager'
import { getGlobal } from '@/libs/utils'
import { CoreContext, CoreContextHooks, CoreContextPlugin } from '@/libs/CoreContext'
import { ComponentRegistry } from '@/libs/ComponentRegistry'

export interface CustomQueryBusDict {}
export interface CustomCommandBusDict {}
export interface CustomEventBusDict {}
export interface CustomComponentDict {}

type QueryBusDict = {
  [K in keyof CustomQueryBusDict]: CustomQueryBusDict[K]
}
type CommandBusDict = {
  [K in keyof CustomCommandBusDict]: CustomCommandBusDict[K]
}
type EventBusDict = {
  [K in keyof CustomEventBusDict]: CustomEventBusDict[K]
}
type ComponentDict = {
  [K in keyof CustomComponentDict]: CustomComponentDict[K]
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
  componentRegistry = new ComponentRegistry<ComponentDict>()
  router!: AnyRouter
  rootRoute!: RootRoute

  constructor() {
    this.queryBus.emitter = this.emitter
    this.queryBus.queryClient = this.queryClient
    this.commandBus.emitter = this.emitter
    this.eventBus.emitter = this.emitter
  }

  private pluginHooks: Partial<CoreContextHooks>[] = []

  use(plugin: CoreContextPlugin): this {
    const result = plugin(this)
    if (result) {
      this.pluginHooks.push(result)
    }
    return this
  }

  async run() {
    for (const hooks of this.pluginHooks) {
      await hooks.init?.()
    }
  }
}

const PORTAL_CONTEXT = Symbol.for('PORTAL_CONTEXT')

export const portalInit = (): PortalContext => {
  const globalTarget = getGlobal()
  if (Reflect.has(globalTarget, PORTAL_CONTEXT)) {
    return Reflect.get(globalTarget, PORTAL_CONTEXT)
  }
  const context = new PortalContext()
  Reflect.set(globalTarget, PORTAL_CONTEXT, context)
  return context
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
    componentRegistry: ComponentRegistry<ComponentDict>
    router: AnyRouter
    rootRoute: RootRoute
    use(plugin: CoreContextPlugin): CoreContext
    run(): Promise<void>
  }
}
