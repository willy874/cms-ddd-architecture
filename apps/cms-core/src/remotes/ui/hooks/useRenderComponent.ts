import { useEffect, useMemo, useRef } from 'react'

type RenderComponentProps = {
  children?: React.ReactNode
  ref?: React.Ref<any>
}

export function useRenderComponent<Comp extends (props: any) => React.ReactNode, Props extends Omit<React.ComponentProps<Comp>, 'children' | 'ref'>>(fns: (Comp | undefined | null)[], props: Props) {
  const fnsRef = useRef(fns)
  const propsRef = useRef(props)

  useEffect(() => {
    fnsRef.current = fns
    propsRef.current = props
  }, [fns, props])

  return useMemo(() => {
    return function ({ children, ref }: RenderComponentProps) {
      const render = fnsRef.current.find(f => f) || (() => null)
      return render({ ...propsRef.current, children, ref })
    }
  }, [])
}
