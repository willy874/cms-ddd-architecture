import { SET_LAYOUT_RIGHT_BAR, SET_LAYOUT_LEFT_BAR } from '@/constants/command'
import { CoreContextPlugin } from '@/libs/CoreContext'
import { STORE_LAYOUT_TYPE } from '@/constants/store'
import { setLeftBarState, setRightBarState } from './contexts/sideBar'
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

    context.commandBus.provide(SET_LAYOUT_RIGHT_BAR, setRightBarState)
    context.commandBus.provide(SET_LAYOUT_LEFT_BAR, setLeftBarState)
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
    [SET_LAYOUT_RIGHT_BAR]: typeof setRightBarState
    [SET_LAYOUT_LEFT_BAR]: typeof setLeftBarState
  }
}
