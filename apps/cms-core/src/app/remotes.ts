import { loadRemote, init as moduleFederationInit } from '@module-federation/enhanced/runtime'
import { CoreContextPlugin, FeatureModule } from '@/libs/CoreContext'
import { PortalConfig } from '@/libs/PortalConfig'

interface RemotePluginOption {
  modules: FeatureModule[]
}

function contextPlugin(options: RemotePluginOption): CoreContextPlugin {
  return (context) => {
    console.group('load remote module: \n')
    for (const module of options.modules) {
      console.log(JSON.stringify(module, null, 2))
      context.useModule(module, (() => {
        return {}
      })())
    }
    console.groupEnd()
  }
}

function isNotNill<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

export const getRemotePlugin = async (config: PortalConfig) => {
  const configRemote = config.remotes || []
  const remotes = configRemote.reduce((acc, remote) => {
    const [remoteName] = remote.split('/')
    acc.add(remoteName)
    return acc
  }, new Set<string>())

  moduleFederationInit({
    name: 'cms_core',
    remotes: [...remotes].map((remote) => {
      return {
        name: remote,
        entry: '/mf-manifest.json',
      }
    }),
  })
  const modules = await Promise.all(configRemote.map((remote) => loadRemote<FeatureModule>(remote)))
  const plugin = contextPlugin({
    modules: modules.filter(isNotNill),
  })
  return () => plugin
}
