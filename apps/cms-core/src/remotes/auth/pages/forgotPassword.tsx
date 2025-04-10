import { z } from 'zod'
import { Button, Form, Input, message } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { FORGET_PASSWORD_ROUTE, LOGIN_ROUTE } from '@/constants/routes'
import { getCoreContext } from '@/libs/CoreContext'
import { useZodToAntdForm } from '../useZodToAntdForm'
import { apiForgotPassword } from '../resources/forgotPassword'

const ForgetPasswordFormSchema = z.object({
  email: z.string(),
})

function useForgetPasswordForm() {
  const [form] = Form.useForm<z.infer<typeof ForgetPasswordFormSchema>>()
  const schema = z.object({
    email: ForgetPasswordFormSchema.shape.email
      .nonempty('Please enter email!')
      .email('Please enter a valid email address!'),
  })
  return useZodToAntdForm({ form, schema })
}

function ForgetPasswordPage() {
  const ctx = getCoreContext()
  const Route = ctx.routes.get(FORGET_PASSWORD_ROUTE)
  const LoginRoute = ctx.routes.get(LOGIN_ROUTE)
  const navigate = Route.useNavigate()
  const { form: formInstance, rules } = useForgetPasswordForm()
  const initialValues = {
    email: '',
  } satisfies z.infer<typeof ForgetPasswordFormSchema>

  const { mutateAsync: onFinish, isPending } = useMutation({
    mutationFn: (data: z.infer<typeof ForgetPasswordFormSchema>) => apiForgotPassword({
      email: data.email,
    }),
    onSuccess: () => {
      message.success('Password reset link has been sent to your email!')
      navigate({ to: LoginRoute.to })
    },
    onError: () => {
      message.error('Failed to send reset email. Please try again later.')
    },
  })

  return (
    <div className="flex:center flex-direction:column gap:24px p:32px">
      <div className="text-align:center">
        <h2>Forgot Password</h2>
        <p>
          Enter your email and we'll send you a link to reset your password
        </p>
      </div>

      <Form
        form={formInstance}
        initialValues={initialValues}
        onFinish={onFinish}
        layout="vertical"
        className="w:100% max-width:400px"
        data-testid="forget-password__form--container"
      >
        <Form.Item
          name="email"
          label="Email"
          rules={rules.email}
          data-testid="forget-password__form--email"
        >
          <Input
            placeholder="Enter your email"
            data-testid="forget-password__input--email"
          />
        </Form.Item>

        <Form.Item className="mt:24px">
          <Button
            type="primary"
            htmlType="submit"
            loading={isPending}
            block
            data-testid="forget-password__button--submit"
          >
            Send Reset Link
          </Button>
        </Form.Item>

        <div className="text-align:center mt:16px">
          <Link
            to={LoginRoute.to}
            data-testid="forget-password__link--back-to-login"
          >
            Back to Login
          </Link>
        </div>
      </Form>
    </div>
  )
}

export default ForgetPasswordPage
