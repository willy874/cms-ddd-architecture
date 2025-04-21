import { useEffect, useState } from 'react'
import { ref, watch, Ref } from 'vue'

export function createStore<T extends object>(initStore: () => T): [Ref<T>, () => T] {
  const store = ref(initStore())
  return [
    store as any,
    () => {
      const [, updated] = useState({})
      useEffect(() => watch(store, () => updated({})), [])
      return store.value
    },
  ] as const
}
