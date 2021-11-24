import { Layer } from 'ol/layer'
import { Source } from 'ol/source'

/**
 * 处理当卫星图街道图变幻时的交互
 * @param mapLayerType
 * @param vecLayer
 * @param streetLayer
 */

export default function onMapLayerTypeChange(
  mapLayerType: string,
  vecLayer: Layer<Source>,
  streetLayer: Layer<Source>
) {
  if (mapLayerType === 'satellite') {
    vecLayer.setVisible(true)
    streetLayer.setVisible(false)
  } else {
    vecLayer.setVisible(false)
    streetLayer.setVisible(true)
  }
}
