import { CoreContextPlugin } from '@/libs/CoreContext'
import { lazy } from 'react'

export const MODULE_NAME = 'cms_core/ui'

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    context.componentRegistry.register('NotFound', lazy(() => import('./NotFound')) as any)
    context.componentRegistry.register('Button', lazy(() => import('./Button')) as any)
    context.componentRegistry.register('ConfigProvider', lazy(() => import('./ConfigProvider')) as any)
    context.componentRegistry.register('Form', lazy(() => import('./Form')) as any)
    context.componentRegistry.register('TextField', lazy(() => import('./TextField')) as any)
    context.componentRegistry.register('Teleport', lazy(() => import('./Teleport')) as any)
    context.componentRegistry.register('Spin', lazy(() => import('./Spin')) as any)
    context.componentRegistry.register('Input', lazy(() => import('./Input')) as any)
    context.componentRegistry.register('Collapsible', lazy(() => import('./Collapsible')) as any)
    context.componentRegistry.register('CollapsibleTrigger', lazy(async () => ({ default: (await import('./Collapsible')).CollapsibleTrigger })) as any)
    context.componentRegistry.register('CollapsibleContent', lazy(async () => ({ default: (await import('./Collapsible')).CollapsibleContent })) as any)

    return {
      name: MODULE_NAME,
    }
  }
}
