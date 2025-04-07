import { Form } from 'antd'
import { FormInstance, Rule } from 'antd/es/form'
import { UnknownKeysParam, z } from 'zod'

interface FormOptions<
  Schema extends z.ZodObject<Record<string, z.ZodType>, UnknownKeysParam, z.ZodTypeAny, Record<string, any>, Record<string, any>>,
> {
  schema: Schema
  form?: FormInstance<z.infer<Schema>>
}

export function useZodToAntdForm<
  Schema extends z.ZodObject<Record<string, z.ZodType>, UnknownKeysParam, z.ZodTypeAny, Record<string, any>, Record<string, any>>,
>(options: FormOptions<Schema>): {
  form: FormInstance<z.infer<Schema>>
  rules: { [K in keyof Schema['shape']]: Rule[] }
} {
  const [form] = Form.useForm<z.infer<Schema>>(options.form)
  const rules: { [k: string]: Rule[] } = {}
  const shape = options.schema instanceof z.ZodType ? options.schema.shape : options.schema
  for (const key in shape) {
    const propertySchema = shape[key]
    rules[key] = [{
      validator: (_: unknown, value: unknown) => {
        const result = propertySchema.safeParse(value)
        if (result.success) {
          return Promise.resolve()
        }
        const firstError = result.error.errors[0]
        return Promise.reject(firstError.message)
      },
    }]
  }
  return {
    form,
    rules: rules as { [K in keyof Schema['shape']]: Rule[] },
  }
}
