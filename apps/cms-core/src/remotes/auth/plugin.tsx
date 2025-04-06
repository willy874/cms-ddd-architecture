import { CoreContextPlugin } from '@/libs/CoreContext'
import { MODULE_NAME } from './constants'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import { LOGIN_ROUTE, REGISTER_ROUTE } from '@/constants/routes'

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
    }
  }
}
