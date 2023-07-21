import Map from 'ol/Map'
import * as extent from 'ol/extent'
import TileLayer from 'ol/layer/Tile'
import * as proj from 'ol/proj'
import { XYZ, WMTS as sourceWmts } from 'ol/source'
import tilegridWmts from 'ol/tilegrid/WMTS'
import { getLayerByName } from '../../utils/methods'

export const changBaseMap = (type: number | string, url: string, map: Map) => {
  let imgLayer = getLayerByName('imgLayer', map.getLayers().getArray())
  let vecLayer = getLayerByName('vecLayer', map.getLayers().getArray())
  let resolutions, projection, projectionExtent, size, matrixIds
  if (type === 1 || type === 3) {
    // 影像(卫星)图层
    imgLayer && map.removeLayer(imgLayer)

    if (url.includes('tianditu')) {
      url = 'http://t{0-7}.tianditu.gov.cn/img_c/wmts?tk=88b666f44bb8642ec5282ad2a9915ec5'
      //分辨率数组
      resolutions = []
      //瓦片大小
      // var tileSize = 256
      //坐标系信息
      projection = proj.get('EPSG:4326')
      //获取当前坐标系的范围

      projectionExtent = projection.getExtent()
      size = extent.getWidth(projectionExtent) / 256
      matrixIds = new Array(18)
      //初始化分辨率数组
      for (let i = 0; i < 18; i++) {
        resolutions[i] = size / Math.pow(2, i)
        matrixIds[i] = i
      }
      imgLayer = new TileLayer({
        source: new sourceWmts({
          url: url,
          layer: 'img',
          matrixSet: 'c',
          format: 'tiles',
          style: 'default',
          projection: projection,
          tileGrid: new tilegridWmts({
            origin: extent.getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds,
          }),
          wrapX: false,
        }),
      })
    } else {
      imgLayer = new TileLayer({
        source: new XYZ({
          url: decodeURI(url),
        }),
        // maxZoom: 18,
        preload: 18,
      })
    }

    imgLayer.set('name', 'imgLayer')
    map.addLayer(imgLayer)
    imgLayer?.setVisible(true)
    vecLayer?.setVisible(false)
  } else if (type === 2) {
    // 街道图层
    vecLayer && map.removeLayer(vecLayer)

    if (url.includes('tianditu')) {
      url = 'http://t{0-7}.tianditu.gov.cn/vec_c/wmts?tk=88b666f44bb8642ec5282ad2a9915ec5'
      //分辨率数组
      resolutions = []
      //瓦片大小
      // var tileSize = 256
      //坐标系信息
      projection = proj.get('EPSG:4326')
      //获取当前坐标系的范围

      projectionExtent = projection.getExtent()
      size = extent.getWidth(projectionExtent) / 256
      matrixIds = new Array(18)
      //初始化分辨率数组
      for (let i = 0; i < 18; i++) {
        resolutions[i] = size / Math.pow(2, i)
        matrixIds[i] = i
      }
      vecLayer = new TileLayer({
        source: new sourceWmts({
          url: url,
          layer: 'vec',
          matrixSet: 'c',
          format: 'tiles',
          style: 'default',
          projection: projection,
          tileGrid: new tilegridWmts({
            origin: extent.getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds,
          }),
          wrapX: false,
        }),
      })
    } else {
      vecLayer = new TileLayer({
        source: new XYZ({
          url: decodeURI(url),
        }),
        zIndex: 0,
        preload: 18,
      })
    }

    vecLayer.set('name', 'vecLayer')
    map.addLayer(vecLayer)
    imgLayer?.setVisible(false)
    vecLayer?.setVisible(true)
  }
}
