import { useCallback, useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/libs/components'

export interface CustomProps {}

export interface MenuLabelProps extends CustomProps {
  isOpen?: boolean
}

export interface MenuGroupProps extends CustomProps {
  isOpen: boolean
  children: React.ReactNode
}

export interface MenuDividerProps extends CustomProps {}

type NoneMenuItemComponentProps = {
  menuType: string
}

export interface NormalMenuItemComponentProps {
  id: string
  menuType: 'normal'
  component?: ((props: any) => React.ReactNode)
  isShow?: boolean
  onClick?: ((event: React.MouseEvent) => void)
  MenuLabel?: ((props: MenuLabelProps) => React.ReactNode)
}

function NormalMenuItemWrapper({ component, isShow, onClick, MenuLabel, ...props }: NormalMenuItemComponentProps) {
  const MenuLabelComponent = component || MenuLabel || (() => null)
  if (!isShow) {
    return null
  }
  const customProps = { ...props, isOpen: undefined }
  return (
    <li onClick={onClick} data-scope="menu-normal-wrapper">
      <MenuLabelComponent {...customProps} />
    </li>
  )
}

export interface DividerMenuItemComponentProps {
  id: string
  menuType: 'divider'
  isShow?: boolean
  MenuDivider?: ((props: MenuDividerProps) => React.ReactNode)
}

function DividerMenuItemWrapper({ isShow, MenuDivider, ...props }: DividerMenuItemComponentProps) {
  const MenuDividerComponent = MenuDivider || (() => null)
  const menuDividerProps = { ...props } satisfies MenuDividerProps
  return isShow
    ? (
        <li data-scope="menu-divider-wrapper">
          <MenuDividerComponent {...menuDividerProps} />
        </li>
      )
    : null
}

export interface GroupMenuItemComponentProps {
  id: string
  menuType: 'group'
  component?: ((props: any) => React.ReactNode)
  isShow?: boolean
  menuChildren?: (NormalMenuItemComponentProps | DividerMenuItemComponentProps | NoneMenuItemComponentProps)[]
  MenuLabel?: ((props: MenuLabelProps) => React.ReactNode)
  MenuGroup?: ((props: MenuGroupProps) => React.ReactNode)
  MenuDivider?: ((props: MenuDividerProps) => React.ReactNode)
}

function GroupMenuItemWrapper({ component, isShow, menuChildren, MenuLabel, MenuGroup, MenuDivider, ...props }: GroupMenuItemComponentProps) {
  const MenuGroupComponent = MenuGroup || (({ children }: any) => children)
  const MenuLabelComponent = component || MenuLabel || (() => null)
  const [isOpen, setIsOpen] = useState(true)
  const onClick = useCallback(() => {}, [])
  if (!isShow) {
    return null
  }
  const menuGroupProps = { isOpen, ...props } satisfies Omit<MenuGroupProps, 'children'>
  const menuLabelProps = { isOpen, ...props } satisfies MenuLabelProps
  return (
    <li onClick={onClick} data-scope="menu-group-wrapper">
      <MenuGroupComponent {...menuGroupProps}>
        <Collapsible open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
          <CollapsibleTrigger>
            <MenuLabelComponent {...menuLabelProps} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="pl-4" data-scope="menu-group-content">
              {menuChildren && menuChildren.map(($props) => {
                if ($props.menuType === 'divider') {
                  const $$props = $props as DividerMenuItemComponentProps
                  return <DividerMenuItemWrapper key={$$props.id} {...$$props} MenuDivider={MenuDivider} />
                }
                if ($props.menuType === 'normal') {
                  const $$props = $props as NormalMenuItemComponentProps
                  return <NormalMenuItemWrapper key={$$props.id} {...$$props} MenuLabel={MenuLabel} />
                }
                return null
              })}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </MenuGroupComponent>
    </li>
  )
}

type MenuItemComponentProps = NormalMenuItemComponentProps | DividerMenuItemComponentProps | GroupMenuItemComponentProps | NoneMenuItemComponentProps

interface MenuProps<T extends MenuItemComponentProps> {
  menuList: T[]
  MenuLabel?: ((props: MenuLabelProps) => React.ReactNode)
  MenuGroup?: ((props: MenuGroupProps) => React.ReactNode)
  MenuDivider?: ((props: MenuDividerProps) => React.ReactNode)
}

function Menu<T extends MenuItemComponentProps>({ menuList, MenuLabel, MenuGroup, MenuDivider }: MenuProps<T>) {
  return (
    <ul className="flex flex-col gap-1 -mx-2">
      {menuList.map((props) => {
        if (props.menuType === 'normal') {
          const item = props as NormalMenuItemComponentProps
          return <NormalMenuItemWrapper key={item.id} {...item} MenuLabel={MenuLabel as any} />
        }
        if (props.menuType === 'divider') {
          const item = props as DividerMenuItemComponentProps
          return <DividerMenuItemWrapper key={item.id} {...item} MenuDivider={MenuDivider as any} />
        }
        if (props.menuType === 'group') {
          const item = props as GroupMenuItemComponentProps
          return <GroupMenuItemWrapper key={item.id} {...item} MenuDivider={MenuDivider as any} MenuLabel={MenuLabel as any} MenuGroup={MenuGroup as any} />
        }
        return null
      })}
    </ul>
  )
}

export default Menu
