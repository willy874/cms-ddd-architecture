import { CSSObject, useStyleRegister } from '@ant-design/cssinjs'
import { useLayoutEffect, useMemo, useState } from 'react'
import { camelCaseToKebabCase } from '@/libs/naming-convention'
import { useTheme, AliasToken, GetComponentsTokenByPath } from './design'
import { setDeepProperty, getDeepProperty } from '@/libs/getDeepProperty'

function toAliasTokenFactor<T extends object>(token: T) {
  return (name: keyof T, defaultValue?: string) => {
    const value = defaultValue || token[name]
    return `var(--${camelCaseToKebabCase(String(name))}${value ? `,${value}` : ''})`
  }
}

interface GenStyleHook<
  Path extends string | string[],
  CSS extends Record<string, CSSObject>,
> {
  (params: {
    token: AliasToken & GetComponentsTokenByPath<Path>
    alias: (name: keyof (AliasToken & GetComponentsTokenByPath<Path>), defaultValue?: string) => string
  }): CSS
}

interface GenStyleHookComponentToken<
  Path extends string | string[],
> {
  (params: {
    token: AliasToken
  }): GetComponentsTokenByPath<Path>
}

export function genStyleHook<
  Path extends string | string[],
  CSS extends Record<string, CSSObject>,
>(
  name: Path,
  createCSS: GenStyleHook<Path, CSS>,
  createComponentToken?: GenStyleHookComponentToken<Path>,
): () => [ (node: React.ReactElement) => React.JSX.Element, string, Record<keyof CSS, string>] {
  const paths = (typeof name === 'string' ? [name] : name) as string[]
  return () => {
    const { theme, hashId, token } = useTheme()
    const [styles, setStyles] = useState<Record<string, string>>({})
    const css = useMemo(() => {
      const componentToken = createComponentToken?.({ token }) || {}
      setDeepProperty(token, paths, componentToken as any)
      const globalToken = Object.assign(
        JSON.parse(JSON.stringify(token)),
        getDeepProperty(token, ...paths),
      )
      return createCSS({
        token: globalToken,
        alias: toAliasTokenFactor(globalToken),
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
