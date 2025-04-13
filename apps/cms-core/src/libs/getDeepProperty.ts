export type GetDeepProperty<T, K extends string[]> =
  K extends [infer F, ...infer R]
    ? F extends keyof T
      ? GetDeepProperty<T[F], R extends string[] ? R : []>
      : never
    : T

export function getDeepProperty<T, P extends string[]>(obj: T, ...key: P): GetDeepProperty<T, P> | undefined {
  const keys = key as string[]
  let value: any = obj
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = Reflect.get(value, k)
    }
    else {
      return undefined
    }
  }
  return value
}
