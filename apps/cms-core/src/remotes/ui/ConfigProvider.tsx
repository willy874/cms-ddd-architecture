import { createContext, useContext, useId, useMemo, useInsertionEffect } from 'react'
import { CamelCaseToKebabCase } from '@/libs/naming-convention'
import { GlobalToken, useTheme } from '@/libs/design'

export interface GlobalUIConfig {
  id?: string
}

function camelCaseToKebabCase<S extends string>(str: S): CamelCaseToKebabCase<S> {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() as CamelCaseToKebabCase<S>
}

const createCSSVariable = (mode: string, dict: GlobalToken) => {
  const cssStyleDeclaration = window.getComputedStyle(document.body)
  const cssVariables = Object.entries(dict)
    .map(([key, defaultValue]) => {
      const variableProperty = camelCaseToKebabCase(key)
      const variableName = `--${mode}-${variableProperty}`
      const rootValue = cssStyleDeclaration.getPropertyValue(variableName)
      const variableValue = rootValue ? `var(${variableName})` : defaultValue
      return `--${variableProperty}: ${variableValue};`
    })
    .join(' ')
  return cssVariables
}

const ConfigContext = createContext({} as GlobalUIConfig)

const useConfigContext = () => useContext(ConfigContext)

function ConfigProvider({ children, id, ...props }: React.ComponentProps<'div'>) {
  const config = useConfigContext()
  const { token: designToken, mode: themeMode } = useTheme()
  const $id = useId()
  const $$id = useMemo(() => id || $id, [$id, id])

  useInsertionEffect(() => {
    const style = document.createElement('style')
    const styleContent = ` #${$id.replace(/[#.:'"]/g, (m) => `\\${m}`)} {${createCSSVariable(themeMode, designToken)}}`
    style.innerHTML = styleContent
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [themeMode, $$id, designToken])

  const $config = useMemo(() => {
    return {
      ...config,
      id: $$id,
    }
  }, [config, $$id])

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
