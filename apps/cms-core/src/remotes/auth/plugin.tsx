import { LOGIN_ROUTE, REGISTER_ROUTE } from '@/constants/routes'
import { CoreContextPlugin } from '@/libs/CoreContext'
import { MODULE_NAME } from './constants'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import { apiCheckLogin } from './services/login'
import { StorageKey } from '@/constants/storage'

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
    return {
      name: MODULE_NAME,
      onInit: () => {
        const accessToken = context.localStorage.getItem(StorageKey.ACCESS_TOKEN)
        if (accessToken) {
          apiCheckLogin().catch(() => {
            context.localStorage.removeItem(StorageKey.ACCESS_TOKEN)
            context.localStorage.removeItem(StorageKey.REFRESH_TOKEN)
            context.localStorage.removeItem(StorageKey.TOKEN_TYPE)
            context.router.navigate({ to: LoginRoute.to })
          })
        }
      },
    }
  }
}
