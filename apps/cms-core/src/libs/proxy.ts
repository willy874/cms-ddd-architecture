import { FC, memo, useEffect, useState } from 'react'
import { computed, ref, watch } from 'vue'

export function useComputed<T>(fn: () => T) {
  const [computedRef] = useState(() => computed(fn))
  const [value, updated] = useState(computedRef.value)
  useEffect(() => watch(computedRef, current => updated(current)), [computedRef])
  return value
}

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

export function observable<Props extends object>(Component: FC<Props>): FC<Props> {
  return memo((props: Props) => {
    const [, updated] = useState({})
    const node = computed(() => Component(props))
    useEffect(() => watch(node, () => updated({})), [node])
    return node.value
  })
}
