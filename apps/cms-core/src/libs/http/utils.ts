export function createHeaders(...args: (HeadersInit | void)[]): Headers {
  const headers = new Headers()
  args.forEach(arg => {
    if (!arg) return
    const header = new Headers(arg)
    header.forEach((value, key) => {
      headers.append(key, value)
    })
  })
  return headers
}

export function getRequestBody(request: Request): Promise<BodyInit> {
  if (request.headers.get('Content-Type')?.includes('application/json')) {
    return request.json()
  }
  if (request.headers.get('Content-Type')?.includes('application/x-www-form-urlencoded')) {
    return request.formData()
  }
  if (request.headers.get('Content-Type')?.includes('multipart/form-data')) {
    return request.formData()
  }
  if (request.headers.get('Content-Type')?.includes('text/plain')) {
    return request.text()
  }
  return request.blob()
}

export function bodyHandler(body: unknown, headers: Headers): BodyInit {
  if (body instanceof FormData) {
    headers.set('Content-Type', 'multipart/form-data')
    return body
  }
  if (typeof body === 'object') {
    headers.set('Content-Type', 'application/json')
    return JSON.stringify(body)
  }
  if (body instanceof URLSearchParams) {
    headers.set('Content-Type', 'application/x-www-form-urlencoded')
    return body
  }
  if (body instanceof Blob) {
    headers.set('Content-Type', body.type || 'application/octet-stream')
    return body
  }
  if (typeof body === 'string') {
    headers.set('Content-Type', 'text/plain')
    return body
  }
  return body as BodyInit
}

interface ResponseHandlerOptions {
  json?: (data: object) => unknown
  blob?: (data: Blob) => unknown
  text?: (data: string) => unknown
  default?: (data: string) => unknown
}

export async function responseHandler(res: Response, options: ResponseHandlerOptions = {}): Promise<unknown> {
  if (res.headers.get('Content-Type')?.includes('application/json')) {
    const data = await res.json()
    return options.json ? options.json(data) : data
  }
  if (res.headers.get('Content-Type')?.includes('text/html')) {
    const data = await res.text()
    return options.text ? options.text(data) : data
  }
  if (
    /^application\/(octet-stream|zip|x-zip-compressed|x-zip|pdf)/i.test(res.headers.get('Content-Type') || '')
    || /^(image|video|audio)\/.*/.test(res.headers.get('Content-Type') || '')
    || res.headers.get('Content-Disposition')?.includes('attachment')
  ) {
    const data = await res.blob()
    return options.blob ? options.blob(data) : data
  }
  const data = await res.text()
  return options.default ? options.default(data) : data
}

export function entriesToRecord(entries: string[][]): Record<string, string | string[]> {
  const record: Record<string, string | string[]> = {}
  entries.forEach(([key, value]) => {
    if (record[key]) {
      if (Array.isArray(record[key])) {
        (record[key] as string[]).push(value)
      }
      else {
        record[key] = [record[key] as string, value]
      }
    }
    else {
      record[key] = value
    }
  })
  return record
}
