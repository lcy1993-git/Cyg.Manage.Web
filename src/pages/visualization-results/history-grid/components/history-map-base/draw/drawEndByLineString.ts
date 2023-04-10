import { Feature } from 'ol'
import { Coordinate } from 'ol/coordinate'
import LineString from 'ol/geom/LineString'
import * as proj from 'ol/proj'
import { saveData, saveHistoryData } from '../../../service'
import { DrawProps, ElectricLineData, SourceRef, UpdateHistoryData } from '../typings'
export interface DrawEndByLineStringProps {
  sourceRef: SourceRef
  drawProps: DrawProps
  formData: any
  mode: string
  preId?: string
  reFetchDraw: () => void
}

export function drawEndByLineString({
  formData,
  sourceRef,
  drawProps,
  mode,
  preId,
  reFetchDraw,
}: DrawEndByLineStringProps) {
  const currentState = drawProps.currentState as Coordinate[]

  // 需要传递给后台的数据
  const updateHistoryData: UpdateHistoryData = {
    equipments: [],
    lines: [],
    toBeDeletedEquipmentIds: [],
    toBeDeletedLineIds: [],
  }
  // 添加到其他图层中的数据
  const features: Feature<LineString>[] = []

  // 收集数据
  for (let i = 1, len = currentState.length; i < len; i++) {
    const pre = currentState[i - 1]
    const current = currentState[i]
    const isSamePoint = compareCoordinate(pre, current)
    if (!isSamePoint) {
      features.push(
        new Feature({
          geometry: new LineString([[...pre], [...current]]),
        })
      )
      const [startLng, startLat] = transform(pre)
      const [endLng, endLat] = transform(current)
      updateHistoryData.lines.push({
        ...formData,
        startLng,
        startLat,
        endLng,
        endLat,
      })
    }
  }

  // 记录在点位上的线
  const pointListInLine = new Map<Feature<LineString>, number[][]>()

  // 处理点位吸附情况,如有则收集到pointListInLine
  currentState.forEach((cur: number[]) => {
    const features =
      mode === 'history'
        ? sourceRef.historyLineSource.getFeatures()
        : sourceRef.designLineSource.getFeatures()
    features.forEach((f) => {
      const fx = f.getGeometry()?.getCoordinates() as number[][]
      const isPointOnLine = pointOnLine(cur, fx)
      if (isPointOnLine) {
        if (pointListInLine.has(f)) {
          pointListInLine.set(f, [...pointListInLine.get(f)!, cur])
        } else {
          pointListInLine.set(f, [cur])
        }
      }
    })
  })

  for (let [k, v] of pointListInLine.entries()) {
    const id = k.get('id')
    const [start, end] = k.getGeometry()!.getCoordinates() as Coordinate[]
    if (v.length > 1) {
      const { ...geometryData } = k.getProperties()

      v.sort(
        (a, b) =>
          (start[0] - a[0]) ** 2 +
          (start[1] - a[1]) ** 2 -
          ((start[0] - b[0]) ** 2 + (start[1] - b[1]) ** 2)
      )

      // 添加被打断的数据
      v.forEach((item, index) => {
        if (index > 0) {
          const [startLng, startLat] = transform(v[index - 1])
          const [endLng, endLat] = transform(item)
          updateHistoryData.lines.push({
            ...formData,
            startLng,
            startLat,
            endLng,
            endLat,
          })
        }
      })
      // 添加被打断的原有数据
      if (!compareCoordinate(start, v[0])) {
        const [startLng, startLat] = transform(start)
        const [endLng, endLat] = transform(v[0])
        updateHistoryData.lines.push({
          ...(geometryData as ElectricLineData),
          startLng,
          startLat,
          endLng,
          endLat,
        })
      }

      if (!compareCoordinate(start, v[0])) {
        const [startLng, startLat] = transform(v[v.length - 1])
        const [endLng, endLat] = transform(end)
        updateHistoryData.lines.push({
          ...(geometryData as ElectricLineData),
          startLng,
          startLat,
          endLng,
          endLat,
        })
      }
    } else if (v.length === 1) {
      const pointsInLineBySort: number[][] = [start, ...v, end]
      // 追加打断的数据
      for (let i = 1, len = pointsInLineBySort.length; i < len; i++) {
        const [startLng, startLat] = transform(pointsInLineBySort[i - 1])
        const [endLng, endLat] = transform(pointsInLineBySort[i])
        updateHistoryData.lines.push({
          ...formData,
          startLng,
          startLat,
          endLng,
          endLat,
        })
      }
    }

    // 删除原有被打断线段
    updateHistoryData.toBeDeletedLineIds.push(id)
  }

  const save = mode === 'history' ? saveHistoryData : saveData
  const idProps = mode === 'history' ? {} : { id: preId! }
  save({ ...updateHistoryData, ...idProps }).then(() => {
    reFetchDraw()
  })

  sourceRef.drawSource.clear()
}

/**
 * 比较前一个点位跟当前点位是否一致
 * 当一致时,可能会绘制点位相同的bug
 * 所以必须在点位进行绘制时提前判断该点位是否重复
 */
function compareCoordinate(pre: Coordinate, cur: Coordinate) {
  return pre[0] === cur[0] && pre[1] === cur[1]
}

// 点位转换3857 => 经纬度
export function transform(point: number[]) {
  return proj.transform(point, 'EPSG:3857', 'EPSG:4326')
}

// 判断点位是否在直线上
export function pointOnLine(p: number[], l: number[][]) {
  const isPointInRect = pointInRect(p, l)
  return (
    isPointInRect && Math.abs(getLength(p, l[0]) + getLength(p, l[1]) - getLength(l[0], l[1])) < 1
  )
  // 获取两点之间的距离
  function getLength(p1: number[], p2: number[]) {
    const [x0, y0] = p1
    const [x1, y1] = p2
    return Math.sqrt((x0 - x1) ** 2 + (y0 - y1) ** 2)
  }
  // 判断当前点位是否在直线生成的矩形框内
  function pointInRect(p: number[], l: number[][]): boolean {
    const [px, py] = p
    const [[l0x, l0y], [l1x, l1y]] = l
    return (
      px > Math.min(l0x, l1x) &&
      px < Math.max(l0x, l1x) &&
      py > Math.min(l0y, l1y) &&
      py < Math.max(l0y, l1y)
    )
  }
}
