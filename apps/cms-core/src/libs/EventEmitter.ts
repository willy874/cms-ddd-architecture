import { AnyFunction } from './utils'

export class EventEmitter {
  #instance = new EventTarget()
  #dict = new Map<AnyFunction, EventListener>()

  on(event: string, listener: AnyFunction) {
    const mapKey = listener
    const callback = (event: Event) => {
      const customEvent = event as CustomEvent
      listener(...customEvent.detail)
    }
    this.#dict.set(mapKey, callback)
    this.#instance.addEventListener(event, callback)
    return () => {
      this.#instance.removeEventListener(event, callback)
    }
  }

  off(event: string, listener: AnyFunction) {
    const mapKey = listener
    const callback = this.#dict.get(mapKey)
    if (callback) {
      this.#instance.removeEventListener(event, callback)
    }
  }

  emit(event: string, ...args: unknown[]) {
    this.#instance.dispatchEvent(new CustomEvent(event, { detail: args }))
  }
}
