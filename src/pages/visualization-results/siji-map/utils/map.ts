import { addPoint } from './addLayers'
import { testData } from './localData/data'
import { INITLOCATION, INITZOOM, MAPAPPKEY, MAPAPPSECRET, STREETMAP } from './localData/mapConfig'
var map: any = null // 地图对象

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
    })
  })
}

/**
 * 加载勘察、设计、方案、拆除图层数据到地图中
 * @param res 接口返回的数据
 */
export const addDatas = (res: any) => {
  if (!res || !res.content) return
  const datas = res.content
  datas.survey && addSurvey(datas.survey)
}

/**
 * 加载勘察图层中的所有数据
 * @param object 勘察数据
 */
export const addSurvey = (object: any) => {
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      addPoint(map, 'survey', key, object[key])
    }
  }
}
