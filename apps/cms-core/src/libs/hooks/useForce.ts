import { useCallback, useState } from 'react'

export function useForce() {
  const [, setState] = useState(true)
  return useCallback(() => setState((s) => !s), [])
}
