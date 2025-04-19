export const isDiff = <T extends Record<any, unknown>>(prev: T, next?: Partial<T>) => {
  for (const key in next) {
    if (Object.is(prev[key], next?.[key])) {
      continue
    }
    return true
  }
}
