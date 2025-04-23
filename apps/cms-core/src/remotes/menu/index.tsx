import { SET_LAYOUT_LEFT_BAR } from '@/constants/command'
import { CoreContextPlugin } from '@/libs/CoreContext'
import { lazy } from 'react'
import { MockPlugin } from './mockMenu'

export const MODULE_NAME = 'cms_core/menu'

export const dependencies = ['cms_core/router', 'cms_core/ui', 'cms_core/layout', 'cms_core/auth']

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    MockPlugin(context)
    return {
      name: MODULE_NAME,
      onInit: async () => {
        await context.commandBus.command(SET_LAYOUT_LEFT_BAR, {
          show: true,
          width: 280,
          component: lazy(() => import('./components/Menu')),
        })
      },
    }
  }
}

export interface MenuComponentDict {}
export interface MenuAuthDict {}
export interface MenuActionDict {}

declare module '@/modules/core' {
  export interface CustomComponentDict {
    // [k: `menu-component__${string}`]: () => {}
  }
}

declare module '@/modules/cqrs' {
  export interface CustomQueryBusDict {
    // [k: `menu-auth__${string}`]: () => {}
  }
  export interface CustomCommandBusDict {
    // [k: `menu-action__${string}`]: () => {}
  }
}
