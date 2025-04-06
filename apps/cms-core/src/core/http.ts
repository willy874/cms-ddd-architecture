import { getCoreContext } from '@/libs/CoreContext'
import { CreateAuthHttpQuery, CreateBaseHttpQuery } from './queries'

export function http() {
  return getCoreContext().queryBus.query(new CreateBaseHttpQuery())
}

export function httpAuth() {
  return getCoreContext().queryBus.query(new CreateAuthHttpQuery())
}
