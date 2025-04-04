import { getPortalContext } from './PortalContext'
import { CreateBaseHttpQuery, CreateAuthHttpQuery } from './queries'

export function http() {
  return getPortalContext().queryBus.query(new CreateBaseHttpQuery())
}

export function httpAuth() {
  return getPortalContext().queryBus.query(new CreateAuthHttpQuery())
}
