import { lazy } from 'react'
import { CoreContextPlugin } from '@/libs/CoreContext'

export const MODULE_NAME = 'cms_core/home'
export const dependencies = ['cms_core/router', 'cms_core/ui', 'cms_core/layout', 'cms_core/auth']

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    context.componentRegistry.register('HomePage', lazy(() => import('./HomePage')))
    return {
      name: MODULE_NAME,
    }
  }
}

declare module '@/modules/core' {
  export interface CustomComponentDict {
    HomePage: () => React.ReactNode
  }
}
