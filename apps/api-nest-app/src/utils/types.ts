export type GetMaybePromise<T> = T extends Promise<infer R> ? R : T
export type GetProviderType<T> = T extends { useFactory: (...args: any[]) => infer R } ? GetMaybePromise<R> : never

export type MockModule<T extends Record<string, any>> = {
  [P in keyof T]: T[P] extends (...args: any[]) => any ? jest.Mock<ReturnType<T[P]>, Parameters<T[P]>> : T[P]
}
