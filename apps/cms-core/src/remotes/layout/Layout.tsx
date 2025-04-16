import { STORE_LAYOUT_TYPE } from '@/constants/store'
import { getCoreContext } from '@/libs/CoreContext'
import { useComputed } from '@/libs/hooks/useComputed'

function Layout({ children }: { children: React.ReactNode }) {
  const layoutType = useComputed(() => getCoreContext().store.get(STORE_LAYOUT_TYPE))
  if (layoutType !== 'default') {
    return children
  }
  const AppHeader = getCoreContext().componentRegistry.get('Header')
  const LeftAside = getCoreContext().componentRegistry.get('LeftAside')
  const RightAside = getCoreContext().componentRegistry.get('RightAside')
  const AppFooter = getCoreContext().componentRegistry.get('Footer')
  return (
    <div className="flex flex:column flex-grow:1">
      <AppHeader />
      <div className="flex flex-grow:1">
        <LeftAside />
        <main className="flex flex:column flex-grow:1">
          {children}
        </main>
        <RightAside />
      </div>
      <footer className="flex-shrink:1">
        <AppFooter />
      </footer>
    </div>
  )
}

export default Layout
