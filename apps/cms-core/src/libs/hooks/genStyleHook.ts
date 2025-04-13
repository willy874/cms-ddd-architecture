import { CSSObject, useStyleRegister } from '@ant-design/cssinjs'
import { useLayoutEffect, useMemo, useState } from 'react'
import { GlobalToken, useTheme } from '../design'

export function genStyleHook<T extends Record<string, CSSObject>>(name: string | string[], fn: (token: GlobalToken) => T): () => [ (node: React.ReactElement) => React.JSX.Element, string, Record<keyof T, string>] {
  const paths = typeof name === 'string' ? [name] : name
  return () => {
    const { theme, token, hashId } = useTheme()
    const [styles, setStyles] = useState<Record<string, string>>({})
    const css = useMemo(() => fn(token), [token])
    const hash = useMemo(() => hashId.match(/-([a-zA-Z0-9]+$)/)?.[1], [hashId])

    const wrap = useStyleRegister({
      path: paths,
      theme,
      token,
      hashId,
    }, () => {
      const dict: Record<string, CSSObject> = {}
      Object.keys(css).forEach((key) => {
        const style = css[key]
        const className = `${paths.join('-')}__${key}${hash ? `-${hash}` : ''}`
        dict[`.${className}`] = style
      })
      return dict
    })

    useLayoutEffect(() => {
      const dict: Record<string, string> = {}
      Object.keys(css).forEach((key) => {
        const className = `${paths.join('-')}__${key}${hash ? `-${hash}` : ''}`
        dict[key] = className
      })
      setStyles(dict)
    }, [css, hash])

    return [wrap, hashId, styles as any] as const
  }
}
