import { lazy, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createFileRoute, RouterProvider } from '@tanstack/react-router'
import { CoreContext, CoreContextPlugin } from '@/libs/CoreContext'

const appRoute = createFileRoute('/')({
  component: lazy(() => import('./App.tsx')),
})

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
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

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: 'app'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof appRoute
      parentRoute: CoreContext['rootRoute']
    }
  }
}

declare module '@/core/PortalContext' {
  export interface CustomRouteDict {
    app: typeof appRoute
  }
}
