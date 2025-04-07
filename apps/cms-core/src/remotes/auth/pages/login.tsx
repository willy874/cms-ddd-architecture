import { z } from 'zod'
import { Form, Input, Button } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useZodToAntdForm } from '../useZodToAntdForm'
import { useApiLogin } from '../services/login'

function LoginPage() {
  const LoginFormSchema = z.object({
    username: z.string().nonempty('Please enter username!'),
    password: z.string().nonempty('Please enter password!'),
  })
  type LoginFormType = z.infer<typeof LoginFormSchema>
  const initialValues = {
    username: '',
    password: '',
  } satisfies LoginFormType
  const { form, rules } = useZodToAntdForm({ schema: LoginFormSchema })
  const apiLogin = useApiLogin()
  const { mutateAsync: onFinish, isPending } = useMutation({
    mutationFn: async (value: LoginFormType) => {
      await apiLogin(value)
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
            <Button htmlType="submit" loading={isPending}>Login</Button>
          </Form.Item>
        </div>
        <div className="flex flex:column">
          <Link to="/">Go to Home</Link>
          <Link to="/register">Go to Register</Link>
        </div>
      </Form>
    </div>
  )
}

export default LoginPage
