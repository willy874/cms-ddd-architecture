import { HOME_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE } from '@/constants/routes'
import { CoreContextPlugin } from '@/libs/CoreContext'
import { MODULE_NAME } from './constants'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import { apiCheckLogin } from './services/login'
import { StorageKey } from '@/constants/storage'
import { ROUTER_INIT } from '@/constants/event'

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    const LoginRoute = context.routes.get(LOGIN_ROUTE)
    LoginRoute.update({
      component: LoginPage,
    })
    const RegisterRoute = context.routes.get(REGISTER_ROUTE)
    RegisterRoute.update({
      component: RegisterPage,
    })

    const LOGIN_PATHS = [
      LoginRoute.to,
      RegisterRoute.to,
    ] as string[]

    const channel = context.eventBus.channel(ROUTER_INIT)
    channel.subscribe(() => {
      const accessToken = context.localStorage.getItem(StorageKey.ACCESS_TOKEN)
      if (accessToken) {
        apiCheckLogin()
          .then(() => {
            if (LOGIN_PATHS.includes(context.router.state.location.href)) {
              const HomeRoute = context.routes.get(HOME_ROUTE)
              context.router.navigate({ to: HomeRoute.to })
            }
          })
          .catch(() => {
            context.localStorage.removeItem(StorageKey.ACCESS_TOKEN)
            context.localStorage.removeItem(StorageKey.REFRESH_TOKEN)
            context.localStorage.removeItem(StorageKey.TOKEN_TYPE)
            context.router.navigate({ to: LoginRoute.to })
          })
      }
    })

    return {
      name: MODULE_NAME,
    }
  }
}

declare module '@/modules/cqrs' {
  export interface CustomEventBusDict {
    [ROUTER_INIT]: () => void
  }
}
