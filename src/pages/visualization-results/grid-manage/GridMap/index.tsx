import { useMount } from 'ahooks'
import { useRef } from 'react'
import { useMyContext } from '../Context'
import { clear, initMap } from './utils/initializeMap'
import { deletCurrrentSelectFeature } from './utils/select'

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

      if (e.keyCode === 46 || e.keyCode === 8) {
        deletCurrrentSelectFeature(mapRef.map)
      }
    })
  })

  return <div ref={ref} id="map" className="w-full h-full"></div>
}

export default GridMap
