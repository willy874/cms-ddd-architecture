export type DeepPartial<T extends Record<any, any>> = {
  [K in keyof T]?: T[K] extends Record<any, any> ? DeepPartial<T[K]> : T[K]
}

export type DeepFlatKey<T> = T extends object ? {
  [K in keyof T]: K extends string
    ? T[K] extends object
      ? `${K}-${DeepFlatKey<T[K]>}`
      : `${K}`
    : never
}[keyof T] : never
