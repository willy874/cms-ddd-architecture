import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { MESSAGE_SERVICE } from './queue.module'

@Injectable()
export class MessageQueueProducer {
  constructor(@Inject(MESSAGE_SERVICE) private client: ClientProxy) {}

  async publish(pattern: string, data: unknown) {
    return this.client.send(pattern, data).subscribe(
      (response) => {
        console.log('Response from RabbitMQ:', response)
      }
    )
  }
}
