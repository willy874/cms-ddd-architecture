import { useEffect, useState } from 'react'
import { ref, watch, Ref, isRef } from 'vue'

export function createStore<T extends object>(initStore: () => T | Ref<T> = () => ({} as T)): [Ref<T>, (cb?: (stats: T) => void) => T] {
  const store = isRef(initStore) ? initStore : ref(initStore())
  return [
    store as any,
    (cb) => {
      const [, updated] = useState(store.value)
      useEffect(() => {
        return watch(store, (v) => {
          cb?.(v)
          updated({ ...v })
        }, {
          deep: true,
        })
      }, [cb])
      return store.value
    },
  ] as const
}
