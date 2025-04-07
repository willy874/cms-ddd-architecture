import { FC, memo, useEffect, useState } from 'react'
import { computed, watch } from 'vue'

export function observable<Props extends object>(Component: FC<Props>): FC<Props> {
  return memo((props: Props) => {
    const [, updated] = useState({})
    const node = computed(() => Component(props))
    useEffect(() => watch(node, () => updated({})), [node])
    return node.value
  })
}
