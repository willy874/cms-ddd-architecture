import { lazy } from 'react'
import { CoreContextPlugin } from '@/libs/CoreContext'
import { MODULE_NAME } from './constants'

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
