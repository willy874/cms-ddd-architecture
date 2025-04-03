import { RootRoute } from '@tanstack/react-router'
import { ADD_ROUTES } from '@/constants/command'
import { CustomCommandBusDict } from '@/core/PortalContext'
import { BaseCommand } from '@/libs/CommandBus'

export class AddRouteCommand extends BaseCommand<typeof ADD_ROUTES, Parameters<CustomCommandBusDict['ADD_ROUTES']>> {
  constructor(handler: (route: RootRoute) => any) {
    super(ADD_ROUTES, handler)
  }
}
