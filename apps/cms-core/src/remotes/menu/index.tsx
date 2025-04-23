import { z } from 'zod'
import { SET_LAYOUT_LEFT_BAR } from '@/constants/command'
import { CoreContextPlugin } from '@/libs/CoreContext'
import React, { lazy } from 'react'
import { MockPlugin } from './mockMenu'
import { MenuItemSchema, MenuListSchema } from './contexts/schema'

type MenuItem = z.infer<typeof MenuItemSchema>
type MenuList = z.infer<typeof MenuListSchema>

interface MenuLabelProps {
  item: MenuItem
  index: number
  menuList: MenuList
}

function MenuLabel(_props: MenuLabelProps) {
  return null
}

interface MenuGroupProps {
  item: MenuItem
  index: number
  menuList: MenuList
  children: React.ReactNode
}

function MenuGroup({ children }: MenuGroupProps) {
  return children
}

function MenuDivider() {
  return <div></div>
}

export const MODULE_NAME = 'cms_core/menu'

export const dependencies = ['cms_core/router', 'cms_core/ui', 'cms_core/layout', 'cms_core/auth']

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    context.componentRegistry.register('MenuLabel', MenuLabel)
    context.componentRegistry.register('MenuGroup', MenuGroup)
    context.componentRegistry.register('MenuDivider', MenuDivider)
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

declare module '@/modules/core' {
  export interface CustomComponentDict {
    MenuLabel: typeof MenuLabel
    MenuGroup: typeof MenuGroup
    MenuDivider: typeof MenuDivider
    [k: `menu-component__${string}`]: (props: any) => React.ReactNode
  }
}

declare module '@/modules/cqrs' {
  export interface CustomQueryBusDict {
    [k: `menu-auth__${string}`]: (menu: MenuItem, index: number, menuList: MenuList) => boolean
  }
  export interface CustomCommandBusDict {
    [k: `menu-action__${string}`]: (event: React.MouseEvent, menu: MenuItem, index: number, menuList: MenuList) => unknown
  }
}
