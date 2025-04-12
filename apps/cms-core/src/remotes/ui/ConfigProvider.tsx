import { createContext, useContext, useId, useMemo } from 'react'

export interface GlobalUIConfig {
  id?: string
}

const ConfigContext = createContext({} as GlobalUIConfig)

const useConfigContext = () => useContext(ConfigContext)

function ConfigProvider({ children, id, ...props }: React.ComponentProps<'div'>) {
  const config = useConfigContext()
  const $id = useId()

  const $config = useMemo(() => {
    return {
      ...config,
      id: id || $id,
    }
  }, [config, id, $id])
  return (
    <ConfigContext.Provider value={$config}>
      <div {...props} id={$config.id}>
        {children}
      </div>
    </ConfigContext.Provider>
  )
}

ConfigProvider.useConfigContext = useConfigContext

export default ConfigProvider

declare module '@/modules/core' {
  export interface CustomComponentDict {
    ConfigProvider: typeof ConfigProvider
  }
}
