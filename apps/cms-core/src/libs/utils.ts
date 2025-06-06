export type AnyFunction = (...args: any[]) => any

export type MaybePromise<T> = T | Promise<T>

export const debounce = <T extends AnyFunction>(fn: T, delay: number): T => {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  } as any
}

export const throttle = <T extends AnyFunction>(fn: T, delay: number): T => {
  let lastRun = 0
  return function (this: any, ...args: any[]) {
    const now = Date.now()
    if (now - lastRun >= delay) {
      lastRun = now
      fn.apply(this, args)
    }
  } as any
}

export const getGlobal = (): object => {
  if (typeof globalThis !== 'undefined') {
    return globalThis
  }
  if (typeof window !== 'undefined') {
    return window
  }
  if (typeof global !== 'undefined') {
    return global
  }
  if (typeof self !== 'undefined') {
    return self
  }
  return {}
}

export const tryCatch = <T>(fn: () => T, fallback: T): T => {
  try {
    return fn()
  }
  catch {
    return fallback
  }
}
