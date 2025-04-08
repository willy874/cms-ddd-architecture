import { z } from 'zod'
import { Form, Input, Button } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { getCoreContext } from '@/libs/CoreContext'
import { StorageKey } from '@/constants/storage'
import { HOME_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE } from '@/constants/routes'
import { useZodToAntdForm } from '../useZodToAntdForm'
import { apiLogin } from '../services/login'

const LoginFormSchema = z.object({
  username: z.string(),
  password: z.string(),
})

function useLoginForm() {
  const [form] = Form.useForm<z.infer<typeof LoginFormSchema>>()
  const schema = z.object({
    username: LoginFormSchema.shape.username.nonempty('Please enter username!'),
    password: LoginFormSchema.shape.password.nonempty('Please enter password!'),
  })
  return useZodToAntdForm({ form, schema })
}

function LoginPage() {
  const ctx = getCoreContext()
  const Route = ctx.routes.get(LOGIN_ROUTE)
  const HomeRoute = ctx.routes.get(HOME_ROUTE)
  const RegisterRoute = ctx.routes.get(REGISTER_ROUTE)
  const navigate = Route.useNavigate()
  const { form, rules } = useLoginForm()
  const initialValues = {
    username: '',
    password: '',
  } satisfies z.infer<typeof LoginFormSchema>
  const { mutateAsync: onFinish, isPending } = useMutation({
    mutationFn: apiLogin,
    onSuccess: ({ data }) => {
      ctx.localStorage.setItem(StorageKey.ACCESS_TOKEN, data.accessToken)
      ctx.localStorage.setItem(StorageKey.REFRESH_TOKEN, data.refreshToken)
      ctx.localStorage.setItem(StorageKey.TOKEN_TYPE, data.tokenType)
      navigate({ to: HomeRoute.to })
    },
  })
  return (
    <div className="flex flex:column padding:16px">
      <h1>Login Page</h1>
      <Form
        form={form}
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
          <Form.Item>
            <Button htmlType="submit" loading={isPending}>Submit</Button>
          </Form.Item>
        </div>
        <div className="flex flex:column">
          <Link to={RegisterRoute.to}>Go to Register</Link>
        </div>
      </Form>
    </div>
  )
}

export default LoginPage
