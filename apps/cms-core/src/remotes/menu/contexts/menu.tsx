import { getCoreContext } from '@/libs/CoreContext'
import { createStore } from '@/libs/hooks/createStore'
import { useComputed } from '@/libs/hooks/useComputed'
import { NormalMenuItem, DividerMenuItem, GroupMenuItem, MenuItem, MenuList, CustomProps } from './schema'

export const [menuListStore, useMenuList] = createStore(() => [] as MenuList)

export function toNormalMenuItem(item: NormalMenuItem, index: number, menuList: MenuItem[]) {
  const { queryBus, commandBus, componentRegistry } = getCoreContext()
  const { label, action, auth, key } = item
  return {
    menuType: item.type,
    key,
    item,
    index,
    menuList,
    component: (() => {
      if (typeof label === 'undefined') {
        const componentKey = `MenuComponent/${key}` as const
        if (componentRegistry.has(componentKey)) {
          return componentRegistry.get(componentKey)
        }
        else {
          return undefined
        }
      }
      if (typeof label === 'function') {
        return label as () => React.ReactNode
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
    })(),
    isShow: (() => {
      if (typeof auth === 'undefined') {
        const queryKey = `MenuAuth/${key}` as const
        if (queryBus.has(queryKey)) {
          return queryBus.query({
            name: queryKey,
            params: [item, index, menuList],
          })
        }
        else {
          return true
        }
      }
      if (typeof auth === 'boolean') {
        return auth
      }
      if (typeof auth === 'string') {
        const queryKey = `MenuAuth/${auth}` as const
        if (queryBus.has(queryKey)) {
          return queryBus.query({
            name: queryKey,
            params: [item, index, menuList],
          })
        }
      }
      return true
    })(),
    onClick: (() => {
      if (typeof action === 'undefined') {
        const commandKey = `MenuAction/${key}` as const
        if (queryBus.has(commandKey)) {
          return (event: React.MouseEvent) => {
            commandBus.command({
              name: commandKey,
              params: [event, item, index, menuList],
            })
          }
        }
        else {
          return undefined
        }
      }
      if (typeof action === 'function') {
        return action
      }
      if (typeof action === 'string') {
        const commandKey = `MenuAction/${action}` as const
        if (queryBus.has(commandKey)) {
          return (event: React.MouseEvent) => {
            commandBus.command({
              name: commandKey,
              params: [event, item, index, menuList],
            })
          }
        }
      }
      return undefined
    })(),
  }
}

export function toDividerMenuItem(item: DividerMenuItem, index: number, menuList: MenuItem[]) {
  return {
    menuType: item.type,
    key: item.key ?? `divider-${index}`,
    item,
    index,
    menuList,
  }
}

export function toGroupMenuItem(item: GroupMenuItem, index: number, menuList: MenuItem[]) {
  const { componentRegistry, queryBus } = getCoreContext()
  const { key, label, auth, children } = item
  return {
    menuType: item.type,
    key,
    item,
    index,
    menuList,
    component: (() => {
      if (typeof label === 'undefined') {
        const componentKey = `MenuComponent/${key}` as const
        if (componentRegistry.has(componentKey)) {
          return componentRegistry.get(componentKey)
        }
        else {
          return undefined
        }
      }
      if (typeof label === 'function') {
        return label as (props: CustomProps) => React.ReactNode
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
    })(),
    isShow: (() => {
      if (typeof auth === 'undefined') {
        const queryKey = `MenuAuth/${key}` as const
        if (queryBus.has(queryKey)) {
          return queryBus.query({
            name: queryKey,
            params: [item, index, menuList],
          })
        }
        else {
          return true
        }
      }
      if (typeof auth === 'boolean') {
        return auth
      }
      if (typeof auth === 'string') {
        const queryKey = `MenuAuth/${auth}` as const
        if (queryBus.has(queryKey)) {
          return queryBus.query({
            name: queryKey,
            params: [item, index, menuList],
          })
        }
      }
      return true
    })(),
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
    return { menuType: 'none' } as const
  }))
  return result
}
