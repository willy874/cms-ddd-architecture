import { getCoreContext } from '@/libs/CoreContext'
import { z } from 'zod'
import { isDiff } from './utils'
import { useComputed } from '@/libs/hooks/useComputed'
import { useCallback } from 'react'

const STORE_LAYOUT_LEFT_BAR = 'layout.leftBar'

const LeftBarStateSchema = z.object({
  show: z.boolean(),
  width: z.number(),
  component: z.function().args().returns(z.any()),
})

const DEFAULT_RIGHT_BAR: z.infer<typeof LeftBarStateSchema> = {
  show: false,
  width: 0,
  component: () => null,
}

export const getLeftBarState = () => {
  const state = getCoreContext().store.get(STORE_LAYOUT_LEFT_BAR)
  return LeftBarStateSchema.parse({ ...DEFAULT_RIGHT_BAR, ...state })
}

export const setLeftBarState = (state: Partial<z.infer<typeof LeftBarStateSchema>>) => {
  if (isDiff(getLeftBarState(), state)) {
    getCoreContext().store.set(STORE_LAYOUT_LEFT_BAR, LeftBarStateSchema.parse({ ...getLeftBarState(), ...state }))
  }
}

export const useLeftBar = () => {
  const state = useComputed(() => getLeftBarState())
  const set = useCallback(setLeftBarState, [])
  return [state, set] as const
}
