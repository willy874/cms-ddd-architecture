import { getCoreContext } from './core'
import { PortalContext } from './useCoreContext'

const PortalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <PortalContext.Provider value={getCoreContext()}>
      {children}
    </PortalContext.Provider>
  )
}

export default PortalProvider
