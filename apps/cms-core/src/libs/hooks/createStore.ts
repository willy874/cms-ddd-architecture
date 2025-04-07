import { useEffect, useState } from 'react'
import { ref, watch } from 'vue'

export function createStore<T extends object>(initStore: () => T) {
  const store = ref(initStore())
  return [
    store,
    () => {
      const [, updated] = useState({})
      useEffect(() => watch(store, () => updated({})), [])
    },
  ]
}
