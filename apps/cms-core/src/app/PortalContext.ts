import { QueryClient } from '@tanstack/query-core'
import { EventEmitter } from '@/libs/EventEmitter'
import { StateManager } from '@/libs/StateManager'
import { StorageManager } from '@/libs/StorageManager'
import { Registry } from '@/libs/Registry'
import { BaseCoreContext, CoreContext, createContext } from '@/libs/CoreContext'
import { PortalConfig } from '@/libs/PortalConfig'
import { CustomComponentDict } from '@/modules/core'

type ComponentDict = {
  [K in keyof CustomComponentDict]: CustomComponentDict[K]
}

export class PortalContext extends BaseCoreContext {
  config: PortalConfig = {}
  queryClient = new QueryClient()
  emitter = new EventEmitter()
  store = new StateManager()
  localStorage = new StorageManager(localStorage)
  sessionStorage = new StorageManager(sessionStorage)
  componentRegistry = new Registry<ComponentDict>({}, { defaultValue: () => null })
}

export const createPortal = (config: PortalConfig): CoreContext => {
  if (typeof window === 'undefined') {
    throw new Error('Portal can only be used in the browser')
  }
  const context = createContext(PortalContext)
  context.config = config
  return context as any
}

declare module '@/libs/CoreContext' {
  export interface CoreContext {
    config: PortalConfig
    queryClient: QueryClient
    emitter: EventEmitter
    store: StateManager
    localStorage: StorageManager
    sessionStorage: StorageManager
    componentRegistry: Registry<ComponentDict>
  }
}
