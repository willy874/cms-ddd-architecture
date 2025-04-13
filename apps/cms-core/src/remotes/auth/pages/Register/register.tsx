import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { HOME_ROUTE, REGISTER_ROUTE, LOGIN_ROUTE } from '@/constants/routes'
import { getCoreContext } from '@/libs/CoreContext'
import { useTranslate } from '@/libs/locale'
import { Form, Button, TextField, Input } from '@/libs/components'
import { apiRegister } from '@/remotes/auth/resources/register'
import * as Testid from '@/remotes/auth/constants/testid'

const RegisterFormSchema = z.object({
  username: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
})

function useRegisterForm() {
  const t = useTranslate()
  const schema = z.object({
    username: RegisterFormSchema.shape.username
      .nonempty(t('auth__username-error-message--required'))
      .min(4, t('auth__username-error-message--min-length')),
    password: RegisterFormSchema.shape.password
      .nonempty(t('auth__password-error-message--required'))
      .min(8, t('auth__password-error-message--min-length'))
      .regex(
        /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/,
        t('auth__password-error-message--invalid-chars'),
      ),
    confirmPassword: RegisterFormSchema.shape.confirmPassword
      .nonempty(t('auth__confirm-password-error-message--required')),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('auth__confirm-password-error-message--mismatch'),
    path: ['confirmPassword'],
  })

  return useForm({
    resolver: zodResolver(schema),
  })
}

function RegisterPage() {
  const ctx = getCoreContext()
  const t = useTranslate()
  const CurrentRoute = ctx.routes.get(REGISTER_ROUTE)
  const HomeRoute = ctx.routes.get(HOME_ROUTE)
  const LoginRoute = ctx.routes.get(LOGIN_ROUTE)
  const navigate = CurrentRoute.useNavigate()
  const { register, handleSubmit, formState } = useRegisterForm()
  const { mutateAsync: onFinish, isPending } = useMutation({
    mutationFn: apiRegister,
    onSuccess: () => {
      navigate({ to: HomeRoute.to })
    },
  })
  const onSubmit = handleSubmit((data) => {
    const { username, password } = data
    return onFinish({ username, password })
  })

  return (
    <div
      className="display:flex flex-direction:column gap:32px padding:24px max-w:320px margin-inline:auto"
      data-testid={Testid.REGISTER_PAGE}
    >
      <h2
        className="text:24px font:semibold color:gray-800 text-align:center"
        data-testid={Testid.REGISTER_TITLE}
      >
        {t('auth__register-page--page-title')}
      </h2>
      <Form
        onSubmit={onSubmit}
        className="display:flex flex-direction:column gap:16px"
        data-testid={Testid.REGISTER_FORM}
      >
        <div className="display:flex flex-direction:column gap:16px">

          <div className="display:flex flex-direction:column gap:4px">
            <TextField
              helperText={formState.errors.username?.message}
              data-testid={Testid.REGISTER_USERNAME_FIELD}
            >
              <Input {...register('username')} data-testid={Testid.REGISTER_USERNAME_INPUT} />
            </TextField>
          </div>

          <div className="display:flex flex-direction:column gap:4px">
            <TextField
              helperText={formState.errors.password?.message}
              type="password"
              data-testid={Testid.REGISTER_PASSWORD_FIELD}
            >
              <Input {...register('password')} data-testid={Testid.REGISTER_PASSWORD_INPUT} />
            </TextField>
          </div>

          <div className="display:flex flex-direction:column gap:4px">
            <TextField
              helperText={formState.errors.confirmPassword?.message}
              type="password"
              data-testid={Testid.REGISTER_CONFIRM_PASSWORD_FIELD}
            >
              <Input {...register('confirmPassword')} data-testid={Testid.REGISTER_CONFIRM_PASSWORD_INPUT} />
            </TextField>
          </div>

          <Button
            type="submit"
            loading={isPending}
            data-testid={Testid.REGISTER_SUBMIT_BUTTON}
          >
            {t('auth__register-page--form-submit-button')}
          </Button>
        </div>

        <div
          className="display:flex flex-direction:column gap:8px margin-top:16px text-align:center text:13px"
          data-testid={Testid.REGISTER_FOOTER}
        >
          <span
            className="color:gray-600"
            data-testid={Testid.REGISTER_FOOTER_TIP}
          >
            {t('auth__register-page-tips--to-login')}
          </span>
          <Link
            to={LoginRoute.to}
            className="color:blue-600 hover:underline text:13px"
            data-testid={Testid.REGISTER_LINK_LOGIN}
          >
            {t('auth__register-page-link--login')}
          </Link>
        </div>
      </Form>
    </div>
  )
}

export default RegisterPage
