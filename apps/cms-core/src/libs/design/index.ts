import { Theme } from '@ant-design/cssinjs'
import { createContext, useContext, useMemo } from 'react'

export interface GlobalToken {}

const hashId = 'ui-' + crypto.randomUUID().slice(0, 8)
const ThemeContext = createContext(new Theme<GlobalToken, GlobalToken>((acc, item) => Object.assign(acc, item)))
const TokenContext = createContext({} as GlobalToken)

export function useTheme() {
  const theme = useContext(ThemeContext)
  const globalToken = useContext(TokenContext)
  const token = theme.getDerivativeToken(globalToken)
  return useMemo(() => ({ theme, token, hashId }), [theme, token])
}
