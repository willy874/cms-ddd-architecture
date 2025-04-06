import { StrictMode } from 'react'
import { ConfigProvider, unstableSetRender } from 'antd'
import { StyleProvider, createCache } from '@ant-design/cssinjs'
import { createRoot, Root } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { CoreContextPlugin } from '@/libs/CoreContext'

export const MODULE_NAME = 'cms_core/app'

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    const cache = createCache()
    return {
      name: MODULE_NAME,
      async onInit() {
        await import('@ant-design/v5-patch-for-react-19')
      },
      onMount() {
        context.router.buildRouteTree()
        unstableSetRender((node, container) => {
          container._reactRoot ||= createRoot(container)
          const root = container._reactRoot
          root.render(node)
          return async () => {
            await new Promise(resolve => setTimeout(resolve, 0))
            root.unmount()
          }
        })
        createRoot(document.getElementById('root')!).render(
          <StrictMode>
            <StyleProvider cache={cache}>
              <ConfigProvider theme={{ cssVar: true }}>
                <RouterProvider router={context.router} />
              </ConfigProvider>
            </StyleProvider>
          </StrictMode>,
        )
      },
    }
  }
}

declare global {
  export interface Element {
    _reactRoot?: Root
  }
  export interface DocumentFragment {
    _reactRoot?: Root
  }
}
