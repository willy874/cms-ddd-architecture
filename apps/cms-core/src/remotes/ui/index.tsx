import { CoreContextPlugin } from '@/libs/CoreContext'
import { lazy } from 'react'

export const MODULE_NAME = 'cms_core/ui'

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    context.componentRegistry.register('NotFound', lazy(() => import('./NotFound')))
    return {
      name: MODULE_NAME,
    }
  }
}
