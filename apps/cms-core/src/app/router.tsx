import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routes'
import { CoreContextPlugin, getCoreContext } from '@/libs/CoreContext'
import { STORE_LAYOUT_TYPE } from '@/constants/store'
import { LOGIN_ROUTE, REGISTER_ROUTE } from '@/constants/routes'

export const MODULE_NAME = 'cms_core/router'

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => {
    const NotFound = getCoreContext().componentRegistry.get('NotFound')
    return <NotFound />
  },
})

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    context.router = router

    const LoginRoute = context.routes.get(LOGIN_ROUTE)
    const RegisterRoute = context.routes.get(REGISTER_ROUTE)
    const LOGIN_PATHS = [
      LoginRoute.to,
      RegisterRoute.to,
    ] as string[]
    context.router.subscribe('onBeforeNavigate', (event) => {
      let layoutType = 'default'
      if (LOGIN_PATHS.includes(event.toLocation.pathname)) {
        layoutType = 'login'
      }
      if (layoutType === context.store.get(STORE_LAYOUT_TYPE)) {
        return
      }
      context.store.set(STORE_LAYOUT_TYPE, layoutType)
    })
    return {
      name: MODULE_NAME,
    }
  }
}

declare module '@/libs/CoreContext' {
  export interface CoreContext {
    router: typeof router
  }
}

declare module '@tanstack/react-router' {
  export interface Register {
    router: typeof router
  }
}
