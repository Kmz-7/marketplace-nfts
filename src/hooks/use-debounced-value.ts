import { useEffect, useState } from 'react'

/** Atrasa a propagação de um valor (ex.: texto de busca) para não disparar uma requisição a cada tecla. */
export function useDebouncedValue<T>(value: T, delayMs = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delayMs)
    return () => window.clearTimeout(timeout)
  }, [value, delayMs])

  return debounced
}
