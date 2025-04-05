import { theme as AntdTheme, GlobalToken } from 'antd'
import { CSSObject, useStyleRegister } from '@ant-design/cssinjs'
import { useState } from 'react'

export function genStyleHook<T extends Record<string, CSSObject>>(name: string, fn: (token: GlobalToken) => T): () => [ (node: React.ReactElement) => React.JSX.Element, string, Record<keyof T, string>] {
  return () => {
    const { theme, token, hashId } = AntdTheme.useToken()
    const css = fn(token)
    const [styles, setStyles] = useState<Record<string, string>>({})
    const wrap = useStyleRegister({
      path: [name],
      theme,
      token,
      hashId,
    }, () => {
      const result: Record<string, CSSObject> = {}
      const dict: Record<string, string> = {}
      Object.keys(css).forEach((key) => {
        const style = css[key]
        const className = `${name}__${key}`
        result[`.${className}`] = style
        dict[key] = className
      })
      setStyles(dict)
      return result
    })
    return [wrap, hashId, styles as any] as const
  }
}
