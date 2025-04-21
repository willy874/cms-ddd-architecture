import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { HOME_ROUTE, REGISTER_ROUTE, LOGIN_ROUTE } from '@/constants/routes'
import { useRoute } from '@/libs/hooks/useRoute'
import { Form, Button, TextField, Input } from '@/libs/components'
import { apiRegister } from '@/remotes/auth/resources/register'
import * as Testid from '@/remotes/auth/constants/testid'
import { useTranslate } from '@/libs/hooks/useTranslate'

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
  const t = useTranslate()
  const CurrentRoute = useRoute(REGISTER_ROUTE)
  const HomeRoute = useRoute(HOME_ROUTE)
  const LoginRoute = useRoute(LOGIN_ROUTE)
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
      className="flex items-center justify-center grow-1"
    >
      <div
        className="flex flex-col p-6 w-[400px] translate-y-[-10%] bg-white/10 rounded-lg shadow-[0_2px_8px_rgba(255,255,255,0.1)]"
        data-testid={Testid.LOGIN_PAGE}
      >
        <h2
          className="text-[24px] font-semibold text-neutral-100 text-center mb-6"
          data-testid={Testid.REGISTER_TITLE}
        >
          {t('auth__register-page--page-title')}
        </h2>
        <Form
          onSubmit={onSubmit}
          className="flex flex-col gap-4"
          data-testid={Testid.REGISTER_FORM}
        >
          <div className="flex flex-col">

            <div className="flex flex-col gap-2">
              <label>
                {t('auth__register-page--form-username-label')}
              </label>
              <TextField
                helperText={formState.errors.username?.message}
                error={!!formState.errors.username}
                data-testid={Testid.REGISTER_USERNAME_FIELD}
              >
                <Input {...register('username')} data-testid={Testid.REGISTER_USERNAME_INPUT} />
              </TextField>
            </div>

            <div className="flex flex-col gap-2">
              <label>
                {t('auth__login-page--form-password-label')}
              </label>
              <TextField
                helperText={formState.errors.password?.message}
                error={!!formState.errors.password}
                type="password"
                data-testid={Testid.REGISTER_PASSWORD_FIELD}
              >
                <Input {...register('password')} data-testid={Testid.REGISTER_PASSWORD_INPUT} />
              </TextField>
            </div>

            <div className="flex flex-col gap-2">
              <label>
                {t('auth__register-page--form-confirm-password-label')}
              </label>
              <TextField
                helperText={formState.errors.confirmPassword?.message}
                error={!!formState.errors.confirmPassword}
                type="password"
                data-testid={Testid.REGISTER_CONFIRM_PASSWORD_FIELD}
              >
                <Input {...register('confirmPassword')} data-testid={Testid.REGISTER_CONFIRM_PASSWORD_INPUT} />
              </TextField>
            </div>
          </div>

          <Button
            type="submit"
            loading={isPending}
            data-testid={Testid.REGISTER_SUBMIT_BUTTON}
          >
            {t('auth__register-page--form-submit-button')}
          </Button>

          <div
            className="flex flex-col gap-2 mt-4 text-center text-xs"
            data-testid={Testid.REGISTER_FOOTER}
          >
            <span
              className="text-gray-600"
              data-testid={Testid.REGISTER_FOOTER_TIP}
            >
              {t('auth__register-page-tips--to-login')}
            </span>
            <Link
              to={LoginRoute.to}
              className="text-blue-600 hover:underline text-xs"
              data-testid={Testid.REGISTER_LINK_LOGIN}
            >
              {t('auth__register-page-link--login')}
            </Link>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default RegisterPage
