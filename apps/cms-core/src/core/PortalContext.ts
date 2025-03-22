import { ClientContext } from './ClientContext'
import { EventBus } from './EventBus'
import { QueryBus } from './QueryBus'
import { CommandBus } from './CommandBus'

export class PortalContext extends ClientContext {
  eventBus = new EventBus()
  queryBus = new QueryBus()
  commandBus = new CommandBus()
  isInit = false

  init() {
    if (this.isInit) {
      throw new Error('PortalContext already initialized')
    }
    this.eventBus.init(this)
    this.queryBus.init(this)
    this.commandBus.init(this)
    this.isInit = true
  }
}
