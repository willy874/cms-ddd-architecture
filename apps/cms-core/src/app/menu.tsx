import { ADD_MENU_LIST } from '@/constants/command'
import { CoreContextPlugin } from '@/libs/CoreContext'
import { HomeIcon, WidgetIcon } from './assets'

export const appMenuPlugin: CoreContextPlugin = (context) => {
  // const MENU_ITEM_2 = 'menu-item-2'
  // context.componentRegistry.register(`MenuComponent/${MENU_ITEM_2}`, () => <div>{MENU_ITEM_2}</div>)
  // context.queryBus.provide(`MenuAuth/${MENU_ITEM_2}`, () => true)
  // context.commandBus.provide(`MenuAction/${MENU_ITEM_2}`, (...args) => console.log(...args))
  context.commandBus.command(
    ADD_MENU_LIST,
    {
      type: 'normal',
      key: 'menu-item-1',
      custom: {
        title: '首頁',
        icon: <HomeIcon />,
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'normal',
      key: 'menu-item-2',
      custom: {
        title: 'menu-item-2',
        icon: <WidgetIcon />,
      },
    },
    {
      type: 'normal',
      key: 'menu-item-3',
      custom: {
        title: 'menu-item-3',
        icon: <HomeIcon />,
      },
    },
    {
      type: 'group',
      key: 'menu-item-4',
      custom: {
        title: 'menu-item-4',
        icon: <WidgetIcon />,
      },
      children: [
        {
          type: 'normal',
          key: 'menu-item-4-1',
          custom: {
            title: 'menu-item-4-1',
          },
        },
        {
          type: 'normal',
          key: 'menu-item-4-2',
          custom: {
            title: 'menu-item-4-2',
          },
        },
        {
          type: 'normal',
          key: 'menu-item-4-3',
          custom: {
            title: 'menu-item-4-3',
          },
        },
      ],
    },
  )
}

declare module '@/remotes/menu' {
  export interface CustomMenuItem {
    custom: {
      title: React.ReactNode
      icon?: React.ReactNode
    }
  }
}
