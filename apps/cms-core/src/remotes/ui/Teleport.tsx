import { Portal } from '@zag-js/react'

export default function Teleport({
  children,
  ...props
}: React.ComponentProps<typeof Portal>) {
  return <Portal {...props}>{children}</Portal>
}

declare module '@/modules/core' {
  export interface CustomComponentDict {
    Teleport: typeof Teleport
  }
}
