import TileLayer from 'ol/layer/Tile'
import Map from 'ol/Map'
import XYZ from 'ol/source/XYZ'
import { getLayerByName } from '../../utils/methods'

export const changBaseMap = (type: number | string, url: string, map: Map) => {
  let imgLayer = getLayerByName('imgLayer', map.getLayers().getArray())
  let vecLayer = getLayerByName('vecLayer', map.getLayers().getArray())
  if (type === 1 || type === 3) {
    // 影像(卫星)图层
    imgLayer && map.removeLayer(imgLayer)
    imgLayer = new TileLayer({
      source: new XYZ({
        url: decodeURI(url),
      }),
      zIndex: 0,
      preload: 18,
    })
    imgLayer.set('name', 'imgLayer')
    map.addLayer(imgLayer)
    imgLayer?.setVisible(true)
    vecLayer?.setVisible(false)
  } else if (type === 2) {
    // 街道图层
    vecLayer && map.removeLayer(vecLayer)
    vecLayer = new TileLayer({
      source: new XYZ({
        url: decodeURI(url),
      }),
      zIndex: 0,
      preload: 18,
    })
    vecLayer.set('name', 'vecLayer')
    map.addLayer(vecLayer)
    imgLayer?.setVisible(false)
    vecLayer?.setVisible(true)
  }
}
