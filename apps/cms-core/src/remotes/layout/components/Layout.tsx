import { STORE_LAYOUT_TYPE } from '@/constants/store'
import { getCoreContext } from '@/libs/CoreContext'
import { useComputed } from '@/libs/hooks/useComputed'
import Header from './Header'
import LeftAside from './LeftAside'
import RightAside from './RightAside'
import Footer from './Footer'

function Layout({ children }: { children: React.ReactNode }) {
  const layoutType = useComputed(() => getCoreContext().store.get(STORE_LAYOUT_TYPE))
  if (layoutType !== 'default') {
    return children
  }
  return (
    <div className="flex grow-1">
      <LeftAside />
      <main className="flex flex-col grow-1">
        <Header />
        <div className="flex flex-col grow-1 overflow-hidden">
          {children}
        </div>
        <Footer />
      </main>
      <RightAside />
    </div>
  )
}

export default Layout
