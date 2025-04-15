import { createContext, useContext } from 'react'
import cn from 'classnames'
import { genStyleHook, InferToken } from './style/genStyleHook'

const useStyle = genStyleHook('Input',
  ({ token }) => ({
    paddingBlock: '4px',
    paddingInline: '11px',
    paddingBlockSm: '0px',
    paddingInlineSm: '7px',
    paddingBlockLg: '7px',
    paddingInlineLg: '11px',
    addonBg: token.colorFillQuaternary,
    borderColor: token.colorBorder,
    borderRadius: token.borderRadiusOuter,
    activeBorderColor: token.colorPrimary,
    hoverBorderColor: token.color.primary.hover,
    activeShadow: `0 0 0 2px ${token.controlOutline}`,
    errorActiveShadow: token.color.error.outline,
    warningActiveShadow: token.color.warning.outline,
    hoverBg: token.colorBgBase,
    activeBg: token.colorBgBase,
    inputFontSize: token.fontSize,
    inputFontSizeLg: token.controlInteractiveSize,
    inputFontSizeSm: token.fontSize,
  }),
  ({ componentToken }) => ({
    root: {
      'padding': '8px 12px',
      'border': `1px solid ${componentToken.borderColor}`,
      'borderRadius': componentToken.borderRadius,
      'outline': 'none',
      'transition': 'box-shadow 0.2s ease, border-color 0.2s ease',
      '&:focus': {
        boxShadow: componentToken.activeShadow,
        borderColor: componentToken.activeBorderColor,
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
