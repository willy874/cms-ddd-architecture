import { createContext, useContext } from 'react'
import cn from 'classnames'
import { genStyleHook, InferToken } from './style/genStyleHook'

const useStyle = genStyleHook('Input',
  ({ token }) => ({
    borderColor: token.colorOutline,
  }),
  ({ componentToken }) => ({
    root: {
      'padding': '8px 12px',
      'borderWidth': '1px',
      'borderStyle': 'solid',
      'borderColor': componentToken.borderColor,
      'borderRadius': '4px',
      'outline': 'none',
      'transition': 'box-shadow 0.2s ease, border-color 0.2s ease',
      '&:focus': {
        boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)',
        borderColor: '#3b82f6',
      },
    },
  }),
)

declare module '@/remotes/ui/design' {
  export interface ComponentsToken {
    Input: InferToken<typeof useStyle>
  }
}

interface InputProps extends React.ComponentProps<'input'> {
  'data-testid'?: string
}

const InputContext = createContext<InputProps>({})

function Input({ className, ...props }: InputProps) {
  const { className: contextClassName, ...contextProps } = useContext(InputContext)
  const [wrap, hashId, styles] = useStyle()
  return wrap(
    <input
      {...contextProps}
      {...props}
      className={cn(
        hashId,
        styles.root,
        className,
        contextClassName,
      )}
    />,
  )
}

export default Input

Input.InputContext = InputContext

declare module '@/modules/core' {
  export interface CustomComponentDict {
    Input: typeof Input
  }
}
