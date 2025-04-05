import './index.css'
import { init, loadRemote } from '@module-federation/enhanced/runtime'
import { CoreContextPlugin, FeatureModule } from './libs/CoreContext'
import { createPortal } from './core/PortalContext'
import { PortalConfig } from './core/config'
import { contextPlugin as http } from './modules/http'
import { contextPlugin as router } from './modules/router'
import { contextPlugin as ui } from './modules/ui'
import { contextPlugin as app } from './modules/app'

init({
  name: 'cms_core',
  remotes: [
    {
      name: 'cms_core',
      entry: '/mf-manifest.json',
    },
  ],
})

const getRemote = () => {
  return Promise.all([
    loadRemote<FeatureModule>('cms_core/layout'),
  ]).then(([
    layoutRemoteModules,
  ]) => {
    return (): CoreContextPlugin => {
      return (context) => {
        context.useModule(layoutRemoteModules, {})
      }
    }
  })
}

async function appInit() {
  await import('@master/css')
  const config = await Promise.resolve({} as PortalConfig)
  const portal = createPortal(config)
  const remote = await getRemote()
  await portal
    .use(http())
    .use(router())
    .use(ui())
    .use(remote())
    .use(app())
    .run()
}
appInit()

declare module '@/core/custom' {
  export interface CustomComponentDict {
    NotFound: () => React.ReactNode
  }
}
