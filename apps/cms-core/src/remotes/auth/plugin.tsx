import { STORE_LAYOUT_TYPE } from '@/constants/store'
import { CoreContextPlugin } from '@/libs/CoreContext'
import { MODULE_NAME } from './constants'
import { LoginRoute } from './pages/login'
import { RegisterRoute } from './pages/register'

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    context.rootRoute.addChildren([
      ...context.router.routeTree.children || [],
      LoginRoute,
      RegisterRoute,
    ])
    context.router.subscribe('onBeforeNavigate', (event) => {
      if (event.toLocation.pathname === LoginRoute.fullPath) {
        context.store.set(STORE_LAYOUT_TYPE, '')
      }
    })
    return {
      name: MODULE_NAME,
    }
  }
}
