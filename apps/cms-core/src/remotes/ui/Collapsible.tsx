import { createContext, useContext, useId } from 'react'
import * as collapsible from '@zag-js/collapsible'
import { normalizeProps, useMachine } from '@zag-js/react'
import type { Service } from '@zag-js/collapsible'
import { deepMerge } from '@/libs/deepMerge'
import { genStyleHook } from './style/genStyleHook'
import cn from 'classnames'

const useStyle = genStyleHook('Collapsible',
  () => ({}),
  ({ keyframe }) => ({
    root: {
      '[data-part="trigger"]': {
        display: 'block',
        width: '100%',
        textAlign: 'left',
      },
      '[data-part="content"]': {
        overflow: 'hidden',
      },
      '[data-part="content"][data-state="open"]': {
        animationName: keyframe('expand', {
          from: {
            height: 0,
          },
          to: {
            height: 'var(--height)',
          },
        }),
        animationDuration: '110ms',
        animationTimingFunction: 'cubic-bezier(0, 0, 0.38, 0.9)',
      },
      '[data-part="content"][data-state="closed"]': {
        animationName: keyframe('collapse', {
          from: {
            height: 'var(--height)',
          },
          to: {
            height: 0,
          },
        }),
        animationDuration: '110ms',
        animationTimingFunction: 'cubic-bezier(0, 0, 0.38, 0.9)',
      },
    },
  }))

const CollapsibleContext = createContext<null | Service>(null)

const useCollapsibleContext = () => {
  const context = useContext(CollapsibleContext)
  if (!context) {
    throw new Error('Collapsible compound components must be rendered within a Collapsible component')
  }
  return context
}

interface CollapsibleTriggerProps extends React.ComponentProps<'button'> {
  children?: React.ReactNode
}

export function CollapsibleTrigger({ children, ...props }: CollapsibleTriggerProps) {
  const service = useCollapsibleContext()
  const api = collapsible.connect(service, normalizeProps)
  return (
    <button {...deepMerge(props, api.getTriggerProps())}>{children}</button>
  )
}

interface CollapsibleContentProps extends React.ComponentProps<'div'> {
  children?: React.ReactNode
}

export function CollapsibleContent({ children, ...props }: CollapsibleContentProps) {
  const service = useCollapsibleContext()
  const api = collapsible.connect(service, normalizeProps)
  return (
    <div {...deepMerge(props, api.getContentProps())}>{children}</div>
  )
}

interface CollapsibleProps extends React.ComponentProps<'div'> {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
}

function Collapsible({ children, open, disabled, defaultOpen = true, onOpenChange, ...props }: CollapsibleProps) {
  const service = useMachine(collapsible.machine, {
    id: useId(),
    open,
    disabled,
    defaultOpen,
    onOpenChange: onOpenChange ? ({ open }) => onOpenChange(open) : undefined,
  })
  const api = collapsible.connect(service, normalizeProps)
  const [wrap, hashId, styles] = useStyle()
  return wrap(
    <CollapsibleContext.Provider value={service}>
      <div {...deepMerge(props, api.getRootProps(), {
        className: cn(hashId, styles.root),
      })}
      >
        {children}
      </div>
    </CollapsibleContext.Provider>,
  )
}

export default Collapsible

declare module '@/modules/core' {
  export interface CustomComponentDict {
    Collapsible: typeof Collapsible
    CollapsibleTrigger: typeof CollapsibleTrigger
    CollapsibleContent: typeof CollapsibleContent
  }
}
