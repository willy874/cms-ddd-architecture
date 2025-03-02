import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { MESSAGE_SERVICE } from './queue.module'

@Injectable()
export class MessageQueueProducer<T extends Record<string, [any, any]> = Record<string, [any, any]>> {
  constructor(@Inject(MESSAGE_SERVICE) protected client: ClientProxy) {}

  publish<P extends keyof T, D extends T[P]>(pattern: P, data: D[1]): Promise<D[0][]> {
    return new Promise((resolve, reject) => {
      const results: unknown[] = []
      this.client.send(pattern, data).subscribe({
        next: (data: unknown) => {
          results.push(data)
        },
        error: (error: unknown) => reject(error),
        complete: () => resolve(results),
      })
    })
  }
}
