import './index.css'
import { createPortal } from './core/PortalContext'
import { PortalConfig } from './core/config'
import { contextPlugin as shared } from './features/shared'
import { contextPlugin as layout } from './features/layout'
import { contextPlugin as ui } from './features/ui'
import { contextPlugin as app } from './features/app'

async function init() {
  const config = await Promise.resolve({} as PortalConfig)
  await createPortal(config)
    .use(shared())
    .use(ui())
    .use(layout())
    .use(app())
    .run()
}
init()

declare module '@/core/PortalContext' {
  export interface CustomComponentDict {
    NotFound: () => React.ReactNode
  }
}
