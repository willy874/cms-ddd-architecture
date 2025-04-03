import { FC } from 'react'

export class ComponentRegistry<Dict extends Record<string, FC>> {
  private dict: Dict

  constructor(partialDict: Partial<Dict> = {}) {
    this.dict = partialDict as Dict
  }

  register(name: string, component: FC) {
    if (this.dict[name]) {
      throw new Error(`Component ${name} is already registered.`)
    }
    Reflect.set(this.dict, name, component)
  }

  get<T extends keyof Dict>(name: T): Dict[T] {
    const component = this.dict[name]
    if (!component) {
      throw new Error(`Component ${String(name)} is not registered.`)
    }
    return component
  }
}
