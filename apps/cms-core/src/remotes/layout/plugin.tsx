import { CoreContextPlugin } from '@/libs/CoreContext'
import Layout from './Layout'
import { STORE_LAYOUT_TYPE } from '@/constants/store'

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    context.componentRegistry.register('Layout', Layout)
    context.componentRegistry.register('Header', () => null)
    context.componentRegistry.register('LeftAside', () => null)
    context.componentRegistry.register('RightAside', () => null)
    context.componentRegistry.register('Footer', () => null)
    context.router.subscribe('onBeforeLoad', () => {
      context.store.set(STORE_LAYOUT_TYPE, 'default')
    })
  }
}

declare module '@/core/custom' {
  export interface CustomComponentDict {
    Layout: (props: { children: React.ReactNode }) => React.ReactNode
  }
}
