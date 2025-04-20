import cn from 'classnames'
import { genStyleHook } from './style/genStyleHook'
import Spin from './Spin'

const useStyle = genStyleHook('Button',
  ({ token }) => ({
    borderRadius: '6px',
    activeShadow: `0 0 0 2px ${token.controlOutline}`,
    baseColor: token.colorTextBase,
    mainColor: token.colorPrimary,
    hoverColor: token.color.primary.hover,
    activeColor: token.color.primary.hover,
    disabledColor: token.colorTextDisabled,
    outlineColor: token.colorBorder,
    fontSize: token.fontSize,
    gap: '8px',
    padding: '8px 16px',
  }),
  ({ cssVariable, componentToken, componentTokenName }) => ({
    root: {
      'position': 'relative',
      'fontSize': componentToken.fontSize,
      'color': componentToken.baseColor,
      'display': 'inline-flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'gap': componentToken.gap,
      'padding': componentToken.padding,
      'borderRadius': componentToken.borderRadius,
      'backgroundColor': componentToken.mainColor,
      'borderWidth': cssVariable('lineWidth'),
      'borderStyle': cssVariable('lineType'),
      'borderColor': componentToken.mainColor,
      'cursor': 'pointer',
      'transition': 'background-color 0.3s ease, border-color 0.2s ease',
      'userSelect': 'none',
      'touchAction': 'manipulation',
      'backgroundImage': 'none',
      'outline': 'none',
      '&:hover': {
        borderColor: componentToken.hoverColor,
        backgroundColor: componentToken.hoverColor,
      },
      '&:focus': {
        boxShadow: componentToken.activeShadow,
      },
      '&:active': {
        borderColor: componentToken.activeColor,
        backgroundColor: componentToken.activeColor,
      },
      '&:disabled': {
        color: componentToken.disabledColor,
        borderColor: componentToken.outlineColor,
        backgroundColor: componentToken.outlineColor,
        cursor: 'not-allowed',
        pointerEvents: 'none',
      },
      '&.outline-btn': {
        'backgroundColor': 'transparent',
        'color': componentToken.mainColor,
        'borderColor': componentToken.mainColor,
        '&:hover': {
          backgroundColor: componentToken.hoverColor,
          borderColor: componentToken.hoverColor,
          color: componentToken.baseColor,
        },
        '&:active': {
          backgroundColor: componentToken.activeColor,
          borderColor: componentToken.activeColor,
          color: componentToken.baseColor,
        },
        '&:disabled': {
          backgroundColor: componentToken.disabledColor,
          borderColor: componentToken.outlineColor,
          color: componentToken.outlineColor,
        },
        '&:focus': {
          boxShadow: componentToken.activeShadow,
        },
      },
      '&.error-btn': {
        [componentTokenName.mainColor]: cssVariable('colorError'),
        [componentTokenName.hoverColor]: cssVariable('colorErrorHover'),
        [componentTokenName.activeColor]: cssVariable('colorErrorActive'),
      },
      '&.warning-btn': {
        [componentTokenName.mainColor]: cssVariable('colorWarning'),
        [componentTokenName.hoverColor]: cssVariable('colorWarningHover'),
        [componentTokenName.activeColor]: cssVariable('colorWarningActive'),
      },
      '&.success-btn': {
        [componentTokenName.mainColor]: cssVariable('colorSuccess'),
        [componentTokenName.hoverColor]: cssVariable('colorSuccessHover'),
        [componentTokenName.activeColor]: cssVariable('colorSuccessActive'),
      },
      '&.info-btn': {
        [componentTokenName.mainColor]: cssVariable('colorInfo'),
        [componentTokenName.hoverColor]: cssVariable('colorInfoHover'),
        [componentTokenName.activeColor]: cssVariable('colorInfoActive'),
      },
      '&.small-btn': {
        [componentTokenName.fontSize]: cssVariable('fontSizeSm'),
        [componentTokenName.padding]: '4px 8px',
        [componentTokenName.gap]: '4px',
      },
      '&.large-btn': {
        [componentTokenName.fontSize]: cssVariable('fontSizeLg'),
        [componentTokenName.padding]: '12px 24px',
        [componentTokenName.gap]: '12px',
      },
      '&.icon-btn': {
        [componentTokenName.fontSize]: cssVariable('fontSize'),
        [componentTokenName.padding]: '4px',
      },
      '&.icon-btn.small-btn': {
        [componentTokenName.fontSize]: cssVariable('fontSizeIcon'),
        [componentTokenName.padding]: '2px',
      },
      '&.icon-btn.large-btn': {
        [componentTokenName.fontSize]: cssVariable('fontSizeLg'),
        [componentTokenName.padding]: '8px',
      },
    },
  }))

interface ButtonProps extends React.ComponentProps<'button'> {
  loading?: boolean
  icon?: boolean
  outline?: boolean
  size?: 'large' | 'middle' | 'small'
  theme?: 'default' | 'error' | 'warning' | 'success' | 'info'
}

function Button({ loading, className, children, icon, outline, theme, size, ...props }: ButtonProps) {
  const [wrap, hashId, styles] = useStyle()
  return wrap(
    <button
      {...props}
      className={cn(hashId, styles.root, className, {
        'icon-btn': icon,
        'outline-btn': outline,
        'error-btn': theme === 'error',
        'warning-btn': theme === 'warning',
        'success-btn': theme === 'success',
        'info-btn': theme === 'info',
        'large-btn': size === 'large',
        'small-btn': size === 'small',
      })}
    >
      {loading ? <Spin /> : children}
    </button>,
  )
}

export default Button

declare module '@/modules/core' {
  export interface CustomComponentDict {
    Button: typeof Button
  }
}
