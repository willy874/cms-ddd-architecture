import { CoreContextPlugin } from '@/libs/CoreContext'
import Layout from './Layout'
import { STORE_LAYOUT_TYPE } from '@/constants/store'
import { MODULE_NAME } from './constants'
import { setRightBarState } from './rightBar'

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    context.componentRegistry.register('Layout', Layout)
    context.store.set(STORE_LAYOUT_TYPE, 'default')

    setRightBarState({
      show: true,
      width: 280,
      component: () => <div>This is Menu</div>,
    })
    return {
      name: MODULE_NAME,
    }
  }
}

declare module '@/modules/core' {
  export interface CustomComponentDict {
    Layout: (props: { children: React.ReactNode }) => React.ReactNode
  }
}
