import { CSSObject, useStyleRegister } from '@ant-design/cssinjs'
import { useState } from 'react'
import { GlobalToken, useTheme } from '../design'

export function genStyleHook<T extends Record<string, CSSObject>>(name: string | string[], fn: (token: GlobalToken) => T): () => [ (node: React.ReactElement) => React.JSX.Element, string, Record<keyof T, string>] {
  return () => {
    const { theme, token, hashId } = useTheme()
    const css = fn(token)
    const [styles] = useState<Record<string, string>>({})
    const wrap = useStyleRegister({
      path: typeof name === 'string' ? [name] : name,
      theme,
      token,
      hashId,
    }, () => {
      const result: Record<string, CSSObject> = {}
      const dict: Record<string, string> = {}
      const hash = hashId.match(/-([a-zA-Z0-9]+$)/)?.[1]
      Object.keys(css).forEach((key) => {
        const style = css[key]
        const className = `${name}__${key}${hash ? `-${hash}` : ''}`
        result[`.${className}`] = style
        dict[key] = className
      })
      Object.assign(styles, dict)
      return result
    })
    return [wrap, hashId, styles as any] as const
  }
}
