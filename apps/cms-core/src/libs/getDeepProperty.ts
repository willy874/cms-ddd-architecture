export type GetDeepProperty<T, K extends string[], DV = never> =
  K extends [infer F, ...infer R]
    ? F extends keyof T
      ? GetDeepProperty<T[F], R extends string[] ? R : []>
      : DV
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

export function setDeepProperty<T, P extends string[]>(obj: T, key: P, value: GetDeepProperty<T, P>): T {
  const keys = key as string[]
  let current: any = obj
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]
    if (current[k] === undefined) {
      current[k] = {}
    }
    current = current[k]
  }
  current[keys[keys.length - 1]] = value
  return obj
}
