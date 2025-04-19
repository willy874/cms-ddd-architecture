import './base.css'
import './dark.css'
import './index.css'
import 'virtual:uno.css'
import initUnocssRuntime from '@unocss/runtime'
import presetWind4 from '@unocss/preset-wind4'
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
  isAuthClose: true,
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
    loadRemote<FeatureModule>('cms_core/home'),
    loadRemote<FeatureModule>('cms_core/auth'),
  ]).then(([
    uiRemoteModules,
    layoutRemoteModules,
    homeRemoteModules,
    authRemoteModules,
  ]) => {
    return (): CoreContextPlugin => {
      return (context) => {
        context.useModule(uiRemoteModules, {})
        context.useModule(layoutRemoteModules, {})
        context.useModule(homeRemoteModules, {})
        context.useModule(authRemoteModules, {})
      }
    }
  })
}

export async function appInit() {
  const config = await getConfig()
  moduleFederationInit({
    name: 'cms_core',
    remotes: config.remotes,
  })
  initUnocssRuntime({
    defaults: {
      presets: [presetWind4()],
    },
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
