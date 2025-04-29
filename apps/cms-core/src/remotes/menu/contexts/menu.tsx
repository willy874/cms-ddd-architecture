import { getCoreContext } from '@/libs/CoreContext'
import { createStore } from '@/libs/hooks/createStore'
import { useComputed } from '@/libs/hooks/useComputed'
import { NormalMenuItem, DividerMenuItem, GroupMenuItem, MenuItem, MenuList } from './schema'

export const [menuListStore, useMenuList] = createStore(() => [] as MenuList)

interface ResolveContext {
  id: string
  item: MenuItem
  index: number
  menuList: MenuItem[]
}

function resolveComponent(label: NormalMenuItem['label'] | GroupMenuItem['label'], context: ResolveContext) {
  const { componentRegistry } = getCoreContext()
  if (typeof label === 'undefined') {
    const componentKey = `MenuComponent/${context.id}` as const
    if (componentRegistry.has(componentKey)) {
      return componentRegistry.get(componentKey)
    }
    else {
      return undefined
    }
  }
  if (typeof label === 'function') {
    return label as (props: object) => React.ReactNode
  }
  if (typeof label === 'string') {
    const componentKey = `MenuComponent/${label}` as const
    if (componentRegistry.has(componentKey)) {
      return componentRegistry.get(componentKey)
    }
    else {
      return () => label
    }
  }
  return () => null
}

function resolveAuth(auth: NormalMenuItem['auth'] | GroupMenuItem['auth'], context: ResolveContext): boolean {
  const { queryBus } = getCoreContext()
  if (typeof auth === 'undefined') {
    const queryKey = `MenuAuth/${context.id}` as const
    if (queryBus.has(queryKey)) {
      return queryBus.query({
        name: queryKey,
        params: [context.item, context.index, context.menuList],
      })
    }
  }
  if (typeof auth === 'object' && auth) {
    if (queryBus.has(auth.name)) {
      const result = queryBus.query({
        name: auth.name,
        params: [...auth.params || []],
      } as any)
      return typeof result === 'boolean' ? result : false
    }
  }
  if (typeof auth === 'boolean') {
    return auth
  }
  if (typeof auth === 'function') {
    return auth()
  }
  if (typeof auth === 'string') {
    const queryKey = `MenuAuth/${auth}` as const
    if (queryBus.has(queryKey)) {
      return queryBus.query({
        name: queryKey,
        params: [context.item, context.index, context.menuList],
      })
    }
  }
  return true
}

function resolveAction(action: NormalMenuItem['action'], context: ResolveContext) {
  const { commandBus } = getCoreContext()
  if (typeof action === 'undefined') {
    const commandKey = `MenuAction/${context.id}` as const
    if (commandBus.has(commandKey)) {
      return (event: React.MouseEvent) => {
        commandBus.command({
          name: commandKey,
          params: [event, context.item, context.index, context.menuList],
        })
      }
    }
  }
  if (typeof action === 'object' && action) {
    if (commandBus.has(action.name)) {
      return () => {
        commandBus.command({
          name: action.name,
          params: [...action.params || []],
        } as any)
      }
    }
  }
  if (typeof action === 'function') {
    return action
  }
  if (typeof action === 'string') {
    const commandKey = `MenuAction/${action}` as const
    if (commandBus.has(commandKey)) {
      return (event: React.MouseEvent) => {
        commandBus.command({
          name: commandKey,
          params: [event, context.item, context.index, context.menuList],
        })
      }
    }
  }
  return undefined
}

function toNormalMenuItem(item: NormalMenuItem, index: number, menuList: MenuItem[]) {
  const { label, action, auth, id } = item
  return {
    menuType: item.type,
    id,
    item,
    index,
    menuList,
    component: resolveComponent(label, { id, item, index, menuList }),
    isShow: resolveAuth(auth, { id, item, index, menuList }),
    onClick: resolveAction(action, { id, item, index, menuList }),
  }
}

function toDividerMenuItem(item: DividerMenuItem, index: number, menuList: MenuItem[]) {
  return {
    id: `divider-${index}`,
    menuType: item.type,
    item,
    index,
    menuList,
    isShow: (() => {
      if (index === 0) return false
      if (index === menuList.length - 1) return false
      const showMenu = menuList.filter((item) => 'isShow' in item && item.isShow)
      const nextItem = showMenu[index]
      if (nextItem && 'type' in nextItem && nextItem.type === 'divider') return false
      const prevItem = showMenu[index]
      if (prevItem && 'type' in prevItem && prevItem.type === 'divider') return false
      return true
    })(),
  }
}

function toGroupMenuItem(item: GroupMenuItem, index: number, menuList: MenuItem[]) {
  const { id, label, auth, children } = item
  return {
    menuType: item.type,
    id,
    item,
    index,
    menuList,
    component: resolveComponent(label, { id, item, index, menuList }),
    isShow: resolveAuth(auth, { id, item, index, menuList }),
    menuChildren: children
      ? (children.map((el, idx, arr) => {
          if (el.type === 'normal') {
            return toNormalMenuItem(el, idx, arr)
          }
          if (el.type === 'divider') {
            return toDividerMenuItem(el, idx, arr)
          }
          return { menuType: 'none' } as const
        }))
      : undefined,
  }
}

export function useMenu() {
  const menuList = useMenuList()
  const result = useComputed(() => menuList.map((item, index, array) => {
    if (item.type === 'normal') {
      return toNormalMenuItem(item, index, array)
    }
    if (item.type === 'divider') {
      return toDividerMenuItem(item, index, array)
    }
    if (item.type === 'group') {
      return toGroupMenuItem(item, index, array)
    }
    return {
      menuType: 'none',
      id: null,
      isShow: false,
      item,
      index,
      menuList: array,
    } as const
  }))
  return result
}
