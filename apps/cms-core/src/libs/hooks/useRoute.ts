import { CoreContext, useCoreContext } from '@/libs/CoreContext'
import { Registry } from '../Registry'

type InferRegistryDict<T> = T extends Registry<infer Dict> ? Dict : never

type RoutesRegistryDict = InferRegistryDict<CoreContext['routes']>

export function useRoute<T extends keyof RoutesRegistryDict>(routeName: T): RoutesRegistryDict[T] {
  return useCoreContext().routes.get(routeName)
}
