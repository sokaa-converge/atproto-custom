export const clearlyBadCursor = (cursor?: string) => {
  return !!cursor?.includes('::')
}

export const resHeaders = (): Record<string, string> => {
  return {}
}
