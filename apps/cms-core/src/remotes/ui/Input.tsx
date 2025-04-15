import { createContext, useContext } from 'react'
import cn from 'classnames'
import { genStyleHook, InferToken } from './style/genStyleHook'

const useStyle = genStyleHook('Input',
  ({ token, cssVariable }) => ({
    border: `${cssVariable('lineWidth')} ${cssVariable('lineType')} ${cssVariable('colorBorder')}`,
    activeShadow: `0 0 0 2px ${token.controlOutline}`,
    errorActiveShadow: `0 0 0 2px ${token.color.error.outline}`,
  }),
  ({ componentToken, cssVariable }) => ({
    root: {
      'fontSize': cssVariable('fontSize'),
      'color': cssVariable('colorTextBase'),
      'padding': '8px 12px',
      'border': componentToken.border,
      'borderRadius': cssVariable('borderRadiusOuter'),
      'backgroundColor': 'transparent',
      'outline': 'none',
      'transition': 'box-shadow 0.2s ease, border-color 0.2s ease',
      '&:hover': {
        borderColor: cssVariable('colorPrimaryHover'),
      },
      '&:focus': {
        boxShadow: componentToken.activeShadow,
        borderColor: cssVariable('colorPrimary'),
      },
      '&:disabled': {
        backgroundColor: cssVariable('colorFillDisabled'),
        borderColor: cssVariable('colorBorder'),
        cursor: 'not-allowed',
      },
      '&[aria-invalid="true"]': {
        boxShadow: componentToken.errorActiveShadow,
        borderColor: cssVariable('colorErrorActive'),
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
