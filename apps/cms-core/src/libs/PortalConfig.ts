interface RemoteResource {
  name: string
  entry: string
}

export interface PortalConfig {
  isAuthClose?: boolean
  remotes?: RemoteResource[]
}
