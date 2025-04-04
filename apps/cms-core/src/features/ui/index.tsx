import { CoreContextPlugin } from '@/libs/CoreContext'

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    context.componentRegistry.register('NotFound', () => <div>NotFound</div>)
  }
}
