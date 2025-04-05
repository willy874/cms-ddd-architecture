import { MaybePromise } from './utils'

export interface CoreContext {}

export interface CoreContextHooks {
  name: string
  init: () => MaybePromise<void>
  mount: () => MaybePromise<void>
}

export type CoreContextPlugin = (context: CoreContext) => void | Partial<CoreContextHooks>

export interface FeatureModule {
  dependencies?: string[]
  contextPlugin?: (options?: unknown) => CoreContextPlugin
}
