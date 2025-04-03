import { CREATE_AUTH_HTTP_INSTANCE, CREATE_BASE_HTTP_INSTANCE } from '@/constants/query'
import { BaseQuery } from '@/libs/QueryBus'

export class CreateBaseHttpQuery extends BaseQuery<typeof CREATE_BASE_HTTP_INSTANCE, []> {
  constructor() {
    super(CREATE_BASE_HTTP_INSTANCE)
  }
}

export class CreateAuthHttpQuery extends BaseQuery<typeof CREATE_AUTH_HTTP_INSTANCE, []> {
  constructor() {
    super(CREATE_AUTH_HTTP_INSTANCE)
  }
}
