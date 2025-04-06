import './index.css'
import { init as moduleFederationInit, loadRemote } from '@module-federation/enhanced/runtime'
import { CoreContextPlugin, FeatureModule } from './libs/CoreContext'
import { contextPlugin as http } from './modules/http'
import { contextPlugin as router } from './modules/router'
import { contextPlugin as ui } from './modules/ui'
import { contextPlugin as cqrs } from './modules/cqrs'
import { createPortal } from './core/PortalContext'
import { PortalConfig } from './core/config'
import { contextPlugin as app } from './core/app'

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
    authRemoteModules,
  ]) => {
    return (): CoreContextPlugin => {
      return (context) => {
        context.useModule(layoutRemoteModules, {})
        context.useModule(authRemoteModules, {})
      }
    }
  })
}

async function appInit() {
  const config = await getConfig()
  await import('@master/css')
  moduleFederationInit({
    name: 'cms_core',
    remotes: config.remotes,
  })
  const portal = createPortal(config)
  const remote = await getRemote()
  await portal
    .use(cqrs())
    .use(http())
    .use(router())
    .use(ui())
    .use(remote())
    .use(app())
    .run()
}
appInit()
