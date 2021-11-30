import { useEffect, useRef } from 'react'

type Callback = () => void

export const useInterval = (callback: Callback, delay: number) => {
  const savedCallback = useRef<Callback>()

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    function tick() {
      savedCallback.current!()
    }

    let id = setInterval(tick, delay)
    return () => clearInterval(id)
  }, [delay])
}
