export const parseJson = <T>(json: string | null): T | null => {
  try {
    return JSON.parse(json as any)
  }
  catch {
    return null
  }
}

export const cloneJson = <T extends object>(json: T): T => {
  try {
    return JSON.parse(JSON.stringify(json)) as T
  }
  catch {
    throw new Error('Failed to clone JSON object')
  }
}
