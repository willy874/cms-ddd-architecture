import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getCoreContext } from '@/libs/CoreContext'
import { StorageKey } from '@/constants/storage'
import { HOME_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE } from '@/constants/routes'
import { apiLogin } from '../resources/login'
import { Form, Button, TextField, Input } from '@/libs/components'
import { useTranslate } from '@/libs/locale'

const LoginFormSchema = z.object({
  username: z.string(),
  password: z.string(),
})

function useLoginForm() {
  const t = useTranslate()
  const schema = z.object({
    username: LoginFormSchema.shape.username.nonempty(t('auth__username-error-message--required')),
    password: LoginFormSchema.shape.password.nonempty(t('auth__password-error-message--required')),
  })
  return useForm({
    resolver: zodResolver(schema),
  })
}

function LoginPage() {
  const ctx = getCoreContext()
  const t = useTranslate()
  const CurrentRoute = ctx.routes.get(LOGIN_ROUTE)
  const HomeRoute = ctx.routes.get(HOME_ROUTE)
  const RegisterRoute = ctx.routes.get(REGISTER_ROUTE)
  const navigate = CurrentRoute.useNavigate()
  const { register, handleSubmit, formState } = useLoginForm()
  const { mutateAsync: onFinish, isPending } = useMutation({
    mutationFn: apiLogin,
    onSuccess: (data) => {
      ctx.localStorage.setItem(StorageKey.ACCESS_TOKEN, data.accessToken)
      ctx.localStorage.setItem(StorageKey.REFRESH_TOKEN, data.refreshToken)
      ctx.localStorage.setItem(StorageKey.TOKEN_TYPE, data.tokenType)
      navigate({ to: HomeRoute.to })
    },
  })
  const onSubmit = handleSubmit((data) => onFinish(data))
  return (
    <div className="display:flex flex-direction:column gap:32px padding:24px max-w:320px margin-inline:auto">
      <h2 className="text:24px font:semibold color:gray-800 text-align:center">
        {t('auth__login-page--page-title')}
      </h2>

      <Form onSubmit={onSubmit} className="display:flex flex-direction:column gap:16px">
        <div className="display:flex flex-direction:column gap:16px">

          <div className="display:flex flex-direction:column gap:4px">
            <TextField
              helperText={formState.errors.username?.message}
            >
              <Input {...register('username')} />
            </TextField>
          </div>

          <div className="display:flex flex-direction:column gap:4px">
            <TextField
              helperText={formState.errors.password?.message}
              type="password"
            >
              <Input {...register('password')} />
            </TextField>
          </div>

          <Button
            type="submit"
            loading={isPending}
            className="width:100% padding:12px text:14px bg:blue-600 color:white border-radius:6px hover:bg:blue-700 transition:background-color duration:200ms"
          >
            {t('auth__login-page--form-submit-button')}
          </Button>
        </div>

        <div className="display:flex flex-direction:column gap:8px margin-top:16px text-align:center text:13px">
          <span className="color:gray-600">
            {t('auth__login-page-tips--to-register')}
          </span>
          <Link
            to={RegisterRoute.to}
            className="color:blue-600 hover:underline text:13px"
          >
            {t('auth__login-page-link--register')}
          </Link>
        </div>
      </Form>
    </div>
  )
}

export default LoginPage
