import { SET_LAYOUT_RIGHT_BAR, SET_LAYOUT_LEFT_BAR } from '@/constants/command'
import { CoreContextPlugin } from '@/libs/CoreContext'
import { STORE_LAYOUT_TYPE } from '@/constants/store'
import { rightBarState, leftBarState, SideBarState } from './contexts/sideBar'
import Layout from './components/Layout'
import { isDiff } from './utils'

export const MODULE_NAME = 'cms_core/layout'

export const dependencies = ['cms_core/router', 'cms_core/ui']

const isLazyComponent = (component: React.FC) => {
  return (component as any).$$typeof === Symbol.for('react.lazy')
}

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    context.componentRegistry.register('Layout', Layout)
    context.store.set(STORE_LAYOUT_TYPE, 'default')

    leftBarState.value = ({
      show: false,
      width: 0,
      component: () => null,
    })
    rightBarState.value = ({
      show: false,
      width: 0,
      component: () => null,
    })

    context.commandBus.provide(SET_LAYOUT_LEFT_BAR, (value) => {
      if (isDiff(value, leftBarState.value)) {
        leftBarState.value = { ...leftBarState.value, ...value }
        if (!isLazyComponent(leftBarState.value.component)) {
          console.warn(
            `Layout left bar component is not a lazy component, please use React.lazy to load it.`,
          )
        }
      }
    })
    context.commandBus.provide(SET_LAYOUT_RIGHT_BAR, (value) => {
      if (isDiff(value, rightBarState.value)) {
        rightBarState.value = { ...rightBarState.value, ...value }
        if (!isLazyComponent(rightBarState.value.component)) {
          console.warn(
            `Layout right bar component is not a lazy component, please use React.lazy to load it.`,
          )
        }
      }
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
    [SET_LAYOUT_RIGHT_BAR]: (value: Partial<SideBarState>) => void
    [SET_LAYOUT_LEFT_BAR]: (value: Partial<SideBarState>) => void
  }
}
