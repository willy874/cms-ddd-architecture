import cn from 'classnames'
import { genStyleHook } from '@/libs/hooks/genStyleHook'
import Spin from './Spin'

const useStyle = genStyleHook('Button', () => ({
  root: {
    display: 'inline-block',
    padding: '8px 16px',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
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
