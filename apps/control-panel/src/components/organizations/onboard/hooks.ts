import * as React from 'react'

export function useFocusOnMount<T extends HTMLElement>(): React.RefObject<T | null> {
  const ref = React.useRef<T>(null)
  React.useEffect(() => {
    ref.current?.focus()
  }, [])
  return ref
}
