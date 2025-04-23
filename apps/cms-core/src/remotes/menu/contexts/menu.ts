import { getCoreContext } from '@/libs/CoreContext'
import { createStore } from '@/libs/hooks/createStore'
import { useComputed } from '@/libs/hooks/useComputed'
import { z } from 'zod'

const NoneMenuItemSchema = z.object({
  type: z.literal('none'),
})

const NormalMenuItemSchema = z.object({
  key: z.string(),
  type: z.literal('normal'),
  component: z.string(),
  action: z.string(),
  auth: z.string().optional(),
})

const DividerMenuItemSchema = z.object({
  key: z.string(),
  type: z.literal('divider'),
})

const MenuSubItemSchema = z.union([NormalMenuItemSchema, DividerMenuItemSchema, NoneMenuItemSchema])

const GroupMenuItemSchema = z.object({
  key: z.string(),
  type: z.literal('group'),
  component: z.string(),
  auth: z.string().optional(),
  children: z.array(MenuSubItemSchema).optional(),
})

const MenuItemSchema = z.union([NormalMenuItemSchema, DividerMenuItemSchema, GroupMenuItemSchema, NoneMenuItemSchema])
const MenuListSchema = z.array(MenuItemSchema)

export type MenuItem = z.infer<typeof MenuItemSchema>
export type MenuList = z.infer<typeof MenuListSchema>

export const [menuListStore, useMenuList] = createStore(() => MenuListSchema.parse([]))

export function toNormalMenuItem(item: z.infer<typeof NormalMenuItemSchema>, index: number, array: MenuItem[]) {
  const { queryBus, commandBus, componentRegistry } = getCoreContext()
  const { component, action, auth } = item
  return {
    menuType: item.type,
    key: item.key,
    reactComponent: componentRegistry.get(component as any) as React.FC<any>,
    isShow: auth
      ? (() => {
          return queryBus.query({
            name: `menu-auth__${auth}`,
            params: [item, index, array],
          } as any) as boolean
        })()
      : true,
    onClick: action
      ? (event: React.MouseEvent) => {
          commandBus.command({
            name: `menu-action__${action}`,
            params: [event, item, index, array],
          } as any)
        }
      : undefined,
  }
}

export function toDividerMenuItem(item: z.infer<typeof DividerMenuItemSchema>, _index: number, _array: MenuItem[]) {
  return {
    menuType: item.type,
    key: item.key,
  }
}

export function toGroupMenuItem(item: z.infer<typeof GroupMenuItemSchema>, index: number, array: MenuItem[]) {
  const { componentRegistry, queryBus } = getCoreContext()
  const { component, auth, children } = item
  return {
    menuType: item.type,
    key: item.key,
    reactComponent: componentRegistry.get(component as any) as React.FC<any>,
    isShow: auth
      ? (() => {
          return queryBus.query({
            name: `menu-auth__${auth}`,
            params: [item, index, array],
          } as any)
        })()
      : true,
    children: children
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
