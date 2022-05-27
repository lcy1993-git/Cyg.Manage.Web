import { useMount } from 'ahooks'
import { useRef } from 'react'
import { useMyContext } from '../Context'
import { clear, initMap } from './utils/initializeMap'

const GridMap = () => {
  const { mapRef } = useMyContext()
  const ref = useRef<HTMLDivElement>(null)
  // 挂载地图
  useMount(() => {
    initMap({ mapRef, ref })
    document.addEventListener('keydown', (e) => {
      if (e.keyCode === 27) {
        clear()
      }
    })
  })

  return <div ref={ref} id="map" className="w-full h-full"></div>
}

export default GridMap
