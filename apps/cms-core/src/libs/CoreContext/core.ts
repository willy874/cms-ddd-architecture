import { getGlobal, MaybePromise } from '../utils'

export interface CoreContext {
  use(plugin: CoreContextPlugin): CoreContext
  useModule<T extends object>(module?: FeatureModule | null, options?: T): CoreContext
  run(): Promise<void>
}

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

export class BaseCoreContext {
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
