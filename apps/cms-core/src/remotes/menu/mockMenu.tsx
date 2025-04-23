import { CoreContextPlugin } from '@/libs/CoreContext'
import { menuListStore } from './contexts/menu'

export const MockPlugin: CoreContextPlugin = (context) => {
  const MENU_ITEM_1 = 'menu-item-1'
  context.componentRegistry.register(`menu-component__${MENU_ITEM_1}`, () => <div>MenuItem1</div>)
  context.queryBus.provide(`menu-auth__${MENU_ITEM_1}`, () => true)
  context.commandBus.provide(`menu-action__${MENU_ITEM_1}`, (...args) => console.log(...args))
  menuListStore.value.push(
    {
      type: 'normal',
      key: MENU_ITEM_1,
      label: MENU_ITEM_1,
      auth: MENU_ITEM_1,
      action: MENU_ITEM_1,
    },
    {
      type: 'normal',
      key: 'menu-item-2',
      label: 'MenuItem2',
    },
  )
}
