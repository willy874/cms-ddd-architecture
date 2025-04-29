import { useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/libs/components'
import { useRenderComponent } from './hooks/useRenderComponent'

export interface CustomMenuMeta {}

interface MenuLabelProps<Meta extends Record<string, unknown> = {}> {
  isOpen?: boolean
  meta?: CustomMenuMeta & Meta
}
interface MenuDividerProps<Meta extends Record<string, unknown> = {}> {
  meta?: CustomMenuMeta & Meta
}
interface MenuGroupProps<Meta extends Record<string, unknown> = {}> {
  isOpen: boolean
  meta?: CustomMenuMeta & Meta
  children: React.ReactNode
}

interface NormalMenu<Meta extends Record<string, unknown> = {}> {
  key: string
  menuType: 'normal'
  meta?: CustomMenuMeta & Meta
  component?: ((props: MenuLabelProps<Meta>) => React.ReactNode)
  onClick?: ((event: React.MouseEvent) => void)
}

interface DividerMenu<Meta extends Record<string, unknown> = {}> {
  key: string
  menuType: 'divider'
  meta?: CustomMenuMeta & Meta
  component?: ((props: MenuDividerProps<Meta>) => React.ReactNode)
}

interface GroupMenu<Meta extends Record<string, unknown> = {}> {
  key: string
  menuType: 'group'
  meta?: CustomMenuMeta & Meta
  component?: ((props: MenuLabelProps<Meta>) => React.ReactNode)
  menuChildren?: (NormalMenu<Meta> | DividerMenu<Meta>)[]
}

interface CustomMenu<Meta extends Record<string, unknown> = {}> {
  key: string
  menuType: string
  meta?: CustomMenuMeta & Meta
}

export type MenuItem<Meta extends Record<string, unknown> = {}> = NormalMenu<Meta> | DividerMenu<Meta> | GroupMenu<Meta> | CustomMenu<Meta>

interface NormalMenuItemComponentProps<Meta extends Record<string, unknown> = {}> {
  isOpen?: boolean
  meta?: CustomMenuMeta & Meta
  component?: ((props: MenuLabelProps<Meta>) => React.ReactNode)
  onClick?: ((event: React.MouseEvent) => void)
  renderMenuLabel?: ((props: MenuLabelProps<Meta>) => React.ReactNode)
}

function NormalMenuItemWrapper<Meta extends Record<string, unknown> = {}>({ meta, isOpen, component, onClick, renderMenuLabel }: NormalMenuItemComponentProps<Meta>) {
  const renderProps = { meta, isOpen } as MenuLabelProps<Meta>
  const MenuLabelComponent = useRenderComponent([component, renderMenuLabel], renderProps)
  return (
    <li onClick={onClick} data-scope="menu-normal-wrapper">
      <MenuLabelComponent />
    </li>
  )
}

interface DividerMenuItemComponentProps<Meta extends Record<string, unknown> = {}> {
  meta?: CustomMenuMeta & Meta
  component?: ((props: MenuDividerProps<Meta>) => React.ReactNode)
  renderMenuDivider?: ((props: MenuDividerProps<Meta>) => React.ReactNode)
}

function DividerMenuItemWrapper<Meta extends Record<string, unknown> = {}>({ meta, component, renderMenuDivider }: DividerMenuItemComponentProps<Meta>) {
  const renderProps = { meta } as MenuDividerProps<Meta>
  const MenuDividerComponent = useRenderComponent([component, renderMenuDivider], renderProps)
  return (
    <li data-scope="menu-divider-wrapper">
      <MenuDividerComponent />
    </li>
  )
}

interface GroupMenuItemComponentProps<Meta extends Record<string, unknown> = {}> {
  meta?: CustomMenuMeta & Meta
  menuChildren?: MenuItem<Meta>[]
  component?: ((props: MenuLabelProps<Meta>) => React.ReactNode)
  renderMenuLabel?: ((props: MenuLabelProps<Meta>) => React.ReactNode)
  renderMenuGroup?: ((props: MenuGroupProps<Meta>) => React.ReactNode)
  renderMenuDivider?: ((props: MenuDividerProps<Meta>) => React.ReactNode)
}

function GroupMenuItemWrapper<Meta extends Record<string, unknown> = {}>({ meta, menuChildren, component, renderMenuLabel, renderMenuGroup, renderMenuDivider }: GroupMenuItemComponentProps<Meta>) {
  const [isOpen, setIsOpen] = useState(true)
  const MenuLabelComponent = useRenderComponent([component, renderMenuLabel], { meta, isOpen })
  const MenuGroup = useRenderComponent([renderMenuGroup], { meta, isOpen })
  return (
    <li data-scope="menu-group-wrapper">
      <MenuGroup>
        <Collapsible open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
          <CollapsibleTrigger>
            <MenuLabelComponent />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="pl-4" data-scope="menu-group-content">
              {menuChildren && menuChildren.map((menuItem) => {
                if (menuItem.menuType === 'divider') {
                  const item = menuItem as DividerMenu<Meta>
                  return (
                    <DividerMenuItemWrapper
                      key={item.key}
                      meta={item.meta}
                      component={item.component}
                      renderMenuDivider={renderMenuDivider}
                    />
                  )
                }
                if (menuItem.menuType === 'normal') {
                  const item = menuItem as NormalMenu<Meta>
                  return (
                    <NormalMenuItemWrapper
                      key={item.key}
                      isOpen={isOpen}
                      meta={item.meta}
                      component={item.component}
                      onClick={item.onClick}
                      renderMenuLabel={renderMenuLabel}
                    />
                  )
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

export interface MenuProps<T extends MenuItem<any> = MenuItem<any>> {
  menuList: T[]
  renderMenuLabel?: ((props: MenuLabelProps<T['meta']>) => React.ReactNode)
  renderMenuGroup?: ((props: MenuGroupProps<T['meta']>) => React.ReactNode)
  renderMenuDivider?: ((props: MenuDividerProps<T['meta']>) => React.ReactNode)
}

function Menu<T extends MenuItem>({ menuList, renderMenuLabel, renderMenuGroup, renderMenuDivider }: MenuProps<T>) {
  type Meta = T['meta'] extends Record<string, unknown> ? T['meta'] : never
  return (
    <ul className="flex flex-col gap-1 -mx-2">
      {menuList.map((menuItem) => {
        if (menuItem.menuType === 'normal') {
          const item = menuItem as NormalMenu<Meta>
          return (
            <NormalMenuItemWrapper
              key={item.key}
              meta={item.meta}
              component={item.component}
              onClick={item.onClick}
              renderMenuLabel={renderMenuLabel}
            />
          )
        }
        if (menuItem.menuType === 'divider') {
          const item = menuItem as DividerMenu<Meta>
          return (
            <DividerMenuItemWrapper
              key={item.key}
              meta={item.meta}
              component={item.component}
              renderMenuDivider={renderMenuDivider}
            />
          )
        }
        if (menuItem.menuType === 'group') {
          const item = menuItem as GroupMenu<Meta>
          return (
            <GroupMenuItemWrapper
              key={item.key}
              meta={item.meta}
              menuChildren={item.menuChildren}
              component={item.component}
              renderMenuLabel={renderMenuLabel}
              renderMenuGroup={renderMenuGroup}
              renderMenuDivider={renderMenuDivider}
            />
          )
        }
        return null
      })}
    </ul>
  )
}

export default Menu

declare module '@/modules/core' {
  export interface CustomComponentDict {
    Menu: typeof Menu
  }
}
