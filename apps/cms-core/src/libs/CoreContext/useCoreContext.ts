import { createContext, useContext } from 'react'
import { CoreContext, getCoreContext } from './core'

export const PortalContext = createContext<CoreContext | null>(null)

export const PortalProvider = PortalContext.Provider

export const useCoreContext = (): CoreContext => {
  const ctx = useContext(PortalContext)
  const context = ctx || getCoreContext()
  return context
}
