import { Layer } from 'ol/layer'

export default function onMapLayerTypeChange(
  mapLayerType: string,
  vecLayer: Layer,
  streetLayer: Layer
) {
  if (mapLayerType === 'SATELLITE') {
    vecLayer.setVisible(true)
    streetLayer.setVisible(false)
  } else {
    vecLayer.setVisible(false)
    streetLayer.setVisible(true)
  }
}
