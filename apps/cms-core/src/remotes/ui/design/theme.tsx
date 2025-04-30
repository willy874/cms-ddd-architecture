import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Theme } from '@ant-design/cssinjs'
import { defaultSeedTokenKey } from './seed'
import { defaultAliasToken } from './alias'
import { GlobalToken } from './token'
import { reactive } from 'vue'
import { DeepPartial } from '../utils'
import { defaultComponentsToken, onComponentTokenChange } from './components'

const hashId = 'ui-' + crypto.randomUUID().slice(0, 8)
export const theme = new Theme<any, GlobalToken>([
  (token) => {
    for (const key in defaultSeedTokenKey) {
      const $key = key as keyof typeof defaultSeedTokenKey
      if (Object.prototype.hasOwnProperty.call(token, key)) {
        continue
      }
      token[$key] = defaultSeedTokenKey[$key]
    }
    return token
  },
  (token) => {
    for (const key in defaultAliasToken) {
      const $key = key as keyof typeof defaultAliasToken
      if (Object.prototype.hasOwnProperty.call(token, key)) {
        continue
      }
      token[$key] = defaultAliasToken[$key]
    }
    return token
  },
  (token) => {
    for (const key in defaultComponentsToken) {
      const $key = key as keyof typeof defaultComponentsToken
      if (Object.prototype.hasOwnProperty.call(token, key)) {
        continue
      }
      token[$key] = defaultComponentsToken[$key]
    }
    return token
  },
])

type ThemeMode = 'light' | 'dark' | undefined

export const GlobalTokenContext = createContext(reactive({}) as GlobalToken)
export const ThemeModeContext = createContext<ThemeMode>(undefined)

interface ThemeProviderProps {
  mode?: 'light' | 'dark'
  token?: DeepPartial<GlobalToken>
  children: React.ReactNode
}

export function ThemeProvider({ children, mode: propsMode, token: propsToken }: ThemeProviderProps) {
  const themeMode = useContext(ThemeModeContext)
  const { token } = useTheme()
  const [systemMode, setMode] = useState<ThemeMode>(undefined)

  const [, updateComponentsToken] = useState({})

  useEffect(() => {
    return onComponentTokenChange(() => {
      updateComponentsToken({})
    })
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    setMode(media.matches ? 'dark' : 'light')

    const onThemeChange = (event: MediaQueryListEvent) => {
      setMode(event.matches ? 'dark' : 'light')
    }
    media.addEventListener('change', onThemeChange)
    return () => {
      media.removeEventListener('change', onThemeChange)
    }
  }, [])

  const mergeToken = useMemo(() => Object.assign({}, token, propsToken), [propsToken, token])
  const modeContextValue = useMemo(() => propsMode || themeMode || systemMode || 'light', [propsMode, systemMode, themeMode])

  return (
    <GlobalTokenContext.Provider value={mergeToken}>
      <ThemeModeContext.Provider value={modeContextValue}>
        {children}
      </ThemeModeContext.Provider>
    </GlobalTokenContext.Provider>
  )
}

interface ThemeParams {
  mode?: 'light' | 'dark'
  token?: DeepPartial<GlobalToken>
}

export function useTheme({ mode: propsMode, token: propsToken }: ThemeParams = {}) {
  const contextGlobalToken = useContext(GlobalTokenContext)
  const themeMode = useContext(ThemeModeContext)

  return useMemo(() => {
    const mode = propsMode || themeMode
    const token = theme.getDerivativeToken((propsToken || contextGlobalToken) as GlobalToken)
    const result = {
      theme,
      hashId: `${hashId}-${theme.id}`,
      mode,
      token,
    }
    return result
  }, [propsMode, contextGlobalToken, propsToken, themeMode])
}
