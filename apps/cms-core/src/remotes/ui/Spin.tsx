import cn from 'classnames'
import { genStyleHook } from './style/genStyleHook'

const useStyle = genStyleHook('Spin', () => ({
  'root': {
    display: 'inline-block',
    width: '1em',
    height: '1em',
    border: '2px solid currentColor',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
  },
  '@keyframes spin': {
    to: { transform: 'rotate(360deg)' },
  },
}))

function Spin({ className, ...props }: React.ComponentProps<'span'>) {
  const [wrap, hashId, styles] = useStyle()

  return wrap(
    <span {...props} className={cn(hashId, styles.root, className)} />,
  )
}

export default Spin

declare module '@/modules/core' {
  export interface CustomComponentDict {
    Spin: typeof Spin
  }
}
