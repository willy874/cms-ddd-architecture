import { MaybePromise } from './utils'

export interface CoreContext {}

export interface CoreContextHooks {
  init: () => MaybePromise<void>
}

export type CoreContextPlugin = (context: CoreContext) => void | Partial<CoreContextHooks>
