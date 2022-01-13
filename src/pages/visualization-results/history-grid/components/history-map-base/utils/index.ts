import { message } from 'antd'
import JsonP from 'jsonp'
import { Feature } from 'ol'
import Geometry from 'ol/geom/Geometry'
import { Select } from 'ol/interaction'
import * as proj from 'ol/proj'
import { handlerGeographicSize } from '../effects'
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

interface ClearScreenOps {
  sourceRef: SourceRef
  interActionRef: InterActionRef
}
/**
 * 清屏
 * @param {ClearScreenOps} param0
 */
export function clearScreen({ sourceRef, interActionRef }: ClearScreenOps) {
  sourceRef.historyPointSource.clear()
  sourceRef.historyLineSource.clear()
  sourceRef.designPointSource.clear()
  sourceRef.designLineSource.clear()
  interActionRef.select.currentSelect?.getFeatures().clear()
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
export function addHightStyle(fs: Feature<Geometry>[], showText: boolean) {
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
    `https://api.map.baidu.com/location/ip?ak=Oj5krytGMikcHSm6VLVnGVdGVHQ7xy4r&coor=bd09ll`,
    {},
    function (err: any, res: any) {
      if (err) {
        message.error('获取的位置信息无效，无法定位')
      } else {
        const point = res?.content?.point
        if (point?.x && point?.y) {
          viewRef.view.animate({
            center: proj.transform([point.x, point.y], 'EPSG:4326', 'EPSG:3857'),
            zoom: 12.5,
            duration: 600,
          })
          // viewRef.view.setCenter(proj.transform([point.x, point.y], 'EPSG:4326', 'EPSG:3857'))
        } else {
          message.error('获取当前位置信息失败')
        }
      }
    }
  )
}

export function moveToViewByLocation(viewRef: ViewRef, [lng, lat]: [number, number], mode: string) {
  if (!isNaN(lat) && !isNaN(lng)) {
    viewRef.view.setCenter(proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857'))
    viewRef.view.setZoom(12.5)
    handlerGeographicSize({ mode, viewRef })
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

/**
 * @description
 * 根据多个图层点位位置计算当前自适应屏幕位置
 * sx, sy表示左上角位置坐标, bx, by表示右下角的位置坐标
 * @param {number[]} a0 图层位置信息
 * @param {number[][]} args 其他图层的位置信息
 * @returns {number[]} 适应屏幕的尺寸位置
 * @example
 * const a = [[0, 1], [5, 6]] as ExtendUnit
 * const b = [[2, 0], [4, 5]] as ExtendUnit
 * getFitExtend(a, b) ---> [[0, 0], [5, 6]]
 */
export function getFitExtend(a0: number[] | false, ...args: (number[] | false)[]): number[] {
  const first = a0 ? a0 : [Infinity, Infinity, -Infinity, -Infinity]
  if (!args.length) return first
  let [sx, sy, bx, by] = first
  args.forEach((item) => {
    if (item) {
      const [sx1, sy1, bx1, by1] = item
      sx = Math.min(sx, sx1)
      sy = Math.min(sy, sy1)
      bx = Math.max(bx, bx1)
      by = Math.max(by, by1)
    }
  })
  // 自适应屏幕下向外扩大0.1倍
  const shrinkUnitX = (bx - sx) * 0.1
  const shrinkUnitY = (by - sy) * 0.1
  return [sx - shrinkUnitX, sy - shrinkUnitY, bx + shrinkUnitX, by + shrinkUnitY]
}
