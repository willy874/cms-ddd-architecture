import { z } from 'zod'
import { MenuItemSchema } from '../contexts/schema'

interface MenuItemProps {
  item: z.infer<typeof MenuItemSchema>
  children?: React.ReactNode
}

function DefaultMenuItem({ item, children }: MenuItemProps): React.ReactNode {
  if (item.type === 'group') {
    return (
      <>
        {item.label}
        {children}
      </>
    )
  }
  if (item.type === 'normal' && typeof item.label === 'string') {
    return item.label
  }
  if (item.type === 'divider') {
    return null
  }
  return null
}
export default DefaultMenuItem
