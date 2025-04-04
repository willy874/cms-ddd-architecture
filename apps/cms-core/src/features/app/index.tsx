import { StrictMode } from 'react'
import { unstableSetRender } from 'antd'
import { createRoot, Root } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { CoreContextPlugin } from '@/libs/CoreContext'

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    return {
      async init() {
        import('@ant-design/v5-patch-for-react-19')
      },
      mount() {
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
            <RouterProvider router={context.router} />
          </StrictMode>,
        )
      },
    }
  }
}

declare global {
  export interface Node {
    _reactRoot?: Root
  }
}
