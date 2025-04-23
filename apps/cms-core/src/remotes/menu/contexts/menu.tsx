import { getCoreContext } from '@/libs/CoreContext'
import { createStore } from '@/libs/hooks/createStore'
import { useComputed } from '@/libs/hooks/useComputed'
import { z } from 'zod'
import { DividerMenuItemSchema, GroupMenuItemSchema, MenuItemSchema, MenuListSchema, NormalMenuItemSchema } from './schema'

type MenuItem = z.infer<typeof MenuItemSchema>

export const [menuListStore, useMenuList] = createStore(() => MenuListSchema.parse([]))

export function toNormalMenuItem(item: z.infer<typeof NormalMenuItemSchema>, index: number, array: MenuItem[]) {
  const { queryBus, commandBus, componentRegistry } = getCoreContext()
  const { label, action, auth } = item
  return {
    menuType: item.type,
    key: 'menu-' + item.key,
    component: (() => {
      if (typeof label === 'undefined') {
        const MenuItemComponent = componentRegistry.get('MenuItem')
        return () => (<MenuItemComponent item={item} />)
      }
      if (typeof label === 'function') {
        return label as () => React.ReactNode
      }
      if (typeof label === 'string') {
        const componentKey = `menu-component__${label}` as const
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
        return true
      }
      if (typeof auth === 'boolean') {
        return auth
      }
      const queryKey = `menu-auth__${auth}` as const
      if (queryBus.has(queryKey)) {
        return queryBus.query({
          name: queryKey,
          params: [item, index, array],
        })
      }
      return true
    })(),
    onClick: (() => {
      if (typeof action === 'undefined') {
        return undefined
      }
      if (typeof action === 'function') {
        return action
      }
      const commandKey = `menu-action__${action}` as const
      if (queryBus.has(commandKey)) {
        return (event: React.MouseEvent) => {
          commandBus.command({
            name: commandKey,
            params: [event, item, index, array],
          })
        }
      }
      return undefined
    })(),
  }
}

export function toDividerMenuItem(item: z.infer<typeof DividerMenuItemSchema>, _index: number, _array: MenuItem[]) {
  return {
    menuType: item.type,
    key: 'menu-' + item.key,
  }
}

export function toGroupMenuItem(item: z.infer<typeof GroupMenuItemSchema>, index: number, array: MenuItem[]) {
  const { componentRegistry, queryBus } = getCoreContext()
  const { label, auth, children } = item
  return {
    menuType: item.type,
    key: 'menu-' + item.key,
    component: (() => {
      if (typeof label === 'undefined') {
        const MenuItemComponent = componentRegistry.get('MenuItem')
        return ({ children }: { children: React.ReactNode }) => (
          <MenuItemComponent item={item}>{children}</MenuItemComponent>
        )
      }
      if (typeof label === 'function') {
        return label as (props: { children: React.ReactNode }) => React.ReactNode
      }
      if (typeof label === 'string') {
        const componentKey = `menu-component__${label}` as const
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
        return true
      }
      if (typeof auth === 'boolean') {
        return auth
      }
      const queryKey = `menu-auth__${auth}` as const
      if (queryBus.has(queryKey)) {
        return queryBus.query({
          name: queryKey,
          params: [item, index, array],
        })
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
