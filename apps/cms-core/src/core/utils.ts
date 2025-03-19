export type AnyFunction = (...args: any[]) => any

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

function hasObjectPrototype(o: any): o is object {
  return Object.prototype.toString.call(o) === '[object Object]'
}

function isPlainObject(o: unknown): o is object {
  if (!hasObjectPrototype(o)) {
    return false
  }

  const ctor = o.constructor
  if (ctor === undefined) {
    return true
  }

  const prot = ctor.prototype
  if (!hasObjectPrototype(prot)) {
    return false
  }

  if (!Object.prototype.hasOwnProperty.call(ctor, 'isPrototypeOf')) {
    return false
  }

  if (Object.getPrototypeOf(o) !== Object.prototype) {
    return false
  }

  return true
}

export function hashKey(queryKey: unknown[]): string {
  return JSON.stringify(queryKey, (_, val) =>
    isPlainObject(val)
      ? Object.keys(val)
          .sort()
          .reduce((result, key) => {
            result[key] = Reflect.get(val, key)
            return result
          }, {} as any)
      : val,
  )
}
