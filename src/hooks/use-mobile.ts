import * as React from "react"

const MOBILE_QUERY = "(max-width: 767px)"

export function useIsMobile() {
  const subscribe = React.useCallback((onChange: () => void) => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY)
    mediaQuery.addEventListener("change", onChange)
    return () => mediaQuery.removeEventListener("change", onChange)
  }, [])
  const getSnapshot = React.useCallback(() => window.matchMedia(MOBILE_QUERY).matches, [])
  const getServerSnapshot = React.useCallback(() => false, [])

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
