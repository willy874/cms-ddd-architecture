import cn from 'classnames'
import { genStyleHook } from '@/remotes/ui/genStyleHook'

const useStyle = genStyleHook('NotFound', () => ({
  root: {
    fontSize: '20px',
  },
}))

function NotFound({ className, ...props }: React.ComponentProps<'div'>) {
  const [wrap, hashId, styles] = useStyle()
  return wrap(
    <div {...props} className={cn(hashId, styles.root, className)}>NotFound</div>,
  )
}

export default NotFound

declare module '@/modules/core' {
  export interface CustomComponentDict {
    NotFound: typeof NotFound
  }
}
