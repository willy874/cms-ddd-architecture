import { useCoreContext } from '@/libs/hooks/useCoreContext'
import { useMenu, toNormalMenuItem, toDividerMenuItem, toGroupMenuItem } from '@/remotes/menu/contexts/menu'
import { useCallback } from 'react'

export interface MenuItemProps extends Omit<ReturnType<typeof toNormalMenuItem>, 'key'> {
  index: number
}

function NormalMenuItemWrapper({ component, isShow, onClick, item, index, menuList }: MenuItemProps) {
  const { componentRegistry } = useCoreContext()
  const MenuLabel = component || componentRegistry.get('MenuLabel')
  if (!isShow) {
    return null
  }
  const customProps = { item, index, menuList }
  return (
    <li onClick={onClick}>
      <MenuLabel {...customProps} />
    </li>
  )
}

export interface DividerMenuItemProps extends Omit<ReturnType<typeof toDividerMenuItem>, 'key'> {
  index: number
}

function DividerMenuItemWrapper({ index, menuList }: DividerMenuItemProps) {
  const { componentRegistry } = useCoreContext()
  const MenuDivider = componentRegistry.get('MenuDivider')
  if (index === 0) return null
  if (index === menuList.length - 1) return null
  const showMenu = menuList.filter((item) => 'isShow' in item && item.isShow)
  const nextItem = showMenu[index]
  if (nextItem && nextItem.type === 'divider') return null
  const prevItem = showMenu[index]
  if (prevItem && prevItem.type === 'divider') return null
  return (
    <li>
      <MenuDivider />
    </li>
  )
}

export interface GroupMenuItemProps extends Omit<ReturnType<typeof toGroupMenuItem>, 'key'> {
  index: number
}

function GroupMenuItemWrapper({ component, isShow, menuChildren, item, index, menuList }: GroupMenuItemProps) {
  const { componentRegistry } = useCoreContext()
  const MenuLabel = component || componentRegistry.get('MenuLabel')
  const MenuGroup = component || componentRegistry.get('MenuGroup')
  const onClick = useCallback(() => {}, [])
  if (!isShow) {
    return null
  }
  const customProps = { item, index, menuList }
  return (
    <li onClick={onClick}>
      <MenuGroup {...customProps}>
        <MenuLabel {...customProps} />
        <ul>
          {menuChildren && menuChildren.map(($item) => {
            if ($item.menuType === 'divider') {
              const { key, ...props } = $item
              return <DividerMenuItemWrapper {...props} />
            }
            if ($item.menuType === 'normal') {
              const { key, ...props } = $item
              return <NormalMenuItemWrapper key={key} {...props} />
            }
            return null
          })}
        </ul>
      </MenuGroup>
    </li>
  )
}

function Menu() {
  const menu = useMenu()
  return (
    <ul>
      {menu.map((item) => {
        if (item.menuType === 'group') {
          const { key, ...props } = item
          return <GroupMenuItemWrapper key={key} {...props} />
        }
        if (item.menuType === 'divider') {
          const { key, ...props } = item
          return <DividerMenuItemWrapper {...props} />
        }
        if (item.menuType === 'normal') {
          const { key, ...props } = item
          return <NormalMenuItemWrapper key={key} {...props} />
        }
        return null
      })}
    </ul>
  )
}

export default Menu
