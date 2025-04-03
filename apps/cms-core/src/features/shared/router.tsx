import { FC } from 'react'
import { createRootRoute, createRouter, Outlet } from '@tanstack/react-router'
import { CoreContextPlugin } from '@/libs/CoreContext'

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

let NotFound: FC
const router = createRouter({
  routeTree: rootRoute,
  defaultNotFoundComponent: () => <NotFound />,
})

export function contextRouterPlugin(): CoreContextPlugin {
  return (context) => {
    context.componentRegistry.subscribe(() => {
      NotFound = context.componentRegistry.get('NotFound')
    }, {
      immediate: true,
    })
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
