import { createRootRoute, createRouter, Outlet } from '@tanstack/react-router'
import { CoreContextPlugin, getCoreContext } from '@/libs/CoreContext'
import { Registry } from '@/libs/Registry'

export const MODULE_NAME = 'cms_core/router'

interface CustomRouteDict {}

type RouteDict = {
  [K in keyof CustomRouteDict]: CustomRouteDict[K]
}

const rootRoute = createRootRoute({
  component: () => {
    const Layout = getCoreContext().componentRegistry.get('Layout')
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
    const NotFound = getCoreContext().componentRegistry.get('NotFound')
    return <NotFound />
  },
})

const routes = new Registry<RouteDict>()

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    context.router = router
    context.rootRoute = rootRoute
    context.routes = routes
    return {
      name: MODULE_NAME,
    }
  }
}

declare module '@/libs/CoreContext' {
  export interface CoreContext {
    router: typeof router
    rootRoute: typeof rootRoute
    routes: typeof routes
  }
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
