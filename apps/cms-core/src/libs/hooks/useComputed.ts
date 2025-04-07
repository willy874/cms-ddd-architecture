import { useEffect, useState } from 'react'
import { computed, watch } from 'vue'

export function useComputed<T>(fn: () => T) {
  const [computedRef] = useState(() => computed(fn))
  const [value, updated] = useState(computedRef.value)
  useEffect(() => watch(computedRef, current => updated(current)), [computedRef])
  return value
}
