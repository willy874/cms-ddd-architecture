export function requestQueueFactory<Context, Req, Res>(
  createContext: (req: Req, resolve: (res: Res) => void, reject: (error: unknown) => void) => Context,
  resolveQueue: (queue: Context[]) => Promise<void>,
): (request: Req) => Promise<Res> {
  const context = {
    queue: [] as Context[],
    isRefreshing: false,
  }
  return (request) => {
    if (!context.isRefreshing) {
      resolveQueue(context.queue)
        .finally(() => {
          context.isRefreshing = false
          context.queue = []
        })
      context.isRefreshing = true
    }
    return new Promise<Res>((resolve, reject) => {
      context.queue.push(createContext(request, resolve, reject))
    })
  }
}
