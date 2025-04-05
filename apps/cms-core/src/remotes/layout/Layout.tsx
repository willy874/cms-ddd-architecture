import { STORE_LAYOUT_TYPE } from '@/constants/store'
import { getPortalContext } from '@/core/PortalContext'
import { useComputed } from '@/libs/proxy'
import { Outlet } from '@tanstack/react-router'

function Layout() {
  const layoutType = useComputed(() => getPortalContext().store.get(STORE_LAYOUT_TYPE))
  if (layoutType !== 'default') {
    return <Outlet />
  }
  const AppHeader = getPortalContext().componentRegistry.get('Header')
  const LeftAside = getPortalContext().componentRegistry.get('LeftAside')
  const RightAside = getPortalContext().componentRegistry.get('RightAside')
  const AppFooter = getPortalContext().componentRegistry.get('Footer')
  return (
    <div className="flex flex:column flex-grow:1">
      <header className="flex-shrink:1">
        <AppHeader />
      </header>
      <div className="flex flex-grow:1">
        <aside className="flex-shrink:1">
          <LeftAside />
        </aside>
        <main className="flex flex:column flex-grow:1">
          <Outlet />
        </main>
        <aside className="flex-shrink:1">
          <RightAside />
        </aside>
      </div>
      <footer className="flex-shrink:1">
        <AppFooter />
      </footer>
    </div>
  )
}

export default Layout

declare module '@/core/custom' {
  export interface CustomComponentDict {
    Header: () => React.ReactNode
    LeftAside: () => React.ReactNode
    RightAside: () => React.ReactNode
    Footer: () => React.ReactNode
  }
}
