import { useState } from 'react'
import MapBase from '../map-base'
import Layer from 'ol/layer/Layer'
import LayerGroup from 'ol/layer/Group'
import { initLayers, initOtherLayers, initTrackLayers, initView } from '../../../utils'
import styles from './index.less'

const MapContainer = (props: any) => {
  const { mapData } = props

  // 图层
  //@ts-ignore
  const [layers, setLayers] = useState<Layer[]>(initLayers(mapData))
  const [layerGroups, setLayerGroups] = useState<LayerGroup[]>(initOtherLayers())
  const [trackLayers, setTrackLayerGroups] = useState<LayerGroup[]>(initTrackLayers())

  // 视图
  const [view, setView] = useState(initView)

  return (
    <div className={styles.mapContainerBox}>
      <MapBase
        layers={layers}
        setLayers={setLayers}
        setLayerGroups={setLayerGroups}
        layerGroups={layerGroups}
        trackLayers={trackLayers}
        setTrackLayerGroups={setTrackLayerGroups}
        controls={[]}
        view={view}
        setView={setView}
      />
    </div>
  )
}
export default MapContainer
