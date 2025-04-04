import { createRoute } from '@tanstack/react-router'
import { CoreContextPlugin } from '@/libs/CoreContext'
import { getPortalContext } from '@/core/PortalContext'
import Layout from './Layout'

const LayoutRoute = createRoute({
  getParentRoute: () => getPortalContext().rootRoute,
  path: '/',
  component: Layout,
})

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    context.routes.register('layout', LayoutRoute)
    context.rootRoute.addChildren([LayoutRoute])
  }
}

declare module '@/core/PortalContext' {
  export interface CustomRouteDict {
    layout: typeof LayoutRoute
  }
}
