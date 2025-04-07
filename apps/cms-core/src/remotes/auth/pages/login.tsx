import { Link } from '@tanstack/react-router'
import { z } from 'zod'
import { Form, Input, Button } from 'antd'
import { useZodToAntdForm } from '../useZodToAntdForm'
import { useMutation } from '@tanstack/react-query'

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
  const { mutateAsync: onFinish } = useMutation({
    mutationFn: async (value: LoginFormType) => {

    },
  })
  return (
    <div>
      <h1>Login Page</h1>
      <p>Please enter your credentials to login.</p>
      <div className="flex flex:column">
        <Link to="/">Go to Home</Link>
        <Link to="/register">Go to Register</Link>
      </div>
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
            <Button htmlType="submit">Login</Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  )
}

export default LoginPage
