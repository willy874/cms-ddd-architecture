import { pipe } from 'rxjs'
import { NestFactory } from '@nestjs/core'
import { PermissionModule } from './services/permission'
import { RoleModule } from './services/role'
import { UserModule } from './services/user'
import { loadEnv } from '@packages/shared'
import { initMessageQueueService } from './shared/queue'
// import { MessageQueueModule } from './shared/queue'

const init = pipe(
  initMessageQueueService(),
)

async function bootstrap() {
  await loadEnv()
  const app = await NestFactory.create({
    module: class UserAppModule {},
    imports: [
      // MessageQueueModule,
      PermissionModule.register(),
      RoleModule.register(),
      UserModule.register(),
    ],
  })
  init(app)
  await app.listen(process.env.USER_API_PORT ?? 3000)
  console.log(`User service is running on: http://${process.env.USER_API_HOST}:${process.env.USER_API_PORT}`)
}

bootstrap()
