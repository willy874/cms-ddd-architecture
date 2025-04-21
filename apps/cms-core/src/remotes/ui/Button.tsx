import cn from 'classnames'
import { genStyleHook } from './style/genStyleHook'
import Spin from './Spin'

const useStyle = genStyleHook('Button',
  ({ cssVariable }) => ({
    borderRadius: '6px',
    activeShadow: `0 0 2px 3px ${cssVariable('controlOutline')}`,
    baseColor: cssVariable('colorTextBase'),
    mainColor: cssVariable('colorTextBase'),
    hoverColor: cssVariable('colorFillSecondary'),
    activeColor: cssVariable('colorFillTertiary'),
    disabledColor: cssVariable('colorFillQuaternary'),
    outlineColor: cssVariable('colorBorder'),
    fontSize: cssVariable('fontSize'),
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
      '&.primary-btn': {
        [componentTokenName.mainColor]: cssVariable('colorPrimary'),
        [componentTokenName.hoverColor]: cssVariable('colorPrimaryHover'),
        [componentTokenName.activeColor]: cssVariable('colorPrimaryActive'),
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
      '&.filled-btn.default-btn': {
        [componentTokenName.mainColor]: cssVariable('colorFillDefault'),
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
      '&.text-btn': {
        'backgroundColor': 'transparent',
        'color': componentToken.mainColor,
        'borderWidth': '0',
        'borderColor': 'transparent',
        'padding': '4px',
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
      },
    },
  }))

interface ButtonProps extends React.ComponentProps<'button'> {
  loading?: boolean
  icon?: boolean
  variant?: 'filled' | 'outlined' | 'text' | 'link'
  size?: 'large' | 'middle' | 'small'
  theme?: 'default' | 'primary' | 'error' | 'warning' | 'success' | 'info'
}

function Button({ loading, className, children, variant = 'filled', theme = 'default', size = 'middle', ...props }: ButtonProps) {
  const [wrap, hashId, styles] = useStyle()
  return wrap(
    <button
      {...props}
      className={cn(hashId, styles.root, className, {
        'outline-btn': variant === 'outlined',
        'text-btn': variant === 'text',
        'link-btn': variant === 'link',
        'filled-btn': variant === 'filled',
        'default-btn': theme === 'default',
        'primary-btn': theme === 'primary',
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
