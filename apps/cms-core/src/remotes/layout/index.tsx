import { SHOW_LAYOUT_RIGHT_BAR, SHOW_LAYOUT_LEFT_BAR } from '@/constants/command'
import { CoreContextPlugin } from '@/libs/CoreContext'
import { STORE_LAYOUT_TYPE } from '@/constants/store'
import { setLeftBarState } from './contexts/leftBar'
import { setRightBarState } from './contexts/rightBar'
import Layout from './components/Layout'

export const MODULE_NAME = 'cms_core/layout'

export const dependencies = ['cms_core/router', 'cms_core/ui']

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    context.componentRegistry.register('Layout', Layout)
    context.store.set(STORE_LAYOUT_TYPE, 'default')

    setRightBarState({
      show: false,
      width: 0,
      component: () => null,
    })
    setLeftBarState({
      show: true,
      width: 280,
      component: () => null,
    })

    context.commandBus.provide(SHOW_LAYOUT_RIGHT_BAR, (isShow) => {
      setRightBarState({ show: isShow })
    })
    context.commandBus.provide(SHOW_LAYOUT_LEFT_BAR, (isShow) => {
      setLeftBarState({ show: isShow })
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

declare module '@/modules/cqrs' {
  export interface CustomCommandBusDict {
    [SHOW_LAYOUT_RIGHT_BAR]: (isShow: boolean) => void
    [SHOW_LAYOUT_LEFT_BAR]: (isShow: boolean) => void
  }
}
