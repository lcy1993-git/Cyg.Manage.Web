import { message } from 'antd'
import { Collection, Feature, MapBrowserEvent } from 'ol'
import { never } from 'ol/events/condition'
import Geometry from 'ol/geom/Geometry'
import LineString from 'ol/geom/LineString'
import Point from 'ol/geom/Point'
import { Modify, Snap } from 'ol/interaction'
import { ModifyEvent } from 'ol/interaction/Modify'
import * as proj from 'ol/proj'
import RenderFeature from 'ol/render/Feature'
import { saveData, saveHistoryData } from '../../../service'
import {
  ElectricLineData,
  ElectricPointData,
  InterActionRef,
  MapRef,
  ModifyProps,
  SourceRef,
  UpdateHistoryData,
} from '../typings'
import { getTypeByGeometry } from '../utils'

interface InitModify {
  interActionRef: InterActionRef
  mapRef: MapRef
  sourceRef: SourceRef
  isDraw: boolean
  mode: string
  modifyProps: ModifyProps
  preId: string | undefined
}

export function refreshModify({
  interActionRef,
  mapRef,
  sourceRef,
  isDraw,
  mode: preMode,
  modifyProps,
  preId,
}: InitModify) {
  if (!isDraw) return

  const mode = preMode === 'record' ? 'history' : 'design'

  let memoFeatures: Feature<Geometry>[] = []
  const modify = new Modify({
    features: new Collection([
      ...sourceRef[`${mode}LineSource`].getFeatures(),
      ...sourceRef[`${mode}PointSource`].getFeatures(),
    ]),
    // condition: primaryAction,
    condition: (e: MapBrowserEvent<PointerEvent>) => {
      const pointerEvent = e.originalEvent
      return pointerEvent.isPrimary && pointerEvent.button === 0
    },
    insertVertexCondition: never,
    style() {
      return undefined
    },
  })

  const refreshModifyCallBack = () =>
    refreshModify({ interActionRef, mapRef, sourceRef, isDraw, mode: preMode, modifyProps, preId })

  modify.on('modifystart', (e: ModifyEvent) => {
    const featureArr = e.features.getArray() as Feature<Geometry>[]
    memoFeatures = featureArr.map((f) => f.clone())
    sourceRef.highLightSource.addFeatures(featureArr)
    ;(mapRef.map.getTarget()! as HTMLCanvasElement).style.cursor = 'pointer'
  })

  modify.on('modifyend', (e: ModifyEvent) => {
    // 改变鼠标状态
    ;(mapRef.map.getTarget()! as HTMLCanvasElement).style.cursor = 'unset'

    const { pixel, coordinate } = e.mapBrowserEvent

    const eventFeatures = e.features.getArray() as Feature<Geometry>[]

    const features = mapRef.map.getFeaturesAtPixel(pixel, {
      layerFilter: (f) =>
        f.get('name') === `${mode}PointLayer` || f.get('name') === `${mode}LineLayer`,
    }) as Feature<Geometry | Point | LineString>[]

    if (
      // 如果eFeature和feature相等说明可以直接保存数据 不需要进行特殊逻辑操作
      eventFeatures.length !== features.length
    ) {
      /**
       * 通过 isCheckAfterAdsorption 判断此处吸附是否合法，
       * 如果合法，则反馈用户是否需要吸附
       * 如果不合法，则直接视当前操作操作无吸附副作用
       */
      if (
        // 当点位重合时的情况处理
        checkRepeatPoint(features) ||
        // 当有线路重合,或线路长度为0时的情况
        checkRepeatLine(features)
      ) {
        // 撤销该次操作
        revokeCurrentModify({
          features: eventFeatures,
          memoFeatures,
          sourceRef,
          mode,
          refreshModifyCallBack,
        })
        return
      } else if (
        // 判断是否需要吸附操作
        needSpecialOperation(eventFeatures, features, coordinate)
      ) {
        /**
         * 该分支说明当前操作需要告知用户是否需要处理设备与线路吸附关系情况
         * 如果当前设备与线路需要吸附
         */
        modifyProps.visible = true
        modifyProps.position = [...pixel]
        modifyProps.currentState = {
          eventFeatures,
          atPixelFeatures: features,
          coordinate,
          refreshModifyCallBack,
        }
        return
      }
    }
    // 保存操作
    saveOperation(eventFeatures, refreshModifyCallBack, sourceRef, modifyProps, mode, preId)
  })

  // 移除前一个modify
  if (interActionRef.modify) {
    mapRef.map.removeInteraction(interActionRef.modify)
  }
  interActionRef.modify = modify
  mapRef.map.addInteraction(interActionRef.modify)

  const snap = new Snap({
    features: new Collection([
      ...sourceRef.historyLineSource.getFeatures(),
      ...sourceRef.historyPointSource.getFeatures(),
      ...sourceRef.designLineSource.getFeatures(),
      ...sourceRef.designPointSource.getFeatures(),
    ]),
  })

  if (interActionRef.snap) {
    mapRef.map.removeInteraction(interActionRef.snap)
  }
  interActionRef.snap = snap
  mapRef.map.addInteraction(interActionRef.snap)
}

