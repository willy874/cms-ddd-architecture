import './index.css'
import { init, loadRemote } from '@module-federation/enhanced/runtime'
import { CoreContextPlugin, FeatureModule } from './libs/CoreContext'
import { createPortal } from './core/PortalContext'
import { PortalConfig } from './core/config'
import { contextPlugin as http } from './modules/http'
import { contextPlugin as router } from './modules/router'
import { contextPlugin as ui } from './modules/ui'
import { contextPlugin as app } from './modules/app'

const getConfig = () => Promise.resolve({
  remotes: [
    {
      name: 'cms_core',
      entry: '/mf-manifest.json',
    },
  ],
} satisfies PortalConfig)

const getRemote = () => {
  return Promise.all([
    loadRemote<FeatureModule>('cms_core/layout'),
    loadRemote<FeatureModule>('cms_core/auth'),
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
  const config = await getConfig()
  await import('@master/css')
  init({
    name: 'cms_core',
    remotes: config.remotes,
  })
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
