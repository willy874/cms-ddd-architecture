import { NestFactory } from '@nestjs/core'
import { PermissionModule } from './modules/permission'
import { RoleModule } from './modules/role'
import { UserModule } from './modules/user'
import { loadEnv } from '@packages/shared'

async function bootstrap() {
  await loadEnv()
  const app = await NestFactory.create({
    module: class UserAppModule {},
    imports: [
      PermissionModule.register(),
      RoleModule.register(),
      UserModule.register(),
    ],
  })
  await app.listen(process.env.USER_API_PORT ?? 3000)
}

bootstrap()
