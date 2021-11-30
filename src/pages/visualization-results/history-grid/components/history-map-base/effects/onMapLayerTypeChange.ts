import { Layer } from 'ol/layer'
import { Source } from 'ol/source'

/**
 * 处理当卫星图街道图变幻时的交互
 * @param mapLayerType
 * @param streetLayer
 */

export default function onMapLayerTypeChange(mapLayerType: string, streetLayer: Layer<Source>) {
  if (mapLayerType === 'satellite') {
    streetLayer.setVisible(false)
  } else {
    streetLayer.setVisible(true)
  }
}
