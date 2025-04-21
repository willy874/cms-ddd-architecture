import { useEffect, useState } from 'react'
import { ref, watch, Ref, isRef } from 'vue'

export function createStore<T extends object>(initStore: () => T | Ref<T> = () => ({} as T)): [Ref<T>, () => T] {
  const store = isRef(initStore) ? initStore : ref(initStore())
  return [
    store as any,
    () => {
      const [, updated] = useState(store.value)
      useEffect(() => {
        return watch(store, (v) => {
          updated({ ...v })
        }, {
          deep: true,
        })
      }, [])
      return store.value
    },
  ] as const
}
