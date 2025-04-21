import { useEffect, useRef, useState } from 'react'
import { watch, Ref } from 'vue'

function getSourceValue<T>(source: Ref<T> | (() => T)): T {
  if (typeof source === 'function') {
    return source()
  }
  return source.value
}

export function useWatch<T>(
  source: Ref<T> | (() => T),
  callback: (value: T) => void,
  options: {
    immediate?: boolean
  } = {},
): T {
  const [value, update] = useState(getSourceValue(source))
  const optionsRef = useRef(options)
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const { immediate } = optionsRef.current
    return watch(source, (newValue) => {
      update(newValue)
      callbackRef.current(newValue)
    }, {
      immediate,
    })
  }, [source])

  return value
}
