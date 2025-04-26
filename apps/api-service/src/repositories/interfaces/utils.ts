export type PickKey<T extends Record<string, any>, K extends keyof T> = Required<{ id: T[K] }>
