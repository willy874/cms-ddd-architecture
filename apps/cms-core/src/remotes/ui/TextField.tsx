import { useState } from 'react'
import cn from 'classnames'
import { genStyleHook } from './style/genStyleHook'
import Input from './Input'

const useStyle = genStyleHook('TextField',
  ({ token }) => ({
    border: `1px solid ${token.colorBorder}`,
    activeShadow: `0 0 0 4px ${token.controlOutline}`,
    errorActiveShadow: `0 0 0 4px ${token.color.error.outline}`,
  }),
  ({ componentToken, cssVariable }) => {
    return {
      root: {
        'position': 'relative',
        'marginBottom': '20px',
        '&[aria-invalid="true"]': {
          '[data-scope="container"]': {
            boxShadow: componentToken.errorActiveShadow,
            borderColor: cssVariable('colorErrorActive'),
          },
          '[data-scope="helperText"]': {
            color: cssVariable('colorErrorText'),
          },
          '[data-scope="label"]': {
            color: cssVariable('colorErrorText'),
          },
          '[data-scope="prefix"]': {
            color: cssVariable('colorErrorText'),
          },
          '[data-scope="suffix"]': {
            color: cssVariable('colorErrorText'),
          },
        },
      },
      label: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: cssVariable('fontWeightStrong'),
        color: '#4a5568',
      },
      container: {
        'display': 'flex',
        'alignItems': 'center',
        'fontSize': cssVariable('fontSize'),
        'padding': '8px 12px',
        'border': componentToken.border,
        'borderRadius': cssVariable('borderRadiusOuter'),
        '&:hover': {
          boxShadow: componentToken.errorActiveShadow,
          borderColor: cssVariable('colorPrimaryHover'),
        },
        '&:focus-within': {
          outline: 'none',
          boxShadow: componentToken.activeShadow,
          borderColor: cssVariable('colorPrimary'),
        },
      },
      prefix: {
        paddingLeft: '12px',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none',
        color: 'inherit',
      },
      suffix: {
        paddingRight: '12px',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none',
        color: 'inherit',
      },
      helperText: {
        position: 'absolute',
        left: '0',
        top: '100%',
        fontSize: cssVariable('fontSizeSm'),
        marginTop: '2px',
      },
      input: {
        'color': cssVariable('colorTextBase'),
        'width': '100%',
        'padding': '0',
        'border': 'none',
        'borderRadius': '0',
        'outline': 'none',
        'transition': 'none',
        '&:hover': {
          boxShadow: 'none',
          border: 'none',
          outline: 'none',
        },
        '&:focus': {
          boxShadow: 'none',
          border: 'none',
          outline: 'none',
        },
        '&[aria-invalid="true"]': {
          boxShadow: 'none',
          border: 'none',
          outline: 'none',
        },
      },
    }
  })

interface TextFieldProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  error?: boolean
  helperText?: React.ReactNode
  prefixNode?: React.ReactNode
  suffixNode?: React.ReactNode
  inputProps?: React.ComponentProps<typeof Input>
  disabled?: boolean
  readOnly?: boolean
  type?: React.ComponentProps<typeof Input>['type']
  children?: React.ReactNode | ((props: React.ComponentProps<typeof Input>) => React.ReactNode)
}

function TextField({
  helperText,
  error,
  prefixNode,
  suffixNode,
  children,
  className,
  inputProps,
  disabled,
  readOnly,
  type,
  ...props
}: TextFieldProps) {
  const [inputType, setInputType] = useState(type)
  const [wrap, hashId, styles] = useStyle()
  const onPasswordChange = () => {
    if (type === 'password') {
      if (inputType === 'password') {
        setInputType('text')
      }
      else {
        setInputType('password')
      }
    }
  }
  return wrap(
    <div
      className={cn(hashId, styles.root, className)}
      aria-invalid={error}
      {...props}
    >
      <div className={cn(hashId, styles.container)} data-scope="container">
        {prefixNode && (
          <div className={cn(hashId, styles.prefix)} data-scope="prefix">
            {prefixNode}
          </div>
        )}
        {(() => {
          const inputChildrenProps = {
            'type': inputType,
            'className': cn(hashId, styles.input),
            disabled,
            readOnly,
            'aria-invalid': error,
            ...inputProps,
          } satisfies React.ComponentProps<typeof Input>
          if (typeof children === 'function') {
            return children(inputChildrenProps)
          }
          if (children) {
            return (
              <Input.InputContext.Provider value={inputChildrenProps}>
                {children}
              </Input.InputContext.Provider>
            )
          }
          return (<Input {...inputChildrenProps} />)
        })()}
        {suffixNode && (
          <div
            onClick={onPasswordChange}
            className={cn(hashId, styles.suffix)}
            data-scope="suffix"
          >
            {suffixNode}
          </div>
        )}
      </div>
      {helperText && (
        <span className={cn(hashId, styles.helperText)} data-scope="helperText">
          {helperText}
        </span>
      )}
    </div>,
  )
}

export default TextField

declare module '@/modules/core' {
  export interface CustomComponentDict {
    TextField: typeof TextField
  }
}
