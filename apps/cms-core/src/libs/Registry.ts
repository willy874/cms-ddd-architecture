export class Registry<Dict extends Record<string, any>> {
  private dict: Dict
  private listeners: (() => void)[] = []

  constructor(partialDict: Partial<Dict> = {}) {
    this.dict = partialDict as Dict
  }

  register(name: string, value: Dict[string]) {
    // if (this.dict[name]) {
    //   throw new Error(`The ${name} is already registered.`)
    // }
    Reflect.set(this.dict, name, value)
    this.emit()
  }

  get<T extends keyof Dict>(name: T): Dict[T] {
    const value = this.dict[name]
    if (!value) {
      throw new Error(`The ${String(name)} is not registered.`)
    }
    return value
  }

  emit() {
    for (const listener of this.listeners) {
      listener()
    }
  }

  subscribe<T extends keyof Dict>(property: T, listener: (value: Dict[T]) => void, options?: { immediate?: boolean }) {
    const value = this.dict[property]
    if (value && options?.immediate) {
      listener(value)
    }
    const callback = () => listener(this.dict[property])
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback)
    }
  }
}
