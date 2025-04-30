import { createContext, useContext, useId, useMemo, useInsertionEffect } from 'react'
import { DeepPartial } from './utils'
import { GlobalToken, useTheme, createCSSVariable } from './design'
import { GlobalTokenContext, ThemeProvider } from './design/theme'
export interface GlobalUIConfig {
  id?: string
}

const ConfigContext = createContext({} as GlobalUIConfig)

const useConfigContext = () => useContext(ConfigContext)

interface TokenVariableProviderProps {
  id: string
  children: React.ReactNode
}

function TokenVariableProvider({ id, children }: TokenVariableProviderProps) {
  const { mode, token } = useTheme()

  useInsertionEffect(() => {
    const body = document.querySelector('body')
    if (!body) {
      throw new Error('body not found')
    }
    body.classList.add(id)
    return () => {
      body.classList.remove(id)
    }
  }, [id])

  useInsertionEffect(() => {
    const style = document.createElement('style')
    const styleContent = `.${id.replace(/[#.:'"]/g, (m) => `\\${m}`)} {${createCSSVariable(mode!, token, {})}}`
    style.innerHTML = styleContent
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [token, mode, id])

  return (
    <GlobalTokenContext.Provider value={token}>
      {children}
    </GlobalTokenContext.Provider>
  )
}

interface ConfigProviderProps {
  id?: string
  children: React.ReactNode
  mode?: 'light' | 'dark'
  designToken?: DeepPartial<GlobalToken>
}

function ConfigProvider({ children, mode, designToken, id: propsId }: ConfigProviderProps) {
  const config = useConfigContext()
  const componentId = useId()
  const privateId = useMemo(() => propsId || componentId, [componentId, propsId])

  const $config = useMemo(() => {
    return {
      ...config,
      id: privateId,
    }
  }, [config, privateId])

  return (
    <ThemeProvider mode={mode} token={designToken}>
      <ConfigContext.Provider value={$config}>
        <TokenVariableProvider id={privateId}>
          {children}
        </TokenVariableProvider>
      </ConfigContext.Provider>
    </ThemeProvider>
  )
}

export default ConfigProvider

declare module '@/modules/core' {
  export interface CustomComponentDict {
    ConfigProvider: typeof ConfigProvider
  }
}
