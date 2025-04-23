import { CoreContextPlugin } from '@/libs/CoreContext'
import { MenuItem, MenuList, menuListStore } from './contexts/menu'

export const MockPlugin: CoreContextPlugin = (context) => {
  const MENU_ITEM_1 = 'menu-item-1'
  context.componentRegistry.register(`menu-component__${MENU_ITEM_1}`, () => <div>MenuItem1</div>)
  context.queryBus.provide(`menu-auth__${MENU_ITEM_1}`, () => true)
  context.commandBus.provide(`menu-action__${MENU_ITEM_1}`, async (...args) => {
    console.log(...args)
  })
  menuListStore.value.push(
    {
      type: 'normal',
      key: MENU_ITEM_1,
      component: MENU_ITEM_1,
      auth: MENU_ITEM_1,
      action: MENU_ITEM_1,
    },
  )
}

declare module '@/modules/core' {
  export interface CustomComponentDict {
    // [k: `menu-component__${string}`]: () => {}
  }
}

declare module '@/modules/cqrs' {
  export interface CustomQueryBusDict {
    [k: `menu-auth__${string}`]: (menu: MenuItem, index: number, menuList: MenuList) => {}
  }
  export interface CustomCommandBusDict {
    [k: `menu-action__${string}`]: (event: React.MouseEvent, menu: MenuItem, index: number, menuList: MenuList) => {}
  }
}
