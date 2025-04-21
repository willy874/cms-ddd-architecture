import { z } from 'zod'
import { createStore } from '@/libs/hooks/createStore'

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

export type SideBarState = z.infer<typeof sideBarStateSchema>

export const [leftBarState, useLeftBar] = createStore(() => sideBarStateSchema.parse({ ...DEFAULT_SIDE_BAR }))
export const [rightBarState, useRightBar] = createStore(() => sideBarStateSchema.parse({ ...DEFAULT_SIDE_BAR }))