/**
 * 校验是否有重复点位如果有则返回true,否则返回false
 * @param features
 * @returns
 */
function checkRepeatPoint(features: (RenderFeature | Feature<Geometry>)[]) {
  let pointNum = 0
  for (let i = 0, len = features.length; i < len; i++) {
    if (features[i].getGeometry()?.getType() === 'Point') {
      pointNum++

      if (pointNum > 1) {
        message.error('该点已存在其他电气设备，请检查后重试')
        return true
      }
    }
  }
  return false
}

/**
 * 校验是否有重复线段，或者长度为0的线段，是则返回true,否则返回false
 * @param features
 * @returns
 */
function checkRepeatLine(features: (RenderFeature | Feature<Geometry>)[]): boolean {
  let lineObject = {}
  for (let i = 0, len = features.length; i < len; i++) {
    if (features[i].getGeometry()?.getType() === 'LineString') {
      const [x1, y1, x2, y2] = [
        features[i]?.get('startLng'),
        features[i]?.get('startLat'),
        features[i]?.get('endLng'),
        features[i]?.get('endLat'),
      ]
      if (isEqual(x1, x2) && isEqual(y1, y2)) {
        message.error('线段首尾端重合，请检查后重试')
        return true
      }

      const key = (x1 > x2 ? [x1, y1, x2, y2] : [x2, y2, x1, y1]).toString()
      if (key in lineObject) {
        message.error('当前线段存在重叠部分，请检查后重试')
        return true
      } else {
        lineObject[key] = null
      }
    }
  }

  return false
}

interface RevokeCurrentModifyOptions {
  features: Feature<Geometry>[]
  memoFeatures: Feature<Geometry>[]
  sourceRef: SourceRef
  mode: string
  refreshModifyCallBack: () => void
}
/**
 * 撤销本次操作回退到编辑前的操作
 * @param {RevokeCurrentModifyOptions} param0
 */
export function revokeCurrentModify({
  features,
  memoFeatures,
  sourceRef,
  mode,
  refreshModifyCallBack,
}: RevokeCurrentModifyOptions) {
  // const ids = memoFeatures.map((f) => f.get('id'))

  features.forEach((f) => {
    sourceRef[`${mode + getTypeByGeometry(f)}Source`].removeFeature(f)
  })
  memoFeatures.forEach((f) => {
    sourceRef[`${mode + getTypeByGeometry(f)}Source`].addFeature(f)
  })
  refreshModifyCallBack()
  // 清楚高亮
  sourceRef.highLightSource.clear()
}

/**
 * 保存操作，将数据保存到服务器
 * @param {Feature<Geometry>[]} eventFeatures
 * @param {()=> void} refreshModifyCallBack
 */
