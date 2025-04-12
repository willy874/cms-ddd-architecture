import { useState } from 'react'
import cn from 'classnames'
import { UseFormRegisterReturn } from 'react-hook-form'
import { genStyleHook } from '@/libs/hooks/genStyleHook'
import Input from './Input'

const useStyle = genStyleHook('TextField', () => ({
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
}))

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
        {children
          ? (
              <Input.InputContext.Provider value={{ error, disabled, readOnly, inputType }}>
                {children}
              </Input.InputContext.Provider>
            )
          : (
              <Input
                type={inputType}
                className="width:100%"
                disabled={disabled}
                readOnly={readOnly}
                aria-invalid={error}
                {...inputProps}
              />
            )}
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

TextField.reactHookFormRegisterResolver = function (params: UseFormRegisterReturn): TextFieldProps {
  const { disabled, ref, ...props } = params
  return {
    ref,
    disabled,
    inputProps: props,
  }
}

export default TextField

declare module '@/modules/core' {
  export interface CustomComponentDict {
    TextField: typeof TextField
  }
}
