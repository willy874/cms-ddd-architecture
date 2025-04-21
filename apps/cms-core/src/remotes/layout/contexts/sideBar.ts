import { getCoreContext } from '@/libs/CoreContext'
import { z } from 'zod'
import { isDiff } from '../utils'
import { useComputed } from '@/libs/hooks/useComputed'
import { useCallback } from 'react'

const STORE_LAYOUT_LEFT_BAR = 'layout.leftBar'
const STORE_LAYOUT_RIGHT_BAR = 'layout.rightBar'

const sideBarStateSchema = z.object({
  show: z.boolean(),
  width: z.number(),
  component: z.function().args().returns(z.any()),
})

const DEFAULT_SIDE_BAR: z.infer<typeof sideBarStateSchema> = {
  show: false,
  width: 0,
  component: () => null,
}

function sideBarFactory(KET: string) {
  const get = () => {
    const state = getCoreContext().store.get(KET)
    return sideBarStateSchema.parse({ ...DEFAULT_SIDE_BAR, ...state })
  }

  const set = (state: Partial<z.infer<typeof sideBarStateSchema>>) => {
    if (isDiff(getLeftBarState(), state)) {
      getCoreContext().store.set(KET, sideBarStateSchema.parse({ ...getLeftBarState(), ...state }))
    }
  }

  const useState = () => {
    const state = useComputed(() => getLeftBarState())
    const set = useCallback(setLeftBarState, [])
    return [state, set] as const
  }

  return {
    get,
    set,
    useState,
  }
}

const {
  get: getLeftBarState,
  set: setLeftBarState,
  useState: useLeftBar,
} = sideBarFactory(STORE_LAYOUT_LEFT_BAR)

const {
  get: getRightBarState,
  set: setRightBarState,
  useState: useRightBar,
} = sideBarFactory(STORE_LAYOUT_RIGHT_BAR)

export {
  getLeftBarState,
  setLeftBarState,
  useLeftBar,
  getRightBarState,
  setRightBarState,
  useRightBar,
}
