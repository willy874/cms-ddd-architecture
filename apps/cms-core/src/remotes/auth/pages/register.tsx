import { z } from 'zod'
import { Button, Form, Input } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { REGISTER_ROUTE, LOGIN_ROUTE } from '@/constants/routes'
import { getCoreContext } from '@/libs/CoreContext'
import { useZodToAntdForm } from '../useZodToAntdForm'
import { apiRegister } from '../resources/register'

const RegisterFormSchema = z.object({
  username: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
})

function useRegisterForm() {
  const [form] = Form.useForm<z.infer<typeof RegisterFormSchema>>()
  const schema = z.object({
    username: RegisterFormSchema.shape.username
      .nonempty('Please enter username!')
      .min(4, 'Username must be at least 4 characters long!'),
    password: RegisterFormSchema.shape.password
      .nonempty('Please enter password!')
      .regex(/^[a-zA-Z0-9~!@#$%^&*()_+=;',./<>?:"{}|"`\-[\]\\]*$/, {
        message: 'Password must contain only letters, numbers, and special characters!',
      })
      .min(8, 'Password must be at least 8 characters long!'),
    confirmPassword: RegisterFormSchema.shape.confirmPassword
      .nonempty('Please enter confirm password!')
      .superRefine((val, zodCtx) => {
        const password = form.getFieldValue('password')
        if (password !== val) {
          zodCtx.addIssue({
            path: ['confirmPassword'],
            code: 'custom',
            message: 'Password and confirm password do not match!',
          })
        }
      }),
  })
  return useZodToAntdForm({ form, schema })
}

function RegisterPage() {
  const ctx = getCoreContext()
  const Route = ctx.routes.get(REGISTER_ROUTE)
  const LoginRoute = ctx.routes.get(LOGIN_ROUTE)
  const navigate = Route.useNavigate()
  const { form: formInstance, rules } = useRegisterForm()
  const initialValues = {
    username: '',
    password: '',
    confirmPassword: '',
  } satisfies z.infer<typeof RegisterFormSchema>
  const { mutateAsync: onFinish, isPending } = useMutation({
    mutationFn: (data: z.infer<typeof RegisterFormSchema>) => apiRegister({
      username: data.username,
      password: data.password,
    }),
    onSuccess: () => {
      navigate({ to: LoginRoute.to })
    },
  })
  return (
    <div className="flex flex:column padding:16px">
      <h2>Register Page</h2>
      <Form
        form={formInstance}
        initialValues={initialValues}
        onFinish={onFinish}
      >
        <div>
          <Form.Item rules={rules.username} name="username">
            <Input type="text" />
          </Form.Item>
          <Form.Item rules={rules.password} name="password">
            <Input type="password" />
          </Form.Item>
          <Form.Item rules={rules.confirmPassword} name="confirmPassword">
            <Input type="password" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" loading={isPending}>Submit</Button>
          </Form.Item>
        </div>
        <div className="flex flex:column">
          <Link to={LoginRoute.to}>Go to Login</Link>
        </div>
      </Form>
    </div>
  )
}

export default RegisterPage
