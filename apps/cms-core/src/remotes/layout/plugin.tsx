import { CoreContextPlugin } from '@/libs/CoreContext'
import Layout from './Layout'
import { STORE_LAYOUT_TYPE } from '@/constants/store'
import { MODULE_NAME } from './constants'

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    context.componentRegistry.register('Layout', Layout)
    context.router.subscribe('onBeforeLoad', () => {
      context.store.set(STORE_LAYOUT_TYPE, 'default')
    })
    return {
      name: MODULE_NAME,
    }
  }
}

declare module '@/core/custom' {
  export interface CustomComponentDict {
    Layout: (props: { children: React.ReactNode }) => React.ReactNode
    Header: () => React.ReactNode
    LeftAside: () => React.ReactNode
    RightAside: () => React.ReactNode
    Footer: () => React.ReactNode
  }
}
