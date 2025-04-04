import './index.css'
import { createPortal } from './core/PortalContext'
import { contextPlugin as shared } from './features/shared'
import { contextPlugin as ui } from './features/ui'
import { contextPlugin as app } from './features/app'

async function init() {
  const context = createPortal()
  await context
    .use(shared())
    .use(ui())
    .use(app())
    .run()
}
init()

declare module '@/core/PortalContext' {
  export interface CustomComponentDict {
    NotFound: () => React.ReactNode
  }
}
