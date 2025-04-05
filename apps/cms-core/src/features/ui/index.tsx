import { CoreContextPlugin } from '@/libs/CoreContext'
import NotFound from './NotFound'

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    context.componentRegistry.register('NotFound', NotFound)
  }
}
