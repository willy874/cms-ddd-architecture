import { useMemo } from 'react'
import { useCoreContext } from '@/libs/CoreContext'
import { useMenu } from '../contexts/menu'
import { filterTree, mapTree } from '../utils'
// import { DividerMenuItem, GroupMenuItem, NormalMenuItem } from '../contexts/schema'

function MenuList(): React.ReactNode {
  const menu = useMenu()
  const context = useCoreContext()
  const Menu = context.componentRegistry.get('Menu')
  const MenuLabel = context.componentRegistry.get('MenuLabel')
  const MenuGroup = context.componentRegistry.get('MenuGroup')
  const MenuDivider = context.componentRegistry.get('MenuDivider')
  const menuList = useMemo(() => {
    const $menu = mapTree('menuChildren', menu, ($item) => {
      return {
        key: $item.id || '',
        menuType: $item.menuType,
        meta: { ...$item },
      } satisfies React.ComponentProps<typeof Menu>['menuList'][number]
    })
    return filterTree('menuChildren', $menu, ($item) => {
      return !!$item.key && $item.meta.isShow
    })
  }, [menu])
  return (
    <Menu
      menuList={menuList}
      renderMenuDivider={(props) => {
        const type = props.meta?.item.type
        if (type === 'divider') {
          return (
            <MenuDivider
              item={props.meta?.item}
              index={props.meta?.index}
              menuList={props.meta?.menuList}
            />
          )
        }
        return null
      }}
      renderMenuLabel={(props) => {
        const type = props.meta?.item.type
        if (type === 'group' || type === 'normal') {
          return (
            <MenuLabel
              item={props.meta?.item}
              index={props.meta?.index}
              menuList={props.meta?.menuList}
              isOpen={props.isOpen}
            />
          )
        }
        return null
      }}
      renderMenuGroup={(props) => {
        const type = props.meta?.item.type
        if (type === 'group') {
          return (
            <MenuGroup
              item={props.meta?.item}
              index={props.meta?.index}
              menuList={props.meta?.menuList}
              isOpen={props.isOpen}
            >
              {props.children}
            </MenuGroup>
          )
        }
        return null
      }}
    />
  )
}

export default MenuList
