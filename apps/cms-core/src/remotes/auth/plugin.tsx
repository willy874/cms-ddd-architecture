import { CoreContextPlugin } from '@/libs/CoreContext'
import { MODULE_NAME } from './constants'

export function contextPlugin(): CoreContextPlugin {
  return () => {
    return {
      name: MODULE_NAME,
    }
  }
}