export function saveOperation(
  eventFeatures: Feature<Geometry>[],
  refreshModifyCallBack: () => void,
  sourceRef: SourceRef,
  modifyProps: ModifyProps,
  mode: string,
  preId: string | undefined
): void {
  const updateHistoryData: UpdateHistoryData = {
    equipments: [],
    lines: [],
    toBeDeletedEquipmentIds: [],
    toBeDeletedLineIds: [],
  }

  /**
   * 本地数据副作用操作
   * 在上传服务器之前应同步本地数据
   * 若上传服务器失败，则还原当前数据
   * @effectLocalFeature 记录当前更新信息与还原信息
   */
  const effectLocalFeatures: any[] = []

  // 遍历被修改的元素
  eventFeatures.forEach((f) => {
    const geometry = f.getGeometry() as LineString | Point
    const { geometry: _, ...resData } = f.getProperties()

    if (geometry.getType() === 'Point') {
      const [lng, lat] = proj.transform(
        geometry.getCoordinates() as number[],
        'EPSG:3857',
        'EPSG:4326'
      )
      Object.assign(resData, { lng, lat })
      updateHistoryData.equipments.push(resData as ElectricPointData)
      effectLocalFeatures.push({
        feature: f,
        old: { lng: resData.lng, lat: resData.lat },
        new: { lng, lat },
      })
    } else if (geometry.getType() === 'LineString') {
      const [startLng, startLat] = proj.transform(
        geometry.getCoordinates()[0] as number[],
        'EPSG:3857',
        'EPSG:4326'
      )

      const [endLng, endLat] = proj.transform(
        geometry.getCoordinates()[1] as number[],
        'EPSG:3857',
        'EPSG:4326'
      )

      Object.assign(resData, { startLng, startLat, endLng, endLat })
      updateHistoryData.lines.push(resData as ElectricLineData)
      effectLocalFeatures.push({
        feature: f,
        old: {
          startLng: resData.lng,
          startLat: resData.lat,
          endLng: resData.lng,
          endLat: resData.lat,
        },
        new: { startLng, startLat, endLng, endLat },
      })
    }
  })

  // 将新值给Effect
  effectLocalFeatures.forEach((item) => {
    for (let k in item.new) {
      item.feature.set(k, item.new[k])
    }
  })

  // 清楚高亮
  sourceRef.highLightSource.clear()

  // 将新的数据传递给服务器
  const messageError = (e: any) => {
    if (e?.message) {
      message.error(e.message)
      refreshModifyCallBack()
    }
  }
  const save = mode === 'history' ? saveHistoryData : saveData
  const idProps = mode === 'history' ? {} : { id: preId! }
  save({ ...updateHistoryData, ...idProps })
    .then(messageError)
    .catch(messageError)
}

/**
 * 是否需要进行特殊操作
 * 当落点处有额外的线路，且不为线路的端点时，需要进行特殊操作
 * @param eventFeatures
 * @param features
 */
function needSpecialOperation(
  eventFeatures: Feature<Geometry | Point | LineString>[],
  features: Feature<Geometry | Point | LineString>[],
  coordinate: number[]
): boolean {
  const eventFeaturesIds = eventFeatures.map((f) => f.get('id'))

  const otherFeature = features.filter(
    (f) => !eventFeaturesIds.includes(f.get('id')) && f.getGeometry()?.getType() === 'LineString'
  )

  const pixel = proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326')

  // 判断当前操作点位是否再线段的中间
  return otherFeature.some(
    (f) =>
      !(
        (isEqual(f.get('startLng'), pixel[0]) && isEqual(f.get('startLat'), pixel[1])) ||
        (isEqual(f.get('endLng'), pixel[0]) && isEqual(f.get('endLat'), pixel[1]))
      )
  )
}

// 判断是否相等, 取10位有效值
function isEqual(n1: number, n2: number): boolean {
  return Math.abs(n1 - n2) < 1e-10
}
