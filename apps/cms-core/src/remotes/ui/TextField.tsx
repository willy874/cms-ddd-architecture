import { useState } from 'react'
import cn from 'classnames'
import { genStyleHook } from './style/genStyleHook'
import Input from './Input'

const useStyle = genStyleHook('TextField', () => {
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
      borderRadius: '4px',
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
      'padding': '8px 12px',
      'border': `1px solid #d1d5db`,
      'borderRadius': '4px',
      'outline': 'none',
      'transition': 'box-shadow 0.2s ease, border-color 0.2s ease',
      '&:focus': {
        boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)',
        borderColor: '#3b82f6',
      },
      '&[aria-invalid]': {
        borderColor: '#f87171',
        boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.5)',
      },
    },
  }
})

interface TextFieldProps extends React.ComponentProps<'div'> {
  label?: React.ReactNode
  error?: boolean
  helperText?: React.ReactNode
  prefixNode?: React.ReactNode
  suffixNode?: React.ReactNode
  inputProps?: React.ComponentProps<typeof Input>
  disabled?: boolean
  readOnly?: boolean
  type?: React.ComponentProps<typeof Input>['type']
  render?: (props: React.ComponentProps<typeof Input>) => React.ReactNode
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
  render,
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
          if (render) {
            return render(inputChildrenProps)
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
