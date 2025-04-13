import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Theme } from '@ant-design/cssinjs'
import { defaultSeedTokenKey } from './seed'
import { GlobalToken } from './token'

const hashId = 'ui-' + crypto.randomUUID().slice(0, 8)
const ThemeContext = createContext(new Theme<Record<string, any>, GlobalToken>((acc, item) => Object.assign(acc, item)))
const TokenContext = createContext(Object.assign({}, defaultSeedTokenKey) as GlobalToken)

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

  const theme = useContext(ThemeContext)
  const globalToken = useContext(TokenContext)
  const token = theme.getDerivativeToken(globalToken)
  return useMemo(() => ({ theme, token, hashId, mode }), [theme, token, mode])
}
