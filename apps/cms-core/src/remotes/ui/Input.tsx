import { createContext, useContext } from 'react'
import cn from 'classnames'
import { genStyleHook } from '@/libs/hooks/genStyleHook'

const useStyle = genStyleHook('Input', () => ({
  root: {
    'width': '100%',
    'padding': '8px 12px',
    'border': '1px solid #d1d5db',
    'borderRadius': '4px',
    'outline': 'none',
    'transition': 'box-shadow 0.2s ease, border-color 0.2s ease',
    '&:focus': {
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)',
      borderColor: '#3b82f6',
    },
  },
}))

interface InputContextType {
  error?: boolean
  disabled?: boolean
  readOnly?: boolean
  inputType?: React.ComponentProps<typeof Input>['type']
}

const InputContext = createContext<InputContextType>({})

interface InputProps extends React.ComponentProps<'input'> {
  'data-testid'?: string
}

function Input({ className, ...props }: InputProps) {
  const { error, disabled, readOnly, inputType } = useContext(InputContext)
  const [wrap, hashId, styles] = useStyle()
  return wrap(
    <input
      className={cn(
        hashId,
        styles.root,
        {
          'border-red-500 focus:ring-red-500 focus:border-red-500': error,
        },
        className,
      )}
      type={inputType}
      aria-invalid={error}
      disabled={disabled}
      readOnly={readOnly}
      {...props}
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
