import React, { lazy } from 'react'
import cn from 'classnames'
import { ADD_MENU_LIST, SET_LAYOUT_LEFT_BAR } from '@/constants/command'
import { CoreContextPlugin } from '@/libs/CoreContext'
import { CustomMenuItem, NormalMenuItem, DividerMenuItem, GroupMenuItem, MenuItem, MenuList, MenuLabelProps, MenuGroupProps } from './contexts/schema'
import { menuListStore } from './contexts/menu'
import { ArrowDownIcon } from './assets'

export type { CustomMenuItem, NormalMenuItem, DividerMenuItem, GroupMenuItem }

function MenuLabel<T extends 'group' | 'normal'>(props: MenuLabelProps<T>): React.ReactNode {
  const { isOpen, item } = props
  const { type, key } = item
  const { title, icon } = item.custom || { title: key }
  if (type === 'normal') {
    return (
      <div className="flex px-4 py-2 items-center cursor-pointer rounded hover-bg-[--color-fill-content-hover]">
        {icon && (
          <div className="shrink-0 text-xl pr-2">
            {icon}
          </div>
        )}
        <div className="grow-1 text-ellipsis text-nowrap overflow-hidden">
          {title}
        </div>
      </div>
    )
  }
  if (type === 'group') {
    return (
      <div className="flex px-4 py-2 items-center cursor-pointer rounded hover-bg-[--color-fill-content-hover]">
        {icon && (
          <div className="shrink-0 text-xl mr-2">
            {icon}
          </div>
        )}
        <div className="grow-1 text-ellipsis text-nowrap overflow-hidden">
          {title}
        </div>
        <div className={cn('shrink-0 text-xl ml-2 transition-all', { '-rotate-90': isOpen })}>
          <ArrowDownIcon />
        </div>
      </div>
    )
  }
  return null
}

function MenuGroup({ isOpen, children }: MenuGroupProps): React.ReactNode {
  return <div className={cn({ 'rounded-md bg-[--color-fill-secondary]': isOpen })}>{children}</div>
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
