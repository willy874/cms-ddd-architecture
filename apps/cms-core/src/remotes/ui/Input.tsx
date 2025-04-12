import { createContext, useContext } from 'react'
import cn from 'classnames'

interface InputContextType {
  error?: boolean
  disabled?: boolean
  readOnly?: boolean
  inputType?: React.ComponentProps<typeof Input>['type']
}

const InputContext = createContext<InputContextType>({})

interface InputProps extends React.ComponentProps<'input'> {}

function Input({ className, ...props }: InputProps) {
  const { error, disabled, readOnly, inputType } = useContext(InputContext)
  return (
    <input
      className={cn(
        'width:100% padding:8px|12px border:1px|solid|gray-300 border-radius:4px focus:outline:none focus:ring:2px|blue-500 focus:border:blue-500',
        {
          'border-red-500 focus:ring-red-500 focus:border-red-500': error,
        },
      )}
      type={inputType}
      aria-invalid={error}
      disabled={disabled}
      readOnly={readOnly}
      {...props}
    />
  )
}

export default Input

Input.InputContext = InputContext

declare module '@/modules/core' {
  export interface CustomComponentDict {
    Input: typeof Input
  }
}
