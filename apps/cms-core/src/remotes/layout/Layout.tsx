import { Outlet } from '@tanstack/react-router'

const Layout = () => (
  <div className="flex flex:column flex-grow:1">
    <Outlet />
  </div>
)

export default Layout
