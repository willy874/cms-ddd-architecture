import { createContext, useContext, useId, useMemo, useInsertionEffect } from 'react'
import { camelCaseToKebabCase } from '@/libs/naming-convention'
import { useTheme } from '@/remotes/ui/design'

export interface GlobalUIConfig {
  id?: string
}

const createCSSVariable = (mode: string, dict: Record<string, any>) => {
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
  const { theme, mode: themeMode, token: designToken } = useTheme()
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
  }, [themeMode, $$id, theme])

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
