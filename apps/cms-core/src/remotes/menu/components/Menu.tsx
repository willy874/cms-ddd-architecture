import { useMenu, toNormalMenuItem, toDividerMenuItem, toGroupMenuItem } from '@/remotes/menu/contexts/menu'
import { useCallback, useMemo } from 'react'

type ReactMenuList = ReturnType<typeof useMenu>

interface MenuItemProps extends Omit<ReturnType<typeof toNormalMenuItem>, 'key'> {
  index: number
  menu: ReactMenuList
}

function NormalMenuItem({ reactComponent, isShow, onClick }: MenuItemProps) {
  const Component = useMemo(() => reactComponent || (() => null), [reactComponent])
  if (!isShow) {
    return null
  }
  return (
    <li onClick={onClick}>
      <Component />
    </li>
  )
}

interface DividerMenuItemProps extends Omit<ReturnType<typeof toDividerMenuItem>, 'key'> {
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

interface GroupMenuItemProps extends Omit<ReturnType<typeof toGroupMenuItem>, 'key'> {
  index: number
  menu: ReactMenuList
}

function GroupMenuItem({ reactComponent, isShow, children }: GroupMenuItemProps) {
  const Component = useMemo(() => reactComponent || (() => null), [reactComponent])
  const onClick = useCallback(() => {}, [])
  if (!isShow) {
    return null
  }
  return (
    <li onClick={onClick}>
      <Component />
      <ul>
        {children && children.map(($item, $index, $menu) => {
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
