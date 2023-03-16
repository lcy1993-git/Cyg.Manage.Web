import { getData, getExtent } from '@/services/visualization-results/visualization-results'
import { addPoint } from './addLayers'
import { INITLOCATION, INITZOOM, MAPAPPKEY, MAPAPPSECRET, STREETMAP } from './localData/mapConfig'

var map: any = null
var mapMovetimer: any
var mapMoveEnds: any = []
/**
 * 初始化地图
 * @param mapDivId 地图div的ID
 */
export const initMap = (mapDivId: string) => {
  SGMap.tokenTask.login(MAPAPPKEY, MAPAPPSECRET).then(() => {
    map = new SGMap.Map({
      // 地图绑定的DOM元素ID
      container: mapDivId,
      // 地图样式
      style: STREETMAP,
      // 默认缩放层级
      zoom: INITZOOM,
      // 地图中心点
      center: INITLOCATION,
      // 地图默认字体
      localIdeographFontFamily: 'Microsoft YoHei',
    })
    map.on('load', (e: any) => {
      addDatas(testData)
      map.on('moveend', (evt: any) => {})
    })
  })
}

/**
 * 刷新地图数据
 * @param projects 勾选的项目数组
 * @param layerTypes 勾选的图层类型数组
 * @returns
 */
export const refreshMap = async (projects: any, layerTypes: any) => {
  if (!projects || projects.length === 0 || !layerTypes || layerTypes.length === 0) {
    return
  }
  await getExtent({ layerTypes, projects }).then((data: any) => {
    if (data.content) {
      const minX = data.content.minX
      const minY = data.content.minY
      const maxX = data.content.maxX
      const maxY = data.content.maxY
      map.fitBounds([
        [minX, minY],
        [maxX, maxY],
      ])
    }
  })

  const bounds = map.getBounds()
  const extent = [bounds._sw.lng, bounds._sw.lat, bounds._ne.lng, bounds._ne.lat]

  let ids: any = []
  projects.forEach((item: any) => {
    ids.push({ id: item.id })
  })
  const params = {
    polygonCoordinates: [
      [extent[0], extent[1]],
      [extent[2], extent[1]],
      [extent[2], extent[3]],
      [extent[0], extent[3]],
      [extent[0], extent[1]],
    ],
    zoomLevel: Math.round(map.getZoom()),
    layerTypes: layerTypes,
    projects: ids,
  }

  mapMoveEnds.push(new Date())
  let startLength = mapMoveEnds.length
  mapMovetimer && clearInterval(mapMovetimer)
  mapMovetimer = setInterval(function () {
    if (startLength === mapMoveEnds.length) {
      const promise = getData(params)
      promise.then(async (data: any) => {
        addDatas(data)
      })
      mapMoveEnds = []
    } else {
      mapMovetimer && clearInterval(mapMovetimer)
    }
  }, 500)
}

/**
 * 加载勘察、设计、方案、拆除图层数据到地图中
 * @param res 接口返回的数据
 */
const addDatas = (res: any) => {
  if (!res || !res.content) return
  const datas = res.content
  datas.survey && addSurvey(datas.survey)
}

/**
 * 加载勘察图层中的所有数据
 * @param object 勘察数据
 */
const addSurvey = (object: any) => {
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      object[key] && addPoint(map, 'survey', key, object[key])
    }
  }
}
