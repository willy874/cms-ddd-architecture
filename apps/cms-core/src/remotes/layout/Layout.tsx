import cn from 'classnames'
import { Outlet } from '@tanstack/react-router'
import styles from './styles'

const Layout = () => <div className={cn(styles.fill, styles.flexCol)}><Outlet></Outlet></div>

export default Layout
