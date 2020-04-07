import { useState, useEffect, useRef } from 'react'

export default function useDebounce(
  value,
  timeout,
  runOnInitialRender = false,
) {
  const [state, setState] = useState(value)
  const didMount = useRef(runOnInitialRender)

  useEffect(() => {
    if (didMount.current) {
      const handler = setTimeout(() => setState(value), timeout)
      return () => clearTimeout(handler)
    } else {
      didMount.current = true
    }
  }, [value, timeout])

  return state
}
