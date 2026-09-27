import { useEffect, useState } from "react"

// Returns a "delayed" copy of a value that only updates after `delay` ms of no changes.
export function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer) // cancel the timer if value changes again quickly
  }, [value, delay])

  return debounced
}