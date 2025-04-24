export class Registry<Dict extends Record<string, any>> {
  private dict: Dict
  private listeners: (() => void)[] = []
  private defaultValue?: Dict[string]

  constructor(partialDict: Partial<Dict> = {}, options: { defaultValue?: Dict[string] } = {}) {
    const { defaultValue } = options
    this.dict = partialDict as Dict
    if (defaultValue) {
      this.defaultValue = defaultValue
    }
  }

  register<T extends keyof Dict>(name: T, value: Dict[T], options?: { override?: boolean }): void
  register(name: string, value: Dict[string], options: { override?: boolean } = {}) {
    const { override = true } = options
    const isDuplicate = Reflect.has(this.dict, name)
    if (isDuplicate && !override) {
      return
    }
    Reflect.set(this.dict, name, value)
    this.emit()
  }

  has(name: string): boolean {
    return Reflect.has(this.dict, name)
  }

  get<T extends keyof Dict>(name: T): Dict[T] {
    const value = this.dict[name] || this.defaultValue
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
