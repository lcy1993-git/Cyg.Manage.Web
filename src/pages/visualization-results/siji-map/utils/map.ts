import { getData, getExtent } from '@/services/visualization-results/visualization-results'
import { addCircle, addPoint } from './addLayers'
import { INITLOCATION, INITZOOM, MAPAPPKEY, MAPAPPSECRET, STREETMAP } from './localData/mapConfig'

var map: any = null
var _projects: any = []
var _layerTypes: any = []
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
      let limitBounds = map.getBounds()
      limitBounds._ne.lng = 148.0492565267187
      limitBounds._ne.lat = 54.401713588856296
      limitBounds._sw.lng = 67.54064736222216
      limitBounds._sw.lat = 19.23799341212711
      map.setMaxBounds(limitBounds)
      map.on('moveend', (evt: any) => {
        refreshMap(_projects, _layerTypes, false)
      })
    })
  })
}

/**
 * 刷新地图数据
 * @param projects 勾选的项目数组
 * @param layerTypes 勾选的图层类型数组
 * @returns
 */
export const refreshMap = async (projects: any, layerTypes: any, isLoad: boolean = true) => {
  _projects = projects
  _layerTypes = layerTypes
  if (!projects || projects.length === 0 || !layerTypes || layerTypes.length === 0) {
    clearDatas()
    return
  }

  if (isLoad) {
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
  }

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
        clickFeature()
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
  datas.plan && addplan(datas.plan)
  datas.design && addDesign(datas.design)
  datas.dismantle && addDismantle(datas.dismantle)
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

/**
 * 加载方案图层中的所有数据
 * @param object 勘察数据
 */
const addplan = (object: any) => {
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      object[key] && addPoint(map, 'plan', key, object[key])
    }
  }
}

/**
 * 加载勘察图层中的所有数据
 * @param object 勘察数据
 */
const addDesign = (object: any) => {
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      object[key] && addPoint(map, 'design', key, object[key])
    }
  }
}

/**
 * 加载勘察图层中的所有数据
 * @param object 勘察数据
 */
const addDismantle = (object: any) => {
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      object[key] && addPoint(map, 'dismantle', key, object[key])
    }
  }
}

/**
 * 点击事件
 */
const clickFeature = () => {
  const layers = map.getStyle().layers
  for (let index = 0; index < layers.length; index++) {
    const layer = layers[index]
    if (
      layer.id.includes('survey') ||
      layer.id.includes('plan') ||
      layer.id.includes('design') ||
      layer.id.includes('dismantle')
    ) {
      // eslint-disable-next-line no-loop-func
      map.on('click', layer.id, (e: any) => {
        const features = e.features
        const features_geojson = [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [features[0].properties.lon, features[0].properties.lat],
            },
            properties: features[0],
          },
        ]
        if (map.getLayer('highlight')) {
          // 设置小圆点数据
          map.getSource('highlight').setData({
            type: 'FeatureCollection',
            features: features_geojson,
          })
          map.moveLayer('highlight')
        } else {
          addCircle(map, 'highlight', features_geojson, 'orange')
          map.moveLayer('highlight')
        }
      })
    }
  }
}
/**
 * 清空地图数据
 */
const clearDatas = () => {
  const layers = map ? map.getStyle().layers : []
  for (let index = 0; index < layers.length; index++) {
    const layer = layers[index]
    if (
      layer.id.includes('survey') ||
      layer.id.includes('plan') ||
      layer.id.includes('design') ||
      layer.id.includes('dismantle')
    ) {
      map.getSource(layer.id).setData({
        type: 'FeatureCollection',
        features: [],
      })
    }
  }
}
