import { lazy, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRoute } from '@tanstack/react-router'
import { CoreContext, CoreContextPlugin } from '@/libs/CoreContext'

let rootRoute: CoreContext['rootRoute']

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: lazy(() => import('./App.tsx')),
})

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    rootRoute = context.rootRoute
    context.routes.register('app', appRoute)
    context.rootRoute.addChildren([appRoute])
    return {
      init() {
        context.router.buildRouteTree()
        createRoot(document.getElementById('root')!).render(
          <StrictMode>
            <RouterProvider router={context.router} />
          </StrictMode>,
        )
      },
    }
  }
}

declare module '@/core/PortalContext' {
  export interface CustomRouteDict {
    app: typeof appRoute
  }
}
