interface RemoteResource {
  name: string
  entry: string
}

export interface PortalConfig {
  remotes?: RemoteResource[]
}
