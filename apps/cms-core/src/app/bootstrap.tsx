import './index.css'
import './dark.css'
import './light.css'
import { init as moduleFederationInit, loadRemote } from '@module-federation/enhanced/runtime'
import { CoreContextPlugin, FeatureModule } from '@/libs/CoreContext'
import { contextPlugin as http } from '@/modules/http'
import { contextPlugin as cqrs } from '@/modules/cqrs'
import { PortalConfig } from '@/libs/PortalConfig'
import { createPortal } from './PortalContext'
import { contextPlugin as router } from './router'
import { contextPlugin as locale } from './locale'
import { contextPlugin as routes } from './routes'
import { contextPlugin as app } from './app'

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
    loadRemote<FeatureModule>('cms_core/ui'),
    loadRemote<FeatureModule>('cms_core/layout'),
    loadRemote<FeatureModule>('cms_core/auth'),
  ]).then(([
    uiRemoteModules,
    layoutRemoteModules,
    authRemoteModules,
  ]) => {
    return (): CoreContextPlugin => {
      return (context) => {
        context.useModule(uiRemoteModules, {})
        context.useModule(layoutRemoteModules, {})
        context.useModule(authRemoteModules, {})
      }
    }
  })
}

export async function appInit() {
  const config = await getConfig()
  await import('@master/css')
  moduleFederationInit({
    name: 'cms_core',
    remotes: config.remotes,
  })
  const portal = createPortal(config)
  const remote = await getRemote()
  await portal
    .use(locale())
    .use(cqrs())
    .use(http())
    .use(routes())
    .use(router())
    .use(remote())
    .use(app())
    .run()
}
