import cn from 'classnames'
import { genStyleHook } from './style/genStyleHook'
import Spin from './Spin'

const useStyle = genStyleHook('Button',
  ({ token }) => ({
    borderRadius: '6px',
    activeShadow: `0 0 0 2px ${token.controlOutline}`,
  }),
  ({ cssVariable, componentToken }) => ({
    root: {
      'position': 'relative',
      'fontSize': cssVariable('fontSize'),
      'color': cssVariable('colorTextBase'),
      'display': 'inline-flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'gap': '8px',
      'padding': '8px 16px',
      'borderRadius': componentToken.borderRadius,
      'backgroundColor': cssVariable('colorPrimary'),
      'borderWidth': cssVariable('lineWidth'),
      'borderStyle': cssVariable('lineType'),
      'borderColor': cssVariable('colorPrimary'),
      'cursor': 'pointer',
      'transition': 'background-color 0.3s ease, border-color 0.2s ease',
      'userSelect': 'none',
      'touchAction': 'manipulation',
      'backgroundImage': 'none',
      'outline': 'none',
      '&:hover': {
        borderColor: cssVariable('colorPrimaryHover'),
        backgroundColor: cssVariable('colorPrimaryHover'),
      },
      '&:focus': {
        boxShadow: componentToken.activeShadow,
      },
      '&:active': {
        borderColor: cssVariable('colorPrimaryActive'),
        backgroundColor: cssVariable('colorPrimaryActive'),
      },
    },
  }))

interface ButtonProps extends React.ComponentProps<'button'> {
  loading?: boolean
}

function Button({ loading, className, children, ...props }: ButtonProps) {
  const [wrap, hashId, styles] = useStyle()
  return wrap(
    <button
      {...props}
      className={cn(hashId, styles.root, className)}
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
