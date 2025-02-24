import { handleDecrypto } from '@/utils/utils'
import { message } from 'antd/es'
import { Feature } from 'ol'
import LineString from 'ol/geom/LineString'
import Point from 'ol/geom/Point'
import * as proj from 'ol/proj'
import { saveOperation } from '.'
import { saveData, saveHistoryData } from '../../../service'
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
  mode: string
  preId: string | undefined
}
/**
 *
 * @param param0
 * @param needAdsorption
 */
export function needAdsorption(
  { modifyProps, sourceRef, reFetchData, mode, preId }: AdsorptionOptions,
  needAdsorption: boolean
) {
  const preMode = mode === 'record' ? 'history' : 'design'

  const { eventFeatures, refreshModifyCallBack } = modifyProps.currentState!
  if (needAdsorption) {
    saveAdsorptionOperation(
      modifyProps.currentState!,
      sourceRef,
      modifyProps,
      reFetchData,
      preMode,
      preId
    )
  } else {
    saveOperation(eventFeatures, refreshModifyCallBack, sourceRef, modifyProps, preMode, preId)
  }
}
/**
 * 不吸附时候的点击事件
 * @param param0
 */
export function needNotAdsorption({ modifyProps, sourceRef, mode, preId }: AdsorptionOptions) {
  const { eventFeatures, refreshModifyCallBack } = modifyProps.currentState!
  saveOperation(eventFeatures, refreshModifyCallBack, sourceRef, modifyProps, mode, preId)
  modifyProps.visible = false
  modifyProps.position = [0, 0]
  modifyProps.currentState = null
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
  reFetchData: () => void,
  mode: string,
  preId: string | undefined
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
        const { id, ...currentLineInfo } = f.getProperties()

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
    const save = mode === 'history' ? saveHistoryData : saveData
    const idProps = mode === 'history' ? {} : { id: preId! }
    save({ ...updateHistoryData, ...idProps })
      .then((res) => {
        const decryRes = handleDecrypto(res)
        if (!(decryRes.code === 200 && decryRes.isSuccess === true)) {
          message.error(decryRes?.message || '操作失败，服务器未响应')

          refreshModifyCallBack()
        } else {
          reFetchData()
        }
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
