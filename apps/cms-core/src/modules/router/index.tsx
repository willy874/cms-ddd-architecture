import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
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
      <>
        <Layout>
          <Outlet />
        </Layout>
        <TanStackRouterDevtools />
      </>
    )
  },
})

const routeTree = rootRoute.addChildren([
  createRoute({
    path: '/',
    getParentRoute: () => rootRoute,
    component: () => {
      const HomePage = getCoreContext().componentRegistry.get('HomePage')
      return <HomePage />
    },
  }),
])

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => {
    console.log('Rendering Not Found Page', router)

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
