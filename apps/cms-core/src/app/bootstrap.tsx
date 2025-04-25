import './base.css'
import './dark.css'
import './index.css'
import 'virtual:uno.css'
import initUnocssRuntime from '@unocss/runtime'
import presetWind4 from '@unocss/preset-wind4'
import { contextPlugin as http } from '@/modules/http'
import { contextPlugin as cqrs } from '@/modules/cqrs'
import { PortalConfig } from '@/libs/PortalConfig'
import { createPortal } from './PortalContext'
import { contextPlugin as router } from './router'
import { contextPlugin as locale } from './locale'
import { contextPlugin as routes } from './routes'
import { contextPlugin as app } from './app'
import { getRemotePlugin } from './remotes'

export async function appInit() {
  initUnocssRuntime({
    defaults: {
      presets: [presetWind4()],
    },
    rootElement: () => document.querySelector('[data-vite-dev-id="/__uno.css"')!,
  })

  const config = await fetch('/app.config.json').then((res) => res.json() as PortalConfig)
  const portal = createPortal(config)
  const remote = await getRemotePlugin(config)
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
