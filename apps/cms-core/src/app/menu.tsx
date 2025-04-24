import { ADD_MENU_LIST } from '@/constants/command'
import { CoreContextPlugin } from '@/libs/CoreContext'
import { ArrowDownIcon, HomeIcon, WidgetIcon } from './assets'

export const appMenuPlugin: CoreContextPlugin = (context) => {
  // const MENU_ITEM_2 = 'menu-item-2'
  // context.componentRegistry.register(`MenuComponent/${MENU_ITEM_2}`, () => <div>{MENU_ITEM_2}</div>)
  // context.queryBus.provide(`MenuAuth/${MENU_ITEM_2}`, () => true)
  // context.commandBus.provide(`MenuAction/${MENU_ITEM_2}`, (...args) => console.log(...args))

  context.componentRegistry.register('MenuLabel', (props) => {
    const { key, type } = props.item
    const isGroup = type === 'group'
    const { title, icon } = props.item.custom || { title: key, icon: '' }
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
        {isGroup && (
          <div className="shrink-0 text-xl pl-2">
            <ArrowDownIcon />
          </div>
        )}
      </div>
    )
  })
  context.componentRegistry.get('MenuLabel')
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
      key: 'menu-item-3',
      custom: {
        title: 'menu-item-3',
        icon: <WidgetIcon />,
      },
    },
    {
      type: 'normal',
      key: 'menu-item-4',
      custom: {
        title: 'menu-item-4',
        icon: <HomeIcon />,
      },
    },
  )
}

declare module '@/remotes/menu' {
  export interface CustomMenuItem {
    custom: {
      title: React.ReactNode
      icon: React.ReactNode
    }
  }
}
