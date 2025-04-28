import { ROOT_ROUTE, HOME_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE, FORGET_PASSWORD_ROUTE } from '@/constants/routes'
import { CoreContextPlugin, getCoreContext } from '@/libs/CoreContext'
import { Registry } from '@/libs/Registry'
import { createRootRoute, createRoute, Outlet } from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

const rootRoute = createRootRoute({
  component: () => {
    const Layout = getCoreContext().componentRegistry.get('Layout')
    return (
      <>
        <Layout>
          <Outlet />
        </Layout>
        {import.meta.env.DEV && (
          <>
            <ReactQueryDevtools buttonPosition="bottom-left" />
            <TanStackRouterDevtools position="bottom-right" />
          </>
        )}
      </>
    )
  },
})

const LoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
})

const RegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
})

const ForgetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forget-password',
})

const HomeRoute = createRoute({
  path: '/',
  getParentRoute: () => rootRoute,
  component: () => {
    const HomePage = getCoreContext().componentRegistry.get('HomePage')
    return <HomePage />
  },
})

export const routeTree = rootRoute.addChildren([
  HomeRoute,
  LoginRoute,
  RegisterRoute,
  ForgetPasswordRoute,
])

const MODULE_NAME = 'cms_core/routes'

const routes = new Registry<{
  [ROOT_ROUTE]: typeof rootRoute
  [HOME_ROUTE]: typeof HomeRoute
  [LOGIN_ROUTE]: typeof LoginRoute
  [REGISTER_ROUTE]: typeof RegisterRoute
  [FORGET_PASSWORD_ROUTE]: typeof ForgetPasswordRoute
}>()

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    context.rootRoute = rootRoute
    routes.register(ROOT_ROUTE, rootRoute)
    routes.register(HOME_ROUTE, HomeRoute)
    routes.register(LOGIN_ROUTE, LoginRoute)
    routes.register(REGISTER_ROUTE, RegisterRoute)
    context.routes = routes
    return {
      name: MODULE_NAME,
    }
  }
}

// type Path = ReturnType<typeof routes.get>['path']

declare module '@/libs/CoreContext' {
  export interface CoreContext {
    rootRoute: typeof rootRoute
    routes: typeof routes
  }
}
