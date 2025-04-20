import { CSSObject, useStyleRegister } from '@ant-design/cssinjs'
import { useLayoutEffect, useMemo, useState } from 'react'
import { setDeepProperty } from '@/libs/getDeepProperty'
import { useTheme, AliasToken, defaultComponentsToken } from '../design'
import { camelCaseToKebabCase, KebabToCamelCase } from '@/libs/naming-convention'
import { DeepFlatKey } from '../utils'

interface GenComponentTokenFn<
  Token extends Record<string, string>,
> {
  (params: {
    token: AliasToken
    tokenName: Record<keyof AliasToken, string>
    cssVariable: (name: KebabToCamelCase<DeepFlatKey<AliasToken>>, def?: string) => string
  }): Token
}

interface GenStyleFn<
  Token extends Record<string, string>,
  CSS extends Record<string, CSSObject>,
> {
  (params: {
    token: AliasToken
    componentToken: Token
    componentTokenName: Record<keyof Token, string>
    cssVariable: (name: KebabToCamelCase<DeepFlatKey<AliasToken>> & string, def?: string) => string
  }): CSS
}

type UseStyleHook<Token, CSS> = () => [ (node: React.ReactElement) => React.JSX.Element, string, Record<keyof CSS, string>, Token]

export function genStyleHook<
  Path extends string | string[],
  CSS extends Record<string, CSSObject>,
  Token extends Record<string, string>,
>(
  name: Path,
  createCSS: GenStyleFn<Token, CSS>,
): UseStyleHook<Token, CSS>

export function genStyleHook<
  Path extends string | string[],
  CSS extends Record<string, CSSObject>,
  Token extends Record<string, string>,
>(
  name: Path,
  createComponentToken: GenComponentTokenFn<Token>,
  createCSS: GenStyleFn<Token, CSS>,
): UseStyleHook<Token, CSS>

export function genStyleHook<
  Path extends string | string[],
  CSS extends Record<string, CSSObject>,
  Token extends Record<string, string>,
>(
  name: Path,
  fn1: (...args: any[]) => any,
  fn2?: (...args: any[]) => any,
): UseStyleHook<Token, CSS> {
  const createComponentToken = (fn2 ? fn1 : undefined) as GenComponentTokenFn<Token>
  const createCSS = (fn2 ? fn2 : fn1) as GenStyleFn<Token, CSS>
  const paths = (typeof name === 'string' ? [name] : name) as string[]
  const cssVariableFactor = (_token: unknown) => {
    return (name: string, def?: string) => {
      const property = camelCaseToKebabCase(name)
      if (def) {
        return `var(--${property}, ${def})`
      }
      return `var(--${property})`
    }
  }
  return () => {
    const { theme, hashId, token } = useTheme()
    const [styles, setStyles] = useState<Record<string, string>>({})
    const componentToken = useMemo(() => {
      return (createComponentToken?.({
        token,
        tokenName: Object.fromEntries(
          Object.keys(token).map((key) => {
            const name = `--${camelCaseToKebabCase(paths.join('-'))}-${camelCaseToKebabCase(key)}`
            return [key, name]
          }),
        ) as Record<keyof AliasToken, string>,
        cssVariable: cssVariableFactor(token),
      }) || {})
    }, [token])
    const css = useMemo(() => {
      const componentTokenVar: Record<string, string> = Object.fromEntries(
        Object.keys(componentToken).map((key) => {
          const value = componentToken[key] ? `, ${componentToken[key]}` : ''
          const name = `--${camelCaseToKebabCase(paths.join('-'))}-${camelCaseToKebabCase(key)}`
          if (/^var\(--(.+)\)/.test(componentToken[key])) {
            return [key, value]
          }
          return [key, `var(${name}${value})`]
        }),
      )
      const componentTokenNameVar: Record<string, string> = Object.fromEntries(
        Object.keys(componentToken).map((key) => {
          const name = `--${camelCaseToKebabCase(paths.join('-'))}-${camelCaseToKebabCase(key)}`
          return [key, name]
        }),
      )
      const globalToken = JSON.parse(JSON.stringify(token))
      return createCSS({
        token: globalToken,
        componentTokenName: componentTokenNameVar as Record<keyof Token, string>,
        componentToken: componentTokenVar as Token,
        cssVariable: cssVariableFactor(globalToken),
      })
    }, [componentToken, token])
    const hash = useMemo(() => hashId.match(/-([a-zA-Z0-9]+$)/)?.[1], [hashId])

    useLayoutEffect(() => {
      setDeepProperty(defaultComponentsToken, paths, componentToken as any)
    }, [componentToken, token])

    useLayoutEffect(() => {
      const dict: Record<string, string> = {}
      Object.keys(css).forEach((key) => {
        const className = `${paths.join('-')}__${key}${hash ? `-${hash}` : ''}`
        dict[key] = className
      })
      setStyles(dict)
    }, [css, hash])
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

    return [wrap, hashId, styles as any, componentToken] as const
  }
}

export type InferToken<T extends UseStyleHook<any, any>> = ReturnType<T>[3]
