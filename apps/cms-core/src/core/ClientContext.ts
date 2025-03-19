import { QueryClient } from '@tanstack/react-query';
import { EventEmitter } from 'events';

export class ClientContext {
  query = new QueryClient();
  emitter = new EventEmitter();
}
