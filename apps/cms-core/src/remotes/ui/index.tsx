import { CoreContextPlugin } from '@/libs/CoreContext'
import { lazy } from 'react'

export const MODULE_NAME = 'cms_core/ui'

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    context.componentRegistry.register('NotFound', lazy(() => import('./NotFound')))
    context.componentRegistry.register('Button', lazy(() => import('./Button')))
    context.componentRegistry.register('ConfigProvider', lazy(() => import('./ConfigProvider')))
    context.componentRegistry.register('Form', lazy(() => import('./Form')))
    context.componentRegistry.register('TextField', lazy(() => import('./TextField')))
    context.componentRegistry.register('Teleport', lazy(() => import('./Teleport')))
    context.componentRegistry.register('Spin', lazy(() => import('./Spin')))
    context.componentRegistry.register('Input', lazy(() => import('./Input')))

    return {
      name: MODULE_NAME,
    }
  }
}
