export function validateAuthSearch(search: Record<string, unknown>) {
  const returnTo = search.returnTo
  return {
    returnTo:
      typeof returnTo === 'string' && returnTo.startsWith('/') && !returnTo.startsWith('//')
        ? returnTo
        : undefined,
  }
}
