import cn from 'classnames'
import { ADD_MENU_LIST, SET_LAYOUT_LEFT_BAR } from '@/constants/command'
import { useCoreContext } from '@/libs/hooks/useCoreContext'
import { CoreContextPlugin } from '@/libs/CoreContext'
import { CustomMenuItem, MenuItem, MenuList, CustomProps, NormalMenuItem, GroupMenuItem, DividerMenuItem } from './contexts/schema'
import { menuListStore } from './contexts/menu'
import { useMenu } from './contexts/menu'
import Menu from './components/Menu'
import { lazy } from 'react'

export type { CustomMenuItem }

interface MenuLabelProps extends CustomProps<NormalMenuItem | GroupMenuItem> {
  isOpen?: boolean
}

function MenuLabel(_props: MenuLabelProps): React.ReactNode {
  return null
}

interface MenuGroupProps extends CustomProps<GroupMenuItem> {
  isOpen: boolean
  children: React.ReactNode
}

function MenuGroup({ isOpen, children }: MenuGroupProps): React.ReactNode {
  return <div className={cn({ 'rounded-md bg-[--color-fill-secondary]': isOpen })}>{children}</div>
}

interface MenuDividerProps extends CustomProps<DividerMenuItem> {}

function MenuDivider(_props: MenuDividerProps): React.ReactNode {
  return <div className="h-[1px] bg-[--color-split]"></div>
}

function MenuBar(): React.ReactNode {
  const menu = useMenu()
  const context = useCoreContext()
  const MenuLabel = context.componentRegistry.get('MenuLabel')
  const MenuGroup = context.componentRegistry.get('MenuGroup')
  const MenuDivider = context.componentRegistry.get('MenuDivider')
  return (
    <Menu
      menuList={menu}
      MenuLabel={(props) => <MenuLabel {...props} />}
      MenuGroup={(props) => <MenuGroup {...props} />}
      MenuDivider={(props) => <MenuDivider {...props} />}
    />
  )
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
          component: lazy(async () => ({ default: MenuBar })),
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
