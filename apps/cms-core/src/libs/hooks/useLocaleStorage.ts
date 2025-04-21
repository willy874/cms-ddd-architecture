import { useCoreContext } from './useCoreContext'

export function useLocaleStorage() {
  const { localStorage: storage } = useCoreContext()
  return {
    getItem: storage.getItem.bind(storage),
    setItem: (storage.setItem.bind(storage)),
    removeItem: storage.removeItem.bind(storage),
    subscribe: storage.subscribe.bind(storage),
  }
}
