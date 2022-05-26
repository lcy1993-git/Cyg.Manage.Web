import { useMount } from 'ahooks'
import { useRef } from 'react'
import { useMyContext } from '../Context'
import { initMap } from './utils/initializeMap'

const GridMap = () => {
  const { mapRef } = useMyContext()
  const ref = useRef<HTMLDivElement>(null)
  // 挂载地图
  useMount(() => {
    initMap({ mapRef, ref })
  })

  return <div ref={ref} id="map" className="w-full h-full"></div>
}

export default GridMap
