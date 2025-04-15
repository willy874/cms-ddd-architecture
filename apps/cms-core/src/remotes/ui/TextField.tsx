import { useState } from 'react'
import cn from 'classnames'
import { genStyleHook } from './style/genStyleHook'
import Input from './Input'

const useStyle = genStyleHook('TextField',
  ({ token }) => ({
    borderColor: token.colorBorder,
    borderRadius: token.borderRadiusOuter,
    fontSize: token.fontSize,
    paddingBlock: '4px',
    paddingInline: '11px',
    paddingBlockSm: '0px',
    paddingInlineSm: '7px',
    paddingBlockLg: '7px',
    paddingInlineLg: '11px',
    addonBg: token.colorFill.disabled,
    activeBorderColor: token.colorPrimary,
    hoverBorderColor: token.color.primary.hover,
    activeShadow: `0 0 0 2px ${token.controlOutline}`,
    errorActiveShadow: token.color.error.outline,
    warningActiveShadow: token.color.warning.outline,
    hoverBg: token.colorBgBase,
    activeBg: token.colorBgBase,
  }),
  ({ componentToken }) => {
    return {
      root: {
        marginBottom: '16px',
      },
      label: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: 'medium',
        color: '#4a5568',
      },
      container: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        fontSize: componentToken.fontSize,
        padding: '8px 12px',
        border: `1px solid ${componentToken.borderColor}`,
        borderRadius: componentToken.borderRadius,
      },
      prefix: {
        position: 'absolute',
        left: '0',
        paddingLeft: '12px',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none',
        color: '#a0aec0',
      },
      suffix: {
        position: 'absolute',
        right: '0',
        paddingRight: '12px',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none',
        color: '#a0aec0',
      },
      helperText: {
        fontSize: '12px',
        marginTop: '4px',
        color: '#718096',
      },
      input: {
        'width': '100%',
        'padding': '0',
        'border': 'none',
        'borderRadius': '0',
        'outline': 'none',
        'transition': 'none',
        '&:focus': {
          boxShadow: 'none',
          border: 'none',
          outline: 'none',
        },
        '&[aria-invalid]': {
          boxShadow: 'none',
          border: 'none',
          outline: 'none',
          color: componentToken.errorActiveShadow,
        },
      },
    }
  })

interface TextFieldProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  label?: React.ReactNode
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
  label,
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
    <div className={cn(hashId, styles.root, className)} {...props}>
      {label && (
        <label className={cn(
          hashId,
          styles.label,
          {
            'color:red-500': error,
            'color:gray-500': !error,
          },
        )}
        >
          {label}
        </label>
      )}
      <div className={cn(
        hashId,
        styles.container,
        {
          'ring:2px|red-500': error,
        },
      )}
      >
        {prefixNode && (
          <div className={cn(hashId, styles.prefix)}>{prefixNode}</div>
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
            className={
              cn(hashId, styles.suffix, {
                'cursor:pointer': type === 'password',
              })
            }
          >
            {suffixNode}
          </div>
        )}
      </div>
      {helperText && (
        <span className={cn(
          hashId,
          styles.helperText,
          {
            'color:red-500': error,
            'color:gray-500': !error,
          },
        )}
        >
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
