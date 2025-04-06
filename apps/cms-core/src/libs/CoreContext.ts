import { getGlobal, MaybePromise } from './utils'

export interface CoreContext {}

export interface CoreContextHooks {
  name: string
  onInit?: () => MaybePromise<void>
  onMount?: () => MaybePromise<void>
}

export type CoreContextPlugin = (context: CoreContext) => void | CoreContextHooks

export interface FeatureModule {
  dependencies?: string[]
  contextPlugin?: (options?: unknown) => CoreContextPlugin
}

const CORE_CONTEXT = Symbol.for('CORE_CONTEXT')

export const createContext = (Context: { new(): any }): CoreContext => {
  const globalTarget = getGlobal()
  if (Reflect.has(globalTarget, CORE_CONTEXT)) {
    return Reflect.get(globalTarget, CORE_CONTEXT)
  }
  const context = new Context()
  Reflect.set(globalTarget, CORE_CONTEXT, context)
  return context
}

export const getCoreContext = (): CoreContext => {
  const globalTarget = getGlobal()
  const context = Reflect.get(globalTarget, CORE_CONTEXT)
  if (!context) {
    throw new Error('ClientContext not found')
  }
  return context
}
