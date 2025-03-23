import { EventEmitter } from './EventEmitter'

interface StorageEmitter {
  on: (listener: StorageEventListener) => () => void
  emit: (event: StorageEvent) => void
}

type ListenerType = 'this' | 'window' | 'channel'
type MessageEventListener = (event: MessageEvent<StorageEvent>) => void
type StorageEventListener = (event: StorageEvent) => void

const createStorageEmitter = (type: ListenerType) => {
  if (type === 'channel') {
    const channel = new MessageChannel()
    return {
      on: (listener: StorageEventListener) => {
        const callback: MessageEventListener = (event) => {
          listener(event.data)
        }
        channel.port1.addEventListener('message', callback)
        return () => {
          channel.port1.removeEventListener('message', callback)
        }
      },
      emit: (event: StorageEvent) => {
        channel.port1.postMessage(event)
      },
    } satisfies StorageEmitter
  }
  if (type === 'window') {
    return {
      on: (listener: StorageEventListener) => {
        window.addEventListener('storage', listener)
        return () => {
          window.removeEventListener('storage', listener)
        }
      },
      emit: (event: StorageEvent) => {
        window.dispatchEvent(event)
      },
    }
  }
  if (type === 'this') {
    const emitter = new EventEmitter()
    return {
      on: (listener: StorageEventListener) => {
        const callback = (event: StorageEvent) => {
          listener(event)
        }
        return emitter.on('change', callback)
      },
      emit: (event: StorageEvent) => {
        emitter.emit('change', event)
      },
    }
  }
  throw new Error('Invalid listener type')
}

export class StorageManager {
  storage: Storage
  emitter: StorageEmitter

  constructor(storage: Storage, type: ListenerType = 'this') {
    this.storage = storage
    this.emitter = createStorageEmitter(type)
  }

  setItem(key: string, newValue: string) {
    const oldValue = this.storage.getItem(key)
    this.storage.setItem(key, newValue)
    this.emitter.emit(
      new StorageEvent('storage', {
        key,
        newValue,
        oldValue,
        storageArea: this.storage,
      }),
    )
  }

  getItem(key: string) {
    return this.storage.getItem(key)
  }

  removeItem(key: string) {
    const oldValue = this.storage.getItem(key)
    this.storage.removeItem(key)
    this.emitter.emit(
      new StorageEvent('storage', {
        key,
        newValue: null,
        oldValue,
        storageArea: this.storage,
      }),
    )
  }

  subscribe(listener: StorageEventListener) {
    return this.emitter.on(listener)
  }
}
