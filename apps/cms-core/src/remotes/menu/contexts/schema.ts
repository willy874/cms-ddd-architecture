export interface CustomMenuItem {}

type NoneMenuItem = {
  type: 'none'
}

interface Query {
  name: string
  params?: any[]
}

interface Command {
  name: string
  params?: any[]
}

export interface NormalMenuItem extends Partial<CustomMenuItem> {
  id: string
  type: 'normal'
  label?: ((props: CustomProps<NormalMenuItem>) => React.ReactNode) | string
  action?: ((event: React.MouseEvent) => void) | string | Command
  auth?: string | boolean | (() => boolean) | Query
}

export interface DividerMenuItem extends Partial<CustomMenuItem> {
  type: 'divider'
}

type MenuSubItem = NormalMenuItem | DividerMenuItem | NoneMenuItem
export interface GroupMenuItem extends Partial<CustomMenuItem> {
  id: string
  type: 'group'
  label?: ((props: CustomProps<GroupMenuItem>) => React.ReactNode) | string
  auth?: string | boolean | (() => boolean) | Query
  children?: MenuSubItem[]
}

export type MenuItem = NormalMenuItem | DividerMenuItem | GroupMenuItem | NoneMenuItem

export type MenuList = MenuItem[]

export type MenuItemType = MenuItem['type']

export interface CustomProps<T extends MenuItem = MenuItem> {
  item?: T
  index?: number
  menuList?: MenuList
}
