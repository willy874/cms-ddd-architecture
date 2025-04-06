import { QueryClient } from '@tanstack/query-core'
import { EventEmitter } from '@/libs/EventEmitter'
import { StateManager } from '@/libs/StateManager'
import { StorageManager } from '@/libs/StorageManager'
import { Registry } from '@/libs/Registry'
import { CoreContext, CoreContextHooks, CoreContextPlugin, createContext, FeatureModule } from '@/libs/CoreContext'
import { PortalConfig } from './config'
import { CustomComponentDict } from './custom'

type ComponentDict = {
  [K in keyof CustomComponentDict]: CustomComponentDict[K]
}

export class PortalContext {
  config: PortalConfig = {}
  queryClient = new QueryClient()
  emitter = new EventEmitter()
  store = new StateManager()
  localStorage = new StorageManager(localStorage)
  sessionStorage = new StorageManager(sessionStorage)
  componentRegistry = new Registry<ComponentDict>({}, { defaultValue: () => null })

  private pluginHooks: Partial<CoreContextHooks>[] = []

  use(plugin: CoreContextPlugin): this {
    const result = plugin(this as unknown as CoreContext)
    if (result) {
      this.pluginHooks.push(result)
    }
    return this
  }

  useModule<T extends object>(module?: FeatureModule | null, options?: T): this {
    if (!module) {
      throw new Error('Module is not defined')
    }
    const { dependencies, contextPlugin } = module
    if (!contextPlugin) {
      throw new Error('Module contextPlugin is not defined')
    }
    if (dependencies && !dependencies.every((dep) => this.pluginHooks.some(hook => hook.name === dep))) {
      throw new Error(`Module dependencies not met`)
    }
    return this.use(contextPlugin(options))
  }

  async run() {
    for (const hooks of this.pluginHooks) {
      await hooks.onInit?.()
    }
    await Promise.all(
      this.pluginHooks.map(hooks => hooks.onMount?.()),
    )
  }
}

export const createPortal = (config: PortalConfig): CoreContext => {
  const context = createContext(PortalContext)
  context.config = config
  return context as any
}

declare module '@/libs/CoreContext' {
  export interface CoreContext {
    use(plugin: CoreContextPlugin): CoreContext
    useModule<T extends object>(module?: FeatureModule | null, options?: T): CoreContext
    run(): Promise<void>
    config: PortalConfig
    queryClient: QueryClient
    emitter: EventEmitter
    store: StateManager
    localStorage: StorageManager
    sessionStorage: StorageManager
    componentRegistry: Registry<ComponentDict>
  }
}
