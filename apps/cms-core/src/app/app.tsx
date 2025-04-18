import { StrictMode } from 'react'
import { StyleProvider, createCache } from '@ant-design/cssinjs'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { CoreContextPlugin } from '@/libs/CoreContext'
import { ConfigProvider } from '@/libs/components'

export const MODULE_NAME = 'cms_core/app'

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    const cache = createCache()
    return {
      name: MODULE_NAME,
      onMount() {
        const root = createRoot(document.getElementById('root')!)
        root.render(
          <StrictMode>
            <StyleProvider cache={cache}>
              <ConfigProvider>
                <QueryClientProvider client={context.queryClient}>
                  <RouterProvider router={context.router} />
                </QueryClientProvider>
              </ConfigProvider>
            </StyleProvider>
          </StrictMode>,
        )
      },
    }
  }
}

declare module '@/modules/core' {
  export interface CustomComponentDict {
    HomePage: () => React.ReactNode
  }
}
