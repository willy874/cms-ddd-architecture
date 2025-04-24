import { useCoreContext } from '@/libs/hooks/useCoreContext'
import { useMenu, toNormalMenuItem, toDividerMenuItem, toGroupMenuItem } from '@/remotes/menu/contexts/menu'
import { useCallback, useState } from 'react'
import { MenuLabelProps } from '../contexts/schema'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/libs/components'

export interface MenuItemProps extends Omit<ReturnType<typeof toNormalMenuItem>, 'key'> {
  index: number
}

function NormalMenuItemWrapper({ component, isShow, onClick, item, index, menuList }: MenuItemProps) {
  const { componentRegistry } = useCoreContext()
  const MenuLabel = component || componentRegistry.get('MenuLabel')
  if (!isShow) {
    return null
  }
  const customProps = { item, index, menuList, isOpen: undefined } satisfies MenuLabelProps<'normal'>
  return (
    <li className="px-2" onClick={onClick} data-scope="menu-normal-wrapper">
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
    <li data-scope="menu-divider-wrapper">
      <MenuDivider />
    </li>
  )
}

export interface GroupMenuItemProps extends Omit<ReturnType<typeof toGroupMenuItem>, 'key'> {
  index: number
}

function GroupMenuItemWrapper({ component, isShow, menuChildren, item, index, menuList }: GroupMenuItemProps) {
  const [isOpen, setIsOpen] = useState(true)
  const { componentRegistry } = useCoreContext()
  const MenuLabel = component || componentRegistry.get('MenuLabel')
  const MenuGroup = component || componentRegistry.get('MenuGroup')
  const onClick = useCallback(() => {}, [])
  if (!isShow) {
    return null
  }
  const customProps = { item, index, menuList, isOpen } satisfies MenuLabelProps<'group'>
  return (
    <li className="px-2" onClick={onClick} data-scope="menu-group-wrapper">
      <MenuGroup {...customProps}>
        <Collapsible open={isOpen} onOpenChange={({ open }) => setIsOpen(open)}>
          <CollapsibleTrigger>
            <MenuLabel {...customProps} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul>
              {menuChildren && menuChildren.map(($item) => {
                if ($item.menuType === 'divider') {
                  const { key, ...props } = $item
                  return <DividerMenuItemWrapper key={key} {...props} />
                }
                if ($item.menuType === 'normal') {
                  const { key, ...props } = $item
                  return <NormalMenuItemWrapper key={key} {...props} />
                }
                return null
              })}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </MenuGroup>
    </li>
  )
}

function Menu() {
  const menu = useMenu()
  return (
    <ul className="flex flex-col gap-1 -mx-2">
      {menu.map((item) => {
        if (item.menuType === 'group') {
          const { key, ...props } = item
          return <GroupMenuItemWrapper key={key} {...props} />
        }
        if (item.menuType === 'divider') {
          const { key, ...props } = item
          return <DividerMenuItemWrapper key={key} {...props} />
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
