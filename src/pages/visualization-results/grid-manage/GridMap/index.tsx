import { useMount } from 'ahooks'
import { useRef } from 'react'
import { MapRef } from '../../history-grid/components/history-map-base/typings'
import { useCurrentRef } from '../../history-grid/components/history-map-base/utils/hooks'
import { initMap } from './utils/initializeMap'

const GridMap = () => {
  const ref = useRef<HTMLDivElement>(null)
  // 地图实例
  const mapRef = useCurrentRef<MapRef>({ map: {} })
  // 挂载地图
  useMount(() => {
    initMap({ mapRef, ref })
  })

  return <div ref={ref} id="map" className="w-full h-full"></div>
}

export default GridMap
