import { ADD_ROUTES } from '@/constants/command'
import { CustomCommandBusDict } from '@/core/PortalContext'
import { BaseCommand } from '@/libs/CommandBus'
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

export class AddRouteCommand extends BaseCommand<typeof ADD_ROUTES, Parameters<CustomCommandBusDict['ADD_ROUTES']>> {
  constructor(handler: (route: RootRoute) => any) {
    super(ADD_ROUTES, handler)
  }
}

declare module '@/core/PortalContext' {
  export interface CustomCommandBusDict {
    [ADD_ROUTES]: (handler: (route: RootRoute) => any) => Promise<void>
  }
}
