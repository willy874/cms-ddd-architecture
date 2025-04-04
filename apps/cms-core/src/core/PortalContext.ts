import { QueryClient } from '@tanstack/react-query'
import { AnyRouter, RootRoute } from '@tanstack/react-router'
import { EventEmitter } from '@/libs/EventEmitter'
import { StateManager } from '@/libs/StateManager'
import { EventBus } from '@/libs/EventBus'
import { QueryBus } from '@/libs/QueryBus'
import { CommandBus } from '@/libs/CommandBus'
import { StorageManager } from '@/libs/StorageManager'
import { Registry } from '@/libs/Registry'
import { getGlobal } from '@/libs/utils'
import { CoreContext, CoreContextHooks, CoreContextPlugin } from '@/libs/CoreContext'
import { PortalConfig } from './config'

export interface CustomQueryBusDict {}
export interface CustomCommandBusDict {}
export interface CustomEventBusDict {}
export interface CustomComponentDict {}
export interface CustomRouteDict {}

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
type RouteDict = {
  [K in keyof CustomRouteDict]: CustomRouteDict[K]
}

export class PortalContext implements CoreContext {
  config: PortalConfig = {}
  queryClient = new QueryClient()
  emitter = new EventEmitter()
  store = new StateManager()
  queryBus = new QueryBus<QueryBusDict>()
  commandBus = new CommandBus<CommandBusDict>()
  eventBus = new EventBus<EventBusDict>()
  localStorage = new StorageManager(localStorage)
  sessionStorage = new StorageManager(sessionStorage)
  componentRegistry = new Registry<ComponentDict>()
  router!: AnyRouter
  rootRoute!: RootRoute
  routes = new Registry<RouteDict>()

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
    await Promise.all(
      this.pluginHooks.map(hooks => hooks.mount?.()),
    )
  }
}

const PORTAL_CONTEXT = Symbol.for('PORTAL_CONTEXT')

export const createPortal = (config: PortalConfig): PortalContext => {
  const globalTarget = getGlobal()
  if (Reflect.has(globalTarget, PORTAL_CONTEXT)) {
    return Reflect.get(globalTarget, PORTAL_CONTEXT)
  }
  const context = new PortalContext()
  context.config = config
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
    use(plugin: CoreContextPlugin): CoreContext
    run(): Promise<void>
    config: PortalConfig
    queryClient: QueryClient
    emitter: EventEmitter
    store: StateManager
    queryBus: QueryBus<QueryBusDict>
    commandBus: CommandBus<CommandBusDict>
    eventBus: EventBus<EventBusDict>
    localStorage: StorageManager
    sessionStorage: StorageManager
    componentRegistry: Registry<ComponentDict>
    routes: Registry<RouteDict>
  }
}
