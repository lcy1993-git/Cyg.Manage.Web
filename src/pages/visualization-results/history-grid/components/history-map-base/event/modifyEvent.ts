import { message } from 'antd/es'
import { Feature } from 'ol'
import LineString from 'ol/geom/LineString'
import Point from 'ol/geom/Point'
import * as proj from 'ol/proj'
import { saveOperation } from '.'
import { saveHistoryData } from '../../../service'
import {
  ElectricLineData,
  ElectricPointData,
  ModifyCurrentState,
  ModifyProps,
  SourceRef,
  UpdateHistoryData,
} from './../typings'
interface AdsorptionOptions {
  modifyProps: ModifyProps
  sourceRef: SourceRef
  reFetchData: () => void
}
/**
 *
 * @param param0
 * @param needAdsorption
 */
export function needAdsorption(
  { modifyProps, sourceRef, reFetchData }: AdsorptionOptions,
  needAdsorption: boolean
) {
  const { eventFeatures, refreshModifyCallBack } = modifyProps.currentState!
  if (needAdsorption) {
    saveAdsorptionOperation(modifyProps.currentState!, sourceRef, modifyProps, reFetchData)
  } else {
    saveOperation(eventFeatures, refreshModifyCallBack, sourceRef, modifyProps)
  }
  // setModifyProps({
  //   visible: false,
  //   position: [0, 0],
  //   currentState: null,
  // })
}
/**
 * 不吸附时候的点击事件
 * @param param0
 */
export function needNotAdsorption({ modifyProps, sourceRef }: AdsorptionOptions) {
  const { eventFeatures, refreshModifyCallBack } = modifyProps.currentState!
  saveOperation(eventFeatures, refreshModifyCallBack, sourceRef, modifyProps)
  modifyProps.visible = false
  modifyProps.position = [0, 0]
  modifyProps.currentState = null
  // setModifyProps({
  //   visible: false,
  //   position: [0, 0],
  //   currentState: null,
  // })
}

/**
 * 吸附保存操作，将数据保存到服务器
 * @param eventFeatures
 * @param refreshModifyCallBack
 * @param sourceRef
 */
function saveAdsorptionOperation(
  currentState: ModifyCurrentState,
  sourceRef: SourceRef,
  modifyProps: ModifyProps,
  reFetchData: () => void
) {
  const { eventFeatures, atPixelFeatures, coordinate, refreshModifyCallBack } = currentState

  const [lng, lat] = proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326')

  const ids = eventFeatures.map((f) => f.get('id'))

  const otherFeatures = atPixelFeatures.filter((f) => {
    return !ids.includes(f.get('id')) && f.getGeometry()?.getType() === 'LineString'
  }) as Feature<LineString>[]

  if (otherFeatures.length > 0) {
    const updateHistoryData: UpdateHistoryData = {
      equipments: [],
      lines: [],
      toBeDeletedEquipmentIds: [],
      toBeDeletedLineIds: [],
    }

    // 遍历被打断的元素
    otherFeatures.forEach((f) => {
      const lineCoordinates = f.getGeometry()!.getCoordinates()
      // 先判断操作的coordinate不是为线段的端点，则进行打断
      if (!checkSegmentLine(coordinate, lineCoordinates)) {
        const { geometry, id, ...currentLineInfo } = f.getProperties()

        const line1 = {
          ...currentLineInfo,
          endLng: lng.toString(),
          endLat: lat.toString(),
        } as ElectricLineData
        const line2 = {
          ...currentLineInfo,
          startLng: lng.toString(),
          startLat: lat.toString(),
        } as ElectricLineData

        updateHistoryData.toBeDeletedLineIds.push(id)
        updateHistoryData.lines.push(line1, line2)
      }
    })

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
    saveHistoryData(updateHistoryData)
      .then((res) => {
        if (!(res.code === 200 && res.isSuccess === true)) {
          message.error(res?.message || '操作失败，服务器未响应')

          refreshModifyCallBack()
        } else {
          reFetchData()
        }
        modifyProps.visible = false
        modifyProps.position = [0, 0]
        modifyProps.currentState = null
      })
      .catch(message.error)
  }

  sourceRef.highLightSource.clear()
}

/**
 * 检查是否是打断线段的两端
 * @param coordinate
 * @param lineCoordinates
 * @returns {boolean}
 */
function checkSegmentLine(coordinate: number[], lineCoordinates: number[][]): boolean {
  return lineCoordinates.some((line: number[]) => {
    return line[0] === coordinate[0] && line[1] === coordinate[1]
  })
}
