import { getCoreContext } from '@/libs/CoreContext'
import { z } from 'zod'
import { isDiff } from './utils'
import { useComputed } from '@/libs/hooks/useComputed'
import { useCallback } from 'react'

const STORE_LAYOUT_RIGHT_BAR = 'layout.rightBar'

const RightBarStateSchema = z.object({
  show: z.boolean(),
  width: z.number(),
  component: z.function().args().returns(z.any()),
})

const DEFAULT_RIGHT_BAR: z.infer<typeof RightBarStateSchema> = {
  show: false,
  width: 0,
  component: () => null,
}

export const getRightBarState = () => {
  const state = getCoreContext().store.get(STORE_LAYOUT_RIGHT_BAR)
  return RightBarStateSchema.parse({ ...DEFAULT_RIGHT_BAR, ...state })
}

export const setRightBarState = (state: Partial<z.infer<typeof RightBarStateSchema>>) => {
  if (isDiff(getRightBarState(), state)) {
    getCoreContext().store.set(STORE_LAYOUT_RIGHT_BAR, RightBarStateSchema.parse({ ...getRightBarState(), ...state }))
  }
}

export const useRightBar = () => {
  const state = useComputed(() => getRightBarState())
  const set = useCallback(setRightBarState, [])
  return [state, set] as const
}
