import { ADD_MENU_LIST, SET_LAYOUT_LEFT_BAR } from '@/constants/command'
import { CoreContextPlugin } from '@/libs/CoreContext'
import React, { lazy } from 'react'
import { CustomMenuItem, CustomProps, NormalMenuItem, DividerMenuItem, GroupMenuItem, MenuItem, MenuList } from './contexts/schema'
import { menuListStore } from './contexts/menu'

export type { CustomMenuItem, NormalMenuItem, DividerMenuItem, GroupMenuItem }

interface MenuLabelProps extends CustomProps<'normal' | 'group'> {}

function MenuLabel(_props: MenuLabelProps): React.ReactNode {
  return null
}

interface MenuGroupProps extends CustomProps<'group'> {
  children: React.ReactNode
}

function MenuGroup({ children }: MenuGroupProps): React.ReactNode {
  return children
}

function MenuDivider(): React.ReactNode {
  return <div className="h-[1px] bg-[--color-split]"></div>
}

export const MODULE_NAME = 'cms_core/menu'

export const dependencies = ['cms_core/router', 'cms_core/ui', 'cms_core/layout', 'cms_core/auth']

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    context.componentRegistry.register('MenuLabel', MenuLabel)
    context.componentRegistry.register('MenuGroup', MenuGroup)
    context.componentRegistry.register('MenuDivider', MenuDivider)
    context.commandBus.provide(ADD_MENU_LIST, (...items: MenuItem[]) => {
      menuListStore.value.push(...items)
    })
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

declare module '@/modules/core' {
  export interface CustomComponentDict {
    MenuLabel: typeof MenuLabel
    MenuGroup: typeof MenuGroup
    MenuDivider: typeof MenuDivider
    [k: `MenuComponent/${string}`]: (props: any) => React.ReactNode
  }
}

declare module '@/modules/cqrs' {
  export interface CustomQueryBusDict {
    [k: `MenuAuth/${string}`]: (menu: MenuItem, index: number, menuList: MenuList) => boolean
  }
  export interface CustomCommandBusDict {
    [ADD_MENU_LIST]: (...items: MenuItem[]) => void
    [k: `MenuAction/${string}`]: (event: React.MouseEvent, menu: MenuItem, index: number, menuList: MenuList) => unknown
  }
}
