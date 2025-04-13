import { Form } from 'antd'
import { FormInstance, Rule } from 'antd/es/form'
import { z } from 'zod'

type AnyObject = z.ZodObject<Record<string, z.ZodType>>
type AnyObjectEffect = z.ZodEffects<AnyObject>

interface FormOptions<
  Schema extends AnyObject | AnyObjectEffect,
> {
  schema: Schema
  form?: FormInstance<z.infer<Schema>>
}

interface FormResult<
  Schema extends AnyObject | AnyObjectEffect,
> {
  form: FormInstance<z.infer<Schema>>
  rules: { [K in keyof (
    Schema extends AnyObjectEffect ? Schema['_def']['schema']['shape'] :
      Schema extends AnyObject ? Schema['shape'] : never
  )]: Rule[] }
  validate: (val: unknown) => z.infer<Schema>
}

export function useZodToAntdForm<
  Schema extends AnyObject | AnyObjectEffect,
>(options: FormOptions<Schema>): FormResult<Schema> {
  const [form] = Form.useForm<z.infer<Schema>>(options.form)
  const rules: { [k: string]: Rule[] } = {}
  const shape = options.schema instanceof z.ZodEffects
    ? options.schema._def.schema.shape
    : options.schema.shape
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
    rules: rules as FormResult<Schema>['rules'],
    validate: async (val: unknown) => {
      return options.schema.parse(val)
    },
  }
}
