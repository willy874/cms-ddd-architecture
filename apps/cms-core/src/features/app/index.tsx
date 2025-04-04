import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRoute } from '@tanstack/react-router'
import { CoreContextPlugin } from '@/libs/CoreContext'
import { getPortalContext } from '@/core/PortalContext'
import App from './App'

const AppRoute = createRoute({
  getParentRoute: () => getPortalContext().rootRoute,
  path: '/',
  component: App,
})

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    context.routes.register('app', AppRoute)
    context.rootRoute.addChildren([AppRoute])
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
    app: typeof AppRoute
  }
}
