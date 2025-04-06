export class Queue {
  current: (() => Promise<unknown>)[] = []
  active: Promise<unknown> | null = null

  dispatch(fn: () => Promise<unknown>) {
    this.current = [...this.current, fn]
    return new Promise((resolve, reject) => {
      Promise.resolve(this.active)
        .then(() => {
          if (this.current[0] === fn) {
            return fn()
          }
          throw new Error('Queue is not in order')
        })
        .then(resolve)
        .catch(reject)
        .finally(() => {
          this.current = this.current.filter(f => f !== fn)
        })
    })
  }
}

export class QueueMap {
  dict: Map<string, Queue> = new Map()

  get(name: string): Queue {
    if (this.dict.has(name)) {
      return this.dict.get(name) as Queue
    }
    else {
      const queue = new Queue()
      this.dict.set(name, queue)
      return queue
    }
  }
}
