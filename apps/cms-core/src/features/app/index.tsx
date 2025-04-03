import { lazy, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createRoute, RouterProvider } from '@tanstack/react-router'
import { CoreContextPlugin } from '@/libs/CoreContext'
import { AddRouteCommand } from '@/core/commands'

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    return {
      async init() {
        await context.commandBus.command(new AddRouteCommand((route) => {
          route.addChildren([
            createRoute({
              getParentRoute: () => route,
              path: '/',
              component: lazy(() => import('./App.tsx')),
            }),
          ])
        }))
        createRoot(document.getElementById('root')!).render(
          <StrictMode>
            <RouterProvider router={context.router} />
          </StrictMode>,
        )
      },
    }
  }
}
