import { SET_LAYOUT_LEFT_BAR } from '@/constants/command'
import { CoreContextPlugin } from '@/libs/CoreContext'
import { lazy } from 'react'

export const MODULE_NAME = 'cms_core/menu'

export const dependencies = ['cms_core/router', 'cms_core/ui', 'cms_core/layout', 'cms_core/auth']

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    return {
      name: MODULE_NAME,
      onInit: async () => {
        await context.commandBus.command(SET_LAYOUT_LEFT_BAR, {
          show: true,
          width: 280,
          component: lazy(() => import('./components/Menu')),
        })
      },
    }
  }
}
