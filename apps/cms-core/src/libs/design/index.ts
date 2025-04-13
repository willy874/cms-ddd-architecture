import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Theme } from '@ant-design/cssinjs'
import { defaultSeedTokenKey, SeedToken } from './seed'
import './dark.css'
import './light.css'

export interface GlobalToken extends SeedToken {}

export { defaultSeedTokenKey }

const hashId = 'ui-' + crypto.randomUUID().slice(0, 8)
const ThemeContext = createContext(new Theme<GlobalToken, GlobalToken>((acc, item) => Object.assign(acc, item)))
const TokenContext = createContext(Object.assign({}, defaultSeedTokenKey) as GlobalToken)

export function useTheme() {
  const theme = useContext(ThemeContext)
  const globalToken = useContext(TokenContext)
  const token = theme.getDerivativeToken(globalToken)

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

  return useMemo(() => ({ theme, token, hashId, mode }), [theme, token, mode])
}
