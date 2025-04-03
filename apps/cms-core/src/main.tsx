import './index.css'
import { portalInit } from './core/PortalContext'
import { contextPlugin as shared } from './features/shared'
import { contextPlugin as app } from './features/app'

async function init() {
  const context = portalInit()
  context.componentRegistry.register('NotFound', () => <div>NotFound</div>)
  await context
    .use(shared())
    .use(app())
    .run()
}
init()

declare module '@/core/PortalContext' {
  export interface CustomComponentDict {
    NotFound: () => React.ReactNode
  }
}
