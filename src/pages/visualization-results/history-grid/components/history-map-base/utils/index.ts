import { message } from 'antd'
import JsonP from 'jsonp'
import { Feature } from 'ol'
import Geometry from 'ol/geom/Geometry'
import { Select } from 'ol/interaction'
import * as proj from 'ol/proj'
import { getStyle } from '../styles'
import { InterActionRef, SourceRef, ViewRef } from '../typings'
import { DataSource } from './../typings/index'

// 清空选择器和高亮图层
export const clear = (sourceRef: SourceRef) => {
  sourceRef.historyPointSource.clear()
  sourceRef.historyLineSource.clear()
  sourceRef.designPointSource.clear()
  sourceRef.designLineSource.clear()
}

/**
 * 清空地图上现有的所有选择器以及所有图层的Feature元素
 * @param {InterActionRef} interActionRef
 */
// export const clearScreen = (interActionRef: InterActionRef) => {
//   clear(interActionRef)
//   interActionRef.source!.clear()
//   interActionRef?.designSource.clear()
// }

// 获取元素类型
export function getGeometryType(f: Feature<Geometry>) {
  return f.getGeometry()!.getType()
}

// 添加高亮样式
export function addHightStyle(fs: Feature<Geometry>[], showText) {
  return fs.map((f) => {
    const sourceType = f.get('sourceType')
    const geometryType = getGeometryType(f)
    f.setStyle(
      getStyle(geometryType)(
        sourceType,
        f.get('typeStr') || '无类型',
        f.get('name'),
        showText,
        true
      )
    )
    return f
  })
}

// 讲feature转为Data数组
export function getDataByFeature(f: Feature<Geometry>[]) {
  return f.map((f) => {
    const { geometry, ...props } = f.getProperties()
    return props
  })
}

// 定位当前用户位置；调用的是百度定位api
export const checkUserLocation = (viewRef: ViewRef) => {
  JsonP(
    `https://map.baidu.com?qt=ipLocation&t=${new Date().getTime()}`,
    {},
    function (err: any, res: any) {
      if (err) {
        message.error('获取的位置信息无效，无法定位')
      } else {
        if (res?.rgc?.status === 'success' && res?.rgc?.result?.location?.lat) {
          const lat = parseFloat(res?.rgc?.result?.location?.lat)
          const lng = parseFloat(res?.rgc?.result?.location?.lng)
          moveToViewByLocation(viewRef, [lat, lng])
          // if (!isNaN(lat) && !isNaN(lng)) {
          //   viewRef.view.setCenter(proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857'))
          // } else {
          //   message.error('获取的位置信息无效，无法定位')
          // }
        } else {
          message.error('获取当前位置信息失败')
        }
      }
    }
  )
}

export function moveToViewByLocation(viewRef: ViewRef, [lng, lat]: [number, number]) {
  if (!isNaN(lat) && !isNaN(lng)) {
    viewRef.view.setCenter(proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857'))
  } else {
    message.error('获取的位置信息有误，无法定位')
  }
}

export function getFillColorByMode(mode: string) {
  return mode === 'preDesign' ? 'rgba(20, 168, 107, 1)' : 'rgba(0, 117, 206, 1)'
}

/**
 * 校准数据的合法性 判断是否有重复id
 * @param data
 * @param interActionRef
 * @returns
 */
export function isValidationData(data: DataSource, interActionRef: InterActionRef): boolean {
  const historyIds = interActionRef.source!.getFeatures().map((f) => f.get('id'))

  const designIds = interActionRef.designSource!.getFeatures().map((f) => f.get('id'))

  const dataIds = getIdsByDataSource(data)
  for (let i = 0; i < dataIds.length; i++) {
    if (historyIds.includes(dataIds[i]) || designIds.includes(dataIds[i])) {
      message.error(`数据导入失败，不能重复导入, 发现重复数据ID——${dataIds[i]}`)
      return false
    }
  }

  return true
}

/**
 * 根据数据源获取ids
 * @param data
 * @returns
 */
function getIdsByDataSource(data: DataSource) {
  const lineArr = Array.isArray(data?.lines) ? data?.lines : []
  const equipmentArr = Array.isArray(data?.equipments) ? data?.equipments : []
  return [...lineArr, ...equipmentArr].map((o) => o.id)
}

export function getSelectByType(
  interActionRef: InterActionRef,
  showText: boolean,
  isDraw: boolean
): Select | undefined {
  if (isDraw === false && showText === false) {
    return interActionRef.select.viewNoTextSelect
  }
  if (isDraw === false && showText === true) {
    return interActionRef.select.viewTextSelect
  }
  if (isDraw === true && showText === false) {
    return interActionRef.select.drawNoTextSelect
  }
  if (isDraw === true && showText === true) {
    return interActionRef.select.drawTextSelect
  }
  return
}
