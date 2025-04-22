import { useMenu } from '@/remotes/menu/contexts/menu'

function NormalMenuItem() {
  return <li></li>
}

function DividerMenuItem() {
  return <li></li>
}

function GroupMenuItem() {
  return <li></li>
}

function Menu() {
  const menu = useMenu()
  return (
    <ul>
      {menu.map((item) => {
        if (item.type === 'group') {
          return <GroupMenuItem />
        }
        if (item.type === 'divider') {
          return <DividerMenuItem />
        }
        if (item.type === 'normal') {
          return <NormalMenuItem />
        }
        return null
      })}
    </ul>
  )
}

export default Menu
