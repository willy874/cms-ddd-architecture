import { createContext, useContext } from 'react'
import { CoreContext } from '../CoreContext/core'

const CoreContextReactCtx = createContext<CoreContext | null>(null)

export function CoreContextProvider({ children, value }: React.ProviderProps<CoreContext>) {
  return (
    <CoreContextReactCtx.Provider value={value}>
      {children}
    </CoreContextReactCtx.Provider>
  )
}

export function useCoreContext(): CoreContext {
  const context = useContext(CoreContextReactCtx)
  if (!context) {
    throw new Error('useCoreContext must be used within a CoreReactProvider')
  }
  return context
}
