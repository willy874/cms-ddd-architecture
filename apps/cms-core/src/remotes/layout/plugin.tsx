import { CoreContextPlugin } from '@/libs/CoreContext'
import Layout from './Layout'

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    context.componentRegistry.register('Layout', Layout)
  }
}

declare module '@/core/custom' {
  export interface CustomComponentDict {
    Layout: (props: { children: React.ReactNode }) => React.ReactNode
  }
}
