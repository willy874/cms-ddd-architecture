export interface CustomMenuItem {}

type NoneMenuItem = {
  type: 'none'
}

export interface NormalMenuItem extends Partial<CustomMenuItem> {
  key: string
  type: 'normal'
  label?: ((props: CustomProps<'normal'>) => React.ReactNode) | string
  action?: ((event: React.MouseEvent) => void) | string
  auth?: string | boolean
}

export interface DividerMenuItem extends Partial<CustomMenuItem> {
  key?: string
  type: 'divider'
}

type MenuSubItem = NormalMenuItem | DividerMenuItem | NoneMenuItem
export interface GroupMenuItem extends Partial<CustomMenuItem> {
  key: string
  type: 'group'
  label?: ((props: CustomProps<'group'>) => React.ReactNode) | string
  auth?: string | boolean
  children?: MenuSubItem[]
}

export type MenuItem = NormalMenuItem | DividerMenuItem | GroupMenuItem | NoneMenuItem

export type MenuList = MenuItem[]

type MenuItemType = MenuItem['type']

export interface CustomProps<T extends MenuItemType = MenuItemType> {
  item: MenuItem & { type: T }
  index: number
  menuList: MenuList
}
