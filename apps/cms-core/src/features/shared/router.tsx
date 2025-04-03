import { ADD_ROUTES } from '@/constants/command'
import { CoreContextPlugin } from '@/libs/CoreContext'
import { createRootRoute, createRouter, Outlet, RootRoute } from '@tanstack/react-router'

export function contextRouterPlugin(): CoreContextPlugin {
  return (context) => {
    const rootRoute = createRootRoute({
      component: () => <Outlet />,
    })
    const router = createRouter({
      routeTree: rootRoute,
      defaultNotFoundComponent: () => {
        const NotFound = context.componentRegistry.get('NotFound')
        return <NotFound />
      },
    })

    router.subscribe('onBeforeNavigate', (data) => {
      console.log('onBeforeNavigate', data)
    })
    context.commandBus.provide(ADD_ROUTES, async (handler) => {
      await handler(rootRoute)
      await Promise.resolve()
      router.buildRouteTree()
    })
    context.router = router
    context.rootRoute = rootRoute
  }
}

declare module '@/core/PortalContext' {
  export interface CustomCommandBusDict {
    [ADD_ROUTES]: (handler: (route: RootRoute) => any) => Promise<void>
  }
}
