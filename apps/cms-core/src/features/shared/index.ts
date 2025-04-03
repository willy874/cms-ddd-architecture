import { CoreContextPlugin } from '@/libs/CoreContext'
import { contextHttpPlugin } from './http'
import { contextRouterPlugin } from './router'

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    context
      .use(contextRouterPlugin())
      .use(contextHttpPlugin())
  }
}
