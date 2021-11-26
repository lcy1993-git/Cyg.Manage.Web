import React from 'react'

export const useCurrentRef = <T>(value: any): T => {
  const ref = React.useRef<T>(value)
  return ref.current
}
