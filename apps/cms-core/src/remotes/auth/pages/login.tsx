import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getCoreContext } from '@/libs/CoreContext'
import { StorageKey } from '@/constants/storage'
import { HOME_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE } from '@/constants/routes'
import { apiLogin } from '../resources/login'
import { Form, Button, TextField } from '@/libs/components'
import { useTranslate } from '@/libs/locale'

const LoginFormSchema = z.object({
  username: z.string(),
  password: z.string(),
})

function useLoginForm() {
  const { t } = useTranslate()
  const schema = z.object({
    username: LoginFormSchema.shape.username.nonempty(t('auth__login-schema-error-message--username')),
    password: LoginFormSchema.shape.password.nonempty('auth__login-schema-error-message--password'),
  })
  return useForm({
    resolver: zodResolver(schema),
  })
}

function LoginPage() {
  const ctx = getCoreContext()
  const { t } = useTranslate()
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
    <div className="flex flex:column padding:16px">
      <h2>{t('auth__login-page--page-title')}</h2>
      <Form onSubmit={onSubmit}>
        <div>
          <div>
            <TextField {...register('username')} />
            <div>{formState.errors.username?.message}</div>
          </div>
          <div>
            <TextField {...register('password')} type="password" />
            <div>{formState.errors.password?.message}</div>
          </div>
          <div>
            <Button type="submit" loading={isPending}>Submit</Button>
          </div>
        </div>
        <div className="flex flex:column">
          <Link to={RegisterRoute.to}>Go to Register</Link>
        </div>
      </Form>
    </div>
  )
}

export default LoginPage
