import { CoreContextPlugin } from '@/libs/CoreContext'
import NotFound from './NotFound'

export const MODULE_NAME = 'cms_core/ui'

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    context.componentRegistry.register('NotFound', NotFound)
    return {
      name: MODULE_NAME,
    }
  }
}

declare module '@/core/custom' {
  export interface CustomComponentDict {
    NotFound: () => React.ReactNode
  }
}
