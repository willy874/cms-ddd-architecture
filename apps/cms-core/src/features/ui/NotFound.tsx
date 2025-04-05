import cn from 'classnames'
import { genStyleHook } from '@/libs/genStyleHook'

const useStyle = genStyleHook('NotFound', () => ({
  root: {
    fontSize: '20px',
  },
}))

function NotFound() {
  const [wrap, hashId, styles] = useStyle()
  return wrap(
    <div className={cn(hashId, styles.root)}>NotFound</div>,
  )
}

export default NotFound
