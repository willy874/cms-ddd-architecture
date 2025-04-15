import { createContext, useContext, useId, useMemo, useInsertionEffect } from 'react'
import { reactive, watch } from 'vue'
import { camelCaseToKebabCase } from '@/libs/naming-convention'
import { GlobalToken, useTheme } from '@/remotes/ui/design'
import { DeepPartial } from './utils'
import { GlobalTokenContext } from './design/theme'

export interface GlobalUIConfig {
  id?: string
}

const createCSSVariable = (mode: string, dict: Record<string, any>) => {
  // const cssStyleDeclaration = window.getComputedStyle(document.body)
  const cssStyleString = (key: string, defaultValue: unknown): string => {
    if (typeof defaultValue === 'string') {
      const variableProperty = camelCaseToKebabCase(key)
      const variableName = `--${mode}-${variableProperty}`
      // const rootValue = cssStyleDeclaration.getPropertyValue(variableName)
      return `--${variableProperty}: var(${variableName}, ${defaultValue});`
    }
    if (defaultValue && typeof defaultValue === 'object') {
      return Object.entries(defaultValue)
        .map(([subKey, subValue]) => cssStyleString(`${key}-${subKey}`, subValue))
        .join(' ')
    }
    return ''
  }
  const cssVariables = Object.entries(dict)
    .map(([key, defaultValue]) => cssStyleString(key, defaultValue))
    .join(' ')
  return cssVariables
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
    return reactive(Object.assign({}, $designToken, designToken)) as GlobalToken
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
    const clearup = watch($$designToken, (token) => {
      const styleContent = `.${$id.replace(/[#.:'"]/g, (m) => `\\${m}`)} {${createCSSVariable(themeMode, token)}}`
      style.innerHTML = styleContent
    })
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
      clearup()
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
