import cn from 'classnames'
import { ADD_MENU_LIST } from '@/constants/command'
import { CoreContextPlugin } from '@/libs/CoreContext'
import { ArrowDownIcon, HomeIcon, WidgetIcon } from './assets'

export const appMenuPlugin: CoreContextPlugin = (context) => {
  // const MENU_ITEM_2 = 'menu-item-2'
  // context.componentRegistry.register(`MenuComponent/${MENU_ITEM_2}`, () => <div>{MENU_ITEM_2}</div>)
  // context.queryBus.provide(`MenuAuth/${MENU_ITEM_2}`, () => true)
  // context.commandBus.provide(`MenuAction/${MENU_ITEM_2}`, (...args) => console.log(...args))

  context.componentRegistry.register('MenuLabel', (props) => {
    const isOpen = props.isOpen || false
    const itemType = props.item?.type || 'none'
    const itemId = props.item?.id || ''
    const customTitle = props.item?.custom?.title || itemId
    const customIcon = props.item?.custom?.icon || false
    const isGroup = itemType === 'group'
    return (
      <div className="flex px-4 py-2 items-center cursor-pointer rounded hover-bg-[--color-fill-content-hover]">
        {customIcon && (
          <div className="shrink-0 text-xl pr-2">
            {customIcon}
          </div>
        )}
        <div className="grow-1 text-ellipsis text-nowrap overflow-hidden">
          {customTitle}
        </div>
        {isGroup && (
          <div className={cn('shrink-0 text-xl ml-2 transition-all', { '-rotate-90': !isOpen })}>
            <ArrowDownIcon />
          </div>
        )}
      </div>
    )
  })
  context.commandBus.command(
    ADD_MENU_LIST,
    {
      type: 'normal',
      id: 'menu-item-1',
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
      id: 'menu-item-2',
      custom: {
        title: 'menu-item-2',
        icon: <WidgetIcon />,
      },
    },
    {
      type: 'normal',
      id: 'menu-item-3',
      custom: {
        title: 'menu-item-3',
        icon: <HomeIcon />,
      },
    },
    {
      type: 'group',
      id: 'menu-item-4',
      custom: {
        title: 'menu-item-4',
        icon: <WidgetIcon />,
      },
      children: [
        {
          type: 'normal',
          id: 'menu-item-4-1',
          custom: {
            title: 'menu-item-4-1',
          },
        },
        {
          type: 'normal',
          id: 'menu-item-4-2',
          custom: {
            title: 'menu-item-4-2',
          },
        },
        {
          type: 'normal',
          id: 'menu-item-4-3',
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
