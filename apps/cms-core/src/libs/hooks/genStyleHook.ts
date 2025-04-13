import { CSSObject, useStyleRegister } from '@ant-design/cssinjs'
import { useLayoutEffect, useMemo, useState } from 'react'
import { useTheme } from '../design'
import { camelCaseToKebabCase } from '../naming-convention'
import { AliasToken, ComponentsToken } from '../design'
import { GetDeepProperty } from '../getDeepProperty'

type GetComponentsTokenByPath<
  Path extends string | string[],
> = GetDeepProperty<ComponentsToken, Path extends string[] ? Path : [Path]>

function toAliasTokenFactor<T extends object>(token: T) {
  return (name: keyof T) => `var(--${camelCaseToKebabCase(String(name))}, ${token[name]})`
}

interface GenStyleHook<Token extends AliasToken> {
  token: Token
  alias: (n: keyof Token) => string
}

export function genStyleHook<
  Path extends string | string[],
  CSS extends Record<string, CSSObject>,
  Token extends AliasToken & GetComponentsTokenByPath<Path>,
>(
  name: Path, fn: (token: GenStyleHook<Token>) => CSS,
): () => [ (node: React.ReactElement) => React.JSX.Element, string, Record<keyof CSS, string>] {
  const paths = (typeof name === 'string' ? [name] : name) as string[]
  return () => {
    const { theme, token, hashId } = useTheme()
    const [styles, setStyles] = useState<Record<string, string>>({})
    const css = useMemo(() => {
      const t = token as Token
      return fn({
        token: t,
        alias: toAliasTokenFactor(t),
      })
    }, [token])
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
