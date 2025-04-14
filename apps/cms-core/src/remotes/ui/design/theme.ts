import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Theme } from '@ant-design/cssinjs'
import { defaultSeedTokenKey } from './seed'
import { AliasToken, defaultAliasToken } from './alias'
import { GlobalToken } from './token'

const hashId = 'ui-' + crypto.randomUUID().slice(0, 8)
const theme = new Theme<GlobalToken, AliasToken>([
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
])

export const GlobalTokenContext = createContext({} as GlobalToken)

export function useTheme() {
  const [mode, setMode] = useState<'light' | 'dark'>('light')
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

  const globalToken = useContext(GlobalTokenContext)

  return useMemo(() => {
    const result = {
      theme,
      hashId: `${hashId}-${theme.id}`,
      mode,
      token: theme.getDerivativeToken(globalToken),
    }
    return result
  }, [mode, globalToken])
}
