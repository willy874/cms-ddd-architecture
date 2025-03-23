import { reactive, watch } from 'vue'

export class StateManager {
  readonly state = reactive({})

  subscribe(cb: (state: unknown) => void) {
    watch(this.state, cb, {
      deep: true,
      flush: 'sync',
    })
  }

  get(key: string) {
    const keys = key.split('.')
    let value = this.state
    for (const key of keys) {
      if (value && typeof value === 'object') {
        value = Reflect.get(value, key)
      }
      else {
        return undefined
      }
    }
    return value
  }

  set(key: string, value: unknown) {
    const keys = key.split('.')
    let obj = this.state as object
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (i === keys.length - 1) {
        Reflect.set(obj, key, value)
      }
      else {
        if (!Reflect.has(obj, key)) {
          Reflect.set(obj, key, {})
        }
        obj = Reflect.get(obj, key)
      }
    }
  }
}
