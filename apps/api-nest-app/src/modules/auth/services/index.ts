import { GetProviderType } from '@/utils/types'

export const USER_SERVICE = 'USER_SERVICE'

export const UserServiceProvider = {
  provide: USER_SERVICE,
  useFactory: async () => {
    const module = await import('../user.service')
    return module.UserService
  },
}

export type UserService = GetProviderType<typeof UserServiceProvider>
