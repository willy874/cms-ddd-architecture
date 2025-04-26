export const jsonKeySort = (json: object) => {
  if (!json) return null
  const entries = Object.entries(json)
  return Object.fromEntries(
    entries.sort((a, b) => a[0].localeCompare(b[0]))
  )
}
