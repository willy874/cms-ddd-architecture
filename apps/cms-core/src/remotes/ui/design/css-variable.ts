import { camelCaseToKebabCase } from '@/libs/naming-convention'
import { Theme } from '@ant-design/cssinjs'

export const createCSSVariable = (mode: string, dict: Record<string, any>, theme: Theme<any, any>) => {
  const defaultToken = theme.getDerivativeToken({})
  const cssStyleDeclaration = window.getComputedStyle(document.documentElement)
  const cssStyleString = (key: string, contextValue: unknown, defaultValue?: any): string => {
    if (typeof contextValue === 'string') {
      const variableProperty = camelCaseToKebabCase(key)
      const variableName = `${mode}-${variableProperty}`
      const rootModeValue = cssStyleDeclaration.getPropertyValue(`--${variableName}`)
      if (rootModeValue) {
        return `--${variableProperty}: var(--${variableName}, ${contextValue});`
      }
      if (contextValue !== defaultValue) {
        return `--${variableProperty}: ${contextValue};`
      }
      const rootValue = cssStyleDeclaration.getPropertyValue(`--${variableProperty}`)
      if (rootValue) {
        if (rootValue === defaultValue) {
          return ''
        }
        return `--${variableProperty}: ${rootValue};`
      }
      return `--${variableProperty}: ${defaultValue};`
    }
    if (contextValue && typeof contextValue === 'object') {
      return Object.entries(contextValue)
        .map(([subKey, subValue]) => cssStyleString(`${key}-${subKey}`, subValue, defaultValue ? Reflect.get(defaultValue, subKey) : undefined))
        .join(' ')
    }
    return ''
  }
  const cssVariables = Object.entries(dict)
    .map(([key, value]) => cssStyleString(key, value, Reflect.get(defaultToken, key)))
    .join(' ')
  return cssVariables
}
