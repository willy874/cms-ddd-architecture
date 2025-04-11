import { getCoreContext } from '../CoreContext/core'
import { CustomComponentDict } from '@/modules/core'

type InferProps<T> = T extends (props: infer P) => any ? P : never

export const NotFound: React.FC<InferProps<CustomComponentDict['NotFound']>> = () => {
  const Component = getCoreContext().componentRegistry.get('NotFound')
  return <Component />
}
