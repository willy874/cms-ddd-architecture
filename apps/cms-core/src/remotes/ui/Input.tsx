import { createContext, useContext } from 'react'
import cn from 'classnames'
import { genStyleHook, InferToken } from './style/genStyleHook'

const useStyle = genStyleHook('Input',
  ({ token }) => ({
    activeShadow: `0 0 0 2px ${token.controlOutline}`,
    errorActiveShadow: `0 0 0 2px ${token.color.error.outline}`,
  }),
  ({ tokenVar, componentToken }) => ({
    root: {
      'fontSize': tokenVar.fontSize,
      'color': tokenVar.colorTextBase,
      'padding': '8px 12px',
      'borderWidth': tokenVar.lineWidth,
      'borderStyle': tokenVar.lineType,
      'borderColor': tokenVar.colorBorder,
      'borderRadius': tokenVar.borderRadiusOuter,
      'backgroundColor': 'transparent',
      'outline': 'none',
      'transition': 'box-shadow 0.2s ease, border-color 0.2s ease',
      '&:hover': {
        borderColor: tokenVar.colorPrimaryHover,
      },
      '&:focus': {
        boxShadow: componentToken.activeShadow,
        borderColor: tokenVar.colorPrimary,
      },
      '&:disabled': {
        backgroundColor: tokenVar.colorBgContainerDisabled,
        borderColor: tokenVar.colorBorder,
        cursor: 'not-allowed',
      },
      '&[aria-invalid="true"]': {
        boxShadow: componentToken.errorActiveShadow,
        borderColor: tokenVar.colorErrorActive,
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
