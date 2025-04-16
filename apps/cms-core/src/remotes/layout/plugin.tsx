import { CoreContextPlugin } from '@/libs/CoreContext'
import Layout from './Layout'
import { STORE_LAYOUT_TYPE } from '@/constants/store'
import { MODULE_NAME } from './constants'
import Header from './Header'
import LeftAside from './LeftAside'
import RightAside from './RightAside'
import Footer from './Footer'

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    context.componentRegistry.register('Layout', Layout)
    context.componentRegistry.register('Header', Header)
    context.componentRegistry.register('LeftAside', LeftAside)
    context.componentRegistry.register('RightAside', RightAside)
    context.componentRegistry.register('Footer', Footer)

    context.store.set(STORE_LAYOUT_TYPE, 'default')
    return {
      name: MODULE_NAME,
    }
  }
}

declare module '@/modules/core' {
  export interface CustomComponentDict {
    Layout: (props: { children: React.ReactNode }) => React.ReactNode
    Header: () => React.ReactNode
    LeftAside: () => React.ReactNode
    RightAside: () => React.ReactNode
    Footer: () => React.ReactNode
  }
}
