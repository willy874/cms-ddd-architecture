export type DeepPartial<T extends Record<any, any>> = {
  [K in keyof T]?: T[K] extends Record<any, any> ? DeepPartial<T[K]> : T[K]
}
