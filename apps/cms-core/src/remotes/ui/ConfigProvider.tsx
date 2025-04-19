import { createContext, useContext, useId, useMemo, useInsertionEffect } from 'react'
import { watch } from 'vue'
import { DeepPartial } from './utils'
import { GlobalToken, useTheme, GlobalTokenContext, defaultComponentsToken, createCSSVariable } from './design'
export interface GlobalUIConfig {
  id?: string
}

const ConfigContext = createContext({} as GlobalUIConfig)

const useConfigContext = () => useContext(ConfigContext)

interface ConfigProviderProps {
  id?: string
  children: React.ReactNode
  designToken?: DeepPartial<GlobalToken>
}

function ConfigProvider({ children, id, designToken }: ConfigProviderProps) {
  const config = useConfigContext()
  const { theme, mode: themeMode, token: $designToken } = useTheme()
  const $id = useId()
  const $$id = useMemo(() => id || $id, [$id, id])
  const $$designToken = useMemo(() => {
    return Object.assign({}, $designToken, designToken) as GlobalToken
  }, [designToken, $designToken])

  useInsertionEffect(() => {
    const body = document.querySelector('body')
    if (!body) {
      throw new Error('body not found')
    }
    body.classList.add($$id)
    return () => {
      body.classList.remove($$id)
    }
  }, [$$id])

  useInsertionEffect(() => {
    const style = document.createElement('style')
    const cleanup = watch(defaultComponentsToken, (value) => {
      const token = Object.assign({}, $$designToken, value)
      const styleContent = `.${$id.replace(/[#.:'"]/g, (m) => `\\${m}`)} {${createCSSVariable(themeMode, token, theme)}}`
      style.innerHTML = styleContent
    }, {
      immediate: true,
    })
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
      cleanup()
    }
  }, [themeMode, $$id, theme])

  const $config = useMemo(() => {
    return {
      ...config,
      id: $$id,
    }
  }, [config, $$id])

  return (
    <ConfigContext.Provider value={$config}>
      <GlobalTokenContext.Provider value={$$designToken}>
        {children}
      </GlobalTokenContext.Provider>
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
