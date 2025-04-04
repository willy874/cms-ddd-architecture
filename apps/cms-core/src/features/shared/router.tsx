import { createRootRoute, createRouter, Outlet } from '@tanstack/react-router'
import { CoreContextPlugin } from '@/libs/CoreContext'
import { getPortalContext } from '@/core/PortalContext'

const rootRoute = createRootRoute({
  component: () => {
    const Layout = getPortalContext().componentRegistry.get('Layout')
    return (
      <Layout>
        <Outlet />
      </Layout>
    )
  },
})

const router = createRouter({
  routeTree: rootRoute,
  defaultNotFoundComponent: () => {
    const NotFound = getPortalContext().componentRegistry.get('NotFound')
    return <NotFound />
  },
})

export function contextRouterPlugin(): CoreContextPlugin {
  return (context) => {
    context.router = router
    context.rootRoute = rootRoute
  }
}

declare module '@/libs/CoreContext' {
  export interface CoreContext {
    router: typeof router
    rootRoute: typeof rootRoute
  }
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
