import { useMenu, toNormalMenuItem, toDividerMenuItem, toGroupMenuItem } from '@/remotes/menu/contexts/menu'
import { useCallback } from 'react'

type ReactMenuList = ReturnType<typeof useMenu>

export interface MenuItemProps extends Omit<ReturnType<typeof toNormalMenuItem>, 'key'> {
  index: number
  menu: ReactMenuList
}

function NormalMenuItem({ component, isShow, onClick }: MenuItemProps) {
  const ComponentChildren = component
  if (!isShow) {
    return null
  }
  return (
    <li onClick={onClick}>
      <ComponentChildren />
    </li>
  )
}

export interface DividerMenuItemProps extends Omit<ReturnType<typeof toDividerMenuItem>, 'key'> {
  index: number
  menu: ReactMenuList
}

function DividerMenuItem({ index, menu }: DividerMenuItemProps) {
  if (index === 0) return null
  if (index === menu.length - 1) return null
  const showMenu = menu.filter((item) => 'isShow' in item && item.isShow)
  const nextItem = showMenu[index]
  if (nextItem && nextItem.menuType === 'divider') return null
  const prevItem = showMenu[index]
  if (prevItem && prevItem.menuType === 'divider') return null
  return (
    <li>
      <div></div>
    </li>
  )
}

export interface GroupMenuItemProps extends Omit<ReturnType<typeof toGroupMenuItem>, 'key'> {
  index: number
  menu: ReactMenuList
}

function GroupMenuItem({ component, isShow, menuChildren }: GroupMenuItemProps) {
  const ComponentChildren = component
  const onClick = useCallback(() => {}, [])
  if (!isShow) {
    return null
  }
  return (
    <li onClick={onClick}>
      <ComponentChildren>
        <ul>
          {menuChildren && menuChildren.map(($item, $index, $menu) => {
            if ($item.menuType === 'divider') {
              const { key, ...props } = $item
              return <DividerMenuItem index={$index} menu={$menu} {...props} />
            }
            if ($item.menuType === 'normal') {
              const { key, ...props } = $item
              return <NormalMenuItem key={key} index={$index} menu={$menu} {...props} />
            }
            return null
          })}
        </ul>
      </ComponentChildren>
    </li>
  )
}

function Menu() {
  const menu = useMenu()
  return (
    <ul>
      {menu.map((item, index, menu) => {
        if (item.menuType === 'group') {
          const { key, ...props } = item
          return <GroupMenuItem key={key} index={index} menu={menu} {...props} />
        }
        if (item.menuType === 'divider') {
          const { key, ...props } = item
          return <DividerMenuItem index={index} menu={menu} {...props} />
        }
        if (item.menuType === 'normal') {
          const { key, ...props } = item
          return <NormalMenuItem key={key} index={index} menu={menu} {...props} />
        }
        return null
      })}
    </ul>
  )
}

export default Menu
