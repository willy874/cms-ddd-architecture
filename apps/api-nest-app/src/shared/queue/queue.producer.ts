import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { MESSAGE_SERVICE } from './queue.module'

@Injectable()
export class MessageQueueProducer {
  constructor(@Inject(MESSAGE_SERVICE) protected client: ClientProxy) {}

  publish(pattern: string, data: unknown) {
    return new Promise((resolve) => {
      this.client.send(pattern, data).subscribe(resolve)
    })
  }
}
