import { getCoreContext } from '@/libs/CoreContext'
import { createStore } from '@/libs/hooks/createStore'
import { useComputed } from '@/libs/hooks/useComputed'
import { z } from 'zod'

const NormalMenuItem = z.object({
  key: z.string(),
  type: z.literal('normal'),
  component: z.string(),
  action: z.string().optional(),
  auth: z.string().optional(),
})

const DividerMenuItem = z.object({
  key: z.string(),
  type: z.literal('divider'),
})

const MenuSubItemSchema = z.union([NormalMenuItem, DividerMenuItem])

const GroupMenuItem = z.object({
  key: z.string(),
  type: z.literal('group'),
  component: z.string(),
  auth: z.string().optional(),
  children: z.array(MenuSubItemSchema).optional(),
})

const MenuItemSchema = z.union([NormalMenuItem, DividerMenuItem, GroupMenuItem])
const MenuListSchema = z.array(MenuItemSchema)

export type MenuItem = z.infer<typeof MenuItemSchema>
export type MenuList = z.infer<typeof MenuListSchema>

export const [menuList, useMenuList] = createStore(() => MenuListSchema.parse([]))

function toNormalMenuItem(item: z.infer<typeof NormalMenuItem>, index: number, array: MenuItem[]) {
  const { queryBus, commandBus, componentRegistry } = getCoreContext()
  const { component, action, auth } = item
  return {
    ...item,
    element: component && (componentRegistry.get(component as any)),
    onClick: action && ((event: MouseEvent | React.MouseEvent) => {
      commandBus.command({
        name: `menu-${action}`,
        params: [event, item],
      } as any)
    }),
    isShow: auth && (() => {
      return queryBus.query({
        name: `menu-${auth}`,
        params: [item, index, array],
      } as any)
    })(),
  }
}
function toDividerMenuItem(item: z.infer<typeof DividerMenuItem>, index: number, array: MenuItem[]) {
  if (index === 0) return { type: 'none' }
  if (index === array.length - 1) return { type: 'none' }
  return { ...item }
}

function toGroupMenuItem(item: z.infer<typeof GroupMenuItem>, index: number, array: MenuItem[]) {
  const { componentRegistry, queryBus } = getCoreContext()
  const { component, auth, children } = item
  return {
    ...item,
    element: component && (componentRegistry.get(component as any)),
    isShow: auth && (() => {
      return queryBus.query({
        name: `menu-${auth}`,
        params: [item, index, array],
      } as any)
    })(),
    children: children && (children.map((el, idx, arr) => {
      if (el.type === 'normal') {
        return toNormalMenuItem(el, idx, arr)
      }
      if (el.type === 'divider') {
        return toDividerMenuItem(el, idx, arr)
      }
      return { type: 'none' }
    })),
  }
}

export function useMenu() {
  const menuList = useMenuList()
  return useComputed(() => menuList.map((item, index, array) => {
    if (item.type === 'normal') {
      return toNormalMenuItem(item, index, array)
    }
    if (item.type === 'divider') {
      return toDividerMenuItem(item, index, array)
    }
    if (item.type === 'group') {
      return toGroupMenuItem(item, index, array)
    }
    return { type: 'none' }
  }))
}

declare module '@/modules/cqrs' {
  export interface CustomQueryBusDict {
    [k: `auth-${string}`]: () => {}
  }
  export interface CustomCommandBusDict {
    [k: `menu-${string}`]: () => {}
  }
}
