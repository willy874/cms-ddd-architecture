import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { StorageKey } from '@/constants/storage'
import { HOME_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE } from '@/constants/routes'
import { getCoreContext } from '@/libs/CoreContext'
import { useTranslate } from '@/libs/locale'
import { Form, Button, TextField, Input } from '@/libs/components'
import { apiLogin } from '@/remotes/auth/resources/login'
import * as Testid from '@/remotes/auth/constants/testid'

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
    <div
      className="display:flex flex-direction:column gap:32px padding:24px max-w:320px margin-inline:auto"
      data-testid={Testid.LOGIN_PAGE}
    >
      <h2
        className="text:24px font:semibold color:gray-800 text-align:center"
        data-testid={Testid.LOGIN_TITLE}
      >
        {t('auth__login-page--page-title')}
      </h2>
      <Form
        onSubmit={onSubmit}
        className="display:flex flex-direction:column gap:16px"
        data-testid={Testid.LOGIN_FORM}
      >
        <div className="display:flex flex-direction:column gap:16px">

          <div className="display:flex flex-direction:column gap:4px">
            <TextField
              helperText={formState.errors.username?.message}
              data-testid={Testid.LOGIN_USERNAME_FIELD}
            >
              <Input {...register('username')} data-testid={Testid.LOGIN_USERNAME_INPUT} />
            </TextField>
          </div>

          <div className="display:flex flex-direction:column gap:4px">
            <TextField
              helperText={formState.errors.password?.message}
              type="password"
              data-testid={Testid.LOGIN_PASSWORD_FIELD}
            >
              <Input {...register('password')} data-testid={Testid.LOGIN_PASSWORD_INPUT} />
            </TextField>
          </div>

          <Button
            type="submit"
            loading={isPending}
            data-testid={Testid.LOGIN_SUBMIT_BUTTON}
          >
            {t('auth__login-page--form-submit-button')}
          </Button>
        </div>

        <div
          className="display:flex flex-direction:column gap:8px margin-top:16px text-align:center text:13px"
          data-testid={Testid.LOGIN_FOOTER}
        >
          <span
            className="color:gray-600"
            data-testid={Testid.LOGIN_FOOTER_TIP}
          >
            {t('auth__login-page-tips--to-register')}
          </span>
          <Link
            to={RegisterRoute.to}
            className="color:blue-600 hover:underline text:13px"
            data-testid={Testid.LOGIN_LINK_REGISTER}
          >
            {t('auth__login-page-link--register')}
          </Link>
        </div>
      </Form>
    </div>
  )
}

export default LoginPage
