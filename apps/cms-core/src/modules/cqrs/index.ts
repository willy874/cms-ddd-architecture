import { QueryBus } from './libs/QueryBus'
import { CommandBus } from './libs/CommandBus'
import { EventBus } from './libs/EventBus'
import { CoreContextPlugin } from '@/libs/CoreContext'

export const MODULE_NAME = 'cms_core/cqrs'

export interface CustomCommandBusDict {}
export interface CustomEventBusDict {}
export interface CustomQueryBusDict {}

type QueryBusDict = {
  [K in keyof CustomQueryBusDict]: CustomQueryBusDict[K]
}
type CommandBusDict = {
  [K in keyof CustomCommandBusDict]: CustomCommandBusDict[K]
}
type EventBusDict = {
  [K in keyof CustomEventBusDict]: CustomEventBusDict[K]
}

export const contextPlugin = (): CoreContextPlugin => {
  return (context) => {
    const queryBus = new QueryBus<QueryBusDict>()
    queryBus.emitter = context.emitter
    queryBus.queryClient = context.queryClient
    const commandBus = new CommandBus<CommandBusDict>()
    commandBus.emitter = context.emitter
    const eventBus = new EventBus<EventBusDict>()
    eventBus.emitter = context.emitter

    context.queryBus = queryBus
    context.commandBus = commandBus
    context.eventBus = eventBus
    return {
      name: MODULE_NAME,
    }
  }
}

declare module '@/libs/CoreContext' {
  export interface CoreContext {
    queryBus: QueryBus<QueryBusDict>
    commandBus: CommandBus<CommandBusDict>
    eventBus: EventBus<EventBusDict>
  }
}
