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
import { saveHistoryData } from '../../../service'
import {
  ElectricLineData,
  ElectricPointData,
  InterActionRef,
  MapRef,
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
}

export function refreshModify({
  interActionRef,
  mapRef,
  sourceRef,
  isDraw,
  mode: preMode,
}: InitModify) {
  if (!isDraw) return
  const mode = preMode === 'record' ? 'history' : 'design'
  let memoFeatures: Feature<Geometry>[] = []
  const modify = new Modify({
    features: new Collection([
      ...sourceRef.historyLineSource.getFeatures(),
      ...sourceRef.historyPointSource.getFeatures(),
      ...sourceRef.designLineSource.getFeatures(),
      ...sourceRef.designPointSource.getFeatures(),
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
    refreshModify({ interActionRef, mapRef, sourceRef, isDraw, mode: preMode })

  modify.on('modifystart', (e: ModifyEvent) => {
    const featureArr = e.features.getArray() as Feature<Geometry>[]
    memoFeatures = featureArr.map((f) => f.clone())
    sourceRef.highLightSource.addFeatures(featureArr)
    ;(mapRef.map.getTarget()! as HTMLCanvasElement).style.cursor = 'pointer'
  })

  modify.on('modifyend', (e: ModifyEvent) => {
    // 改变鼠标状态
    ;(mapRef.map.getTarget()! as HTMLCanvasElement).style.cursor = 'unset'

    const { pixel } = e.mapBrowserEvent

    const eventFeatures = e.features.getArray() as Feature<Geometry>[]

    const features = mapRef.map.getFeaturesAtPixel(pixel, {
      layerFilter: (f) =>
        f.get('name') === 'historyPointLayer' || f.get('name') === 'historyLineLayer',
    }) as Feature<Geometry>[]

    if (
      /**
       * 如果当前feature数量和高亮的feature数量不等
       * 说明当前modifyEnd的落点位于设备或者线路上
       * 对当前点位的状态进行边缘情况分析
       */
      features.length !== e.features.getLength()
    ) {
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
      } else {
        /**
         * 通过 isCheckAfterAdsorption 判断此处吸附是否合法，
         * 如果合法，则反馈用户是否需要吸附
         * 如果不合法，则直接视当前操作操作无吸附副作用
         */
        const isCheckAfterAdsorption = checkAfterAdsorption()

        if (isCheckAfterAdsorption) {
          /**
           * 该分支说明当前操作需要告知用户是否需要处理设备与线路吸附关系情况
           * 如果当前设备与线路需要吸附
           * 则按发布订阅模式进行预patch，由回调方式进行按需处理
           */
          return
        }
      }
    }
    // 保存操作
    saveOperation(eventFeatures, refreshModifyCallBack)
    // 清楚高亮
    sourceRef.highLightSource.clear()
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
      if (++pointNum >= 2) {
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
      const [x1, y1, x2, y2] = (features[i].getGeometry() as LineString).flatCoordinates
      if (x1 === x2 && y1 === y2) {
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
function revokeCurrentModify({
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

function checkAfterAdsorption(): boolean {
  return false
}

/**
 * 将修改的数据保存到服务器
 * @param {Feature<Geometry>[]} eventFeatures
 * @param {()=> void} refreshModifyCallBack
 */
function saveOperation(
  eventFeatures: Feature<Geometry>[],
  refreshModifyCallBack: () => void
): void {
  const updateHistoryData: UpdateHistoryData = {
    equipments: [],
    lines: [],
    toBeDeletedEquipmentIds: [],
    toBeDeletedLineIds: [],
  }
  // 遍历被修改的元素
  eventFeatures.forEach((f) => {
    const geometry = f.getGeometry() as LineString | Point
    const { ...resData } = f.getProperties()
    if (geometry.getType() === 'Point') {
      const [lng, lat] = proj.transform(
        geometry.getCoordinates() as number[],
        'EPSG:3857',
        'EPSG:4326'
      )
      Object.assign(resData, { lng, lat })
      updateHistoryData.equipments.push(resData as ElectricPointData)
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
    }
  })
  // 将新的数据传递给服务器
  saveHistoryData(updateHistoryData).then((res) => {
    if (!(res.code === 200 && res.isSuccess === true)) {
      message.error('操作失败，服务器未响应')
      refreshModifyCallBack()
    }
  })
}
