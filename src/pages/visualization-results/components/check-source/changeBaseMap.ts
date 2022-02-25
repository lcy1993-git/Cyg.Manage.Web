import TileLayer from 'ol/layer/Tile'
import Map from 'ol/Map'
import { XYZ } from 'ol/source'
import { getLayerByName } from '../../utils/methods'

export const changBaseMap = (type: number | string, url: string, map: Map) => {
  if (type === 1) {
    // 影像图层
    let imgLayer = getLayerByName('imgLayer', map.getLayers().getArray())
    imgLayer && map.removeLayer(imgLayer)
    imgLayer = new TileLayer({
      source: new XYZ({
        url: decodeURI(url),
      }),
      zIndex: 1,
      preload: 18,
    })
    imgLayer.set('name', 'imgLayer')
    map.addLayer(imgLayer)
  } else if (type === 2) {
    // 街道图层
    let vecLayer = getLayerByName('vecLayer', map.getLayers().getArray())
    vecLayer && map.removeLayer(vecLayer)
    vecLayer = new TileLayer({
      source: new XYZ({
        url: decodeURI(url),
      }),
      zIndex: 1,
      preload: 18,
    })
    vecLayer.set('name', 'vecLayer')
    map.addLayer(vecLayer)
  }
}
