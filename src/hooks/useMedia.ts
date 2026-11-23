import { useSyncExternalStore } from 'react'

/** Live boolean for a CSS media query */
export function useMedia(query: string) {
  return useSyncExternalStore(
    cb => {
      const mq = matchMedia(query)
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    },
    () => matchMedia(query).matches,
    () => false,
  )
}

export const useDesktop = () => useMedia('(min-width: 900px)')
export const useFinePointer = () => useMedia('(pointer: fine)')
