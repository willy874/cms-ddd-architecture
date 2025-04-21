import cn from 'classnames'
import { genStyleHook } from './style/genStyleHook'
import Spin from './Spin'

const ButtonClassNames = {
  // variant
  VARIANT_OUTLINE: 'button__variant--outline',
  VARIANT_TEXT: 'button__variant--text',
  VARIANT_LINK: 'button__variant--link',
  VARIANT_FILLED: 'button__variant--filled',
  // theme
  THEME_DEFAULT: 'button__theme--default',
  THEME_PRIMARY: 'button__theme--primary',
  THEME_ERROR: 'button__theme--error',
  THEME_WARNING: 'button__theme--warning',
  THEME_SUCCESS: 'button__theme--success',
  THEME_INFO: 'button__theme--info',
  // size
  SIZE_LARGE: 'button__size--large',
  SIZE_MIDDLE: 'button__size--middle',
  SIZE_SMALL: 'button__size--small',
  // shape
  SHAPE_ROUND: 'button__shape--round',
  SHAPE_CIRCLE: 'button__shape-circle',
  SHAPE_NONE: 'button__shape--none',
  SHAPE_PILL: 'button__shape--pill',
}

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
      'backgroundColor': componentToken.mainColor,
      'borderWidth': cssVariable('lineWidth'),
      'borderStyle': cssVariable('lineType'),
      'borderColor': componentToken.mainColor,
      'borderRadius': componentToken.borderRadius,
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
        color: cssVariable('colorTextDisabled'),
        borderColor: componentToken.disabledColor,
        backgroundColor: componentToken.disabledColor,
        cursor: 'not-allowed',
        pointerEvents: 'none',
      },
      [`&.${ButtonClassNames.THEME_PRIMARY}`]: {
        [componentTokenName.mainColor]: cssVariable('colorPrimary'),
        [componentTokenName.hoverColor]: cssVariable('colorPrimaryHover'),
        [componentTokenName.activeColor]: cssVariable('colorPrimaryActive'),
      },
      [`&.${ButtonClassNames.THEME_ERROR}`]: {
        [componentTokenName.mainColor]: cssVariable('colorError'),
        [componentTokenName.hoverColor]: cssVariable('colorErrorHover'),
        [componentTokenName.activeColor]: cssVariable('colorErrorActive'),
      },
      [`&.${ButtonClassNames.THEME_WARNING}`]: {
        [componentTokenName.mainColor]: cssVariable('colorWarning'),
        [componentTokenName.hoverColor]: cssVariable('colorWarningHover'),
        [componentTokenName.activeColor]: cssVariable('colorWarningActive'),
      },
      [`&.${ButtonClassNames.THEME_SUCCESS}`]: {
        [componentTokenName.mainColor]: cssVariable('colorSuccess'),
        [componentTokenName.hoverColor]: cssVariable('colorSuccessHover'),
        [componentTokenName.activeColor]: cssVariable('colorSuccessActive'),
      },
      [`&.${ButtonClassNames.THEME_INFO}`]: {
        [componentTokenName.mainColor]: cssVariable('colorInfo'),
        [componentTokenName.hoverColor]: cssVariable('colorInfoHover'),
        [componentTokenName.activeColor]: cssVariable('colorInfoActive'),
      },
      [`&.${ButtonClassNames.SIZE_SMALL}`]: {
        [componentTokenName.fontSize]: cssVariable('fontSizeSm'),
        [componentTokenName.padding]: '4px 8px',
        [componentTokenName.gap]: '4px',
      },
      [`&.${ButtonClassNames.SIZE_LARGE}`]: {
        [componentTokenName.fontSize]: cssVariable('fontSizeLg'),
        [componentTokenName.padding]: '6px 24px',
        [componentTokenName.gap]: '12px',
      },
      [`&.${ButtonClassNames.VARIANT_FILLED}.${ButtonClassNames.THEME_DEFAULT}`]: {
        [componentTokenName.mainColor]: cssVariable('colorFillDefault'),
      },
      [`&.${ButtonClassNames.VARIANT_OUTLINE}`]: {
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
          borderColor: cssVariable('colorTextDisabled'),
          color: cssVariable('colorTextDisabled'),
        },
        '&:focus': {
          boxShadow: componentToken.activeShadow,
        },
      },
      [`&.${ButtonClassNames.VARIANT_TEXT}`]: {
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
      [`&.${ButtonClassNames.SHAPE_CIRCLE}`]: {
        [componentTokenName.borderRadius]: '50%',
        [componentTokenName.padding]: '0',
        [`&.${ButtonClassNames.SIZE_SMALL}`]: {
          width: '32px',
          height: '32px',
        },
        [`&.${ButtonClassNames.SIZE_MIDDLE}`]: {
          width: '40px',
          height: '40px',
        },
        [`&.${ButtonClassNames.SIZE_LARGE}`]: {
          width: '48px',
          height: '48px',
        },
      },
      [`&.${ButtonClassNames.SHAPE_NONE}`]: {
        [componentTokenName.borderRadius]: '0',
      },
      [`&.${ButtonClassNames.SHAPE_PILL}`]: {
        [componentTokenName.borderRadius]: '9999px',
      },
    },
  }))

interface ButtonProps extends React.ComponentProps<'button'> {
  loading?: boolean
  icon?: boolean
  variant?: 'filled' | 'outlined' | 'text' | 'link'
  size?: 'large' | 'middle' | 'small'
  theme?: 'default' | 'primary' | 'error' | 'warning' | 'success' | 'info'
  shape?: 'round' | 'circle' | 'pill' | 'none'
}

function Button({ loading, className, children, variant = 'filled', theme = 'primary', size = 'middle', shape = 'round', ...props }: ButtonProps) {
  const [wrap, hashId, styles] = useStyle()
  return wrap(
    <button
      {...props}
      className={cn(hashId, styles.root, className, {
        [ButtonClassNames.VARIANT_OUTLINE]: variant === 'outlined',
        [ButtonClassNames.VARIANT_TEXT]: variant === 'text',
        [ButtonClassNames.VARIANT_LINK]: variant === 'link',
        [ButtonClassNames.VARIANT_FILLED]: variant === 'filled',
        [ButtonClassNames.THEME_DEFAULT]: theme === 'default',
        [ButtonClassNames.THEME_PRIMARY]: theme === 'primary',
        [ButtonClassNames.THEME_ERROR]: theme === 'error',
        [ButtonClassNames.THEME_WARNING]: theme === 'warning',
        [ButtonClassNames.THEME_SUCCESS]: theme === 'success',
        [ButtonClassNames.THEME_INFO]: theme === 'info',
        [ButtonClassNames.SIZE_LARGE]: size === 'large',
        [ButtonClassNames.SIZE_MIDDLE]: size === 'middle',
        [ButtonClassNames.SIZE_SMALL]: size === 'small',
        [ButtonClassNames.SHAPE_ROUND]: shape === 'round',
        [ButtonClassNames.SHAPE_CIRCLE]: shape === 'circle',
        [ButtonClassNames.SHAPE_NONE]: shape === 'none',
        [ButtonClassNames.SHAPE_PILL]: shape === 'pill',
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
