import { Feature } from 'ol'
import { LineString } from 'ol/geom/LineString'
import * as proj from 'ol/proj'
import { Dispatch, SetStateAction } from 'react'
import { saveOperation } from '.'
import { ModifyCurrentState, ModifyProps, SourceRef } from './../typings'

interface AdsorptionOptions {
  modifyProps: ModifyProps
  setModifyProps: Dispatch<SetStateAction<ModifyProps>>
  sourceRef: SourceRef
}
/**
 *
 * @param param0
 * @param needAdsorption
 */
export function needAdsorption(
  { modifyProps, setModifyProps, sourceRef }: AdsorptionOptions,
  needAdsorption: boolean
) {
  const { eventFeatures, refreshModifyCallBack } = modifyProps.currentState!
  if (needAdsorption) {
    saveAdsorptionOperation(modifyProps.currentState!, sourceRef)
  } else {
    saveOperation(eventFeatures, refreshModifyCallBack, sourceRef)
  }

  setModifyProps({
    visible: false,
    position: [0, 0],
    currentState: null,
  })
}
/**
 * 不吸附时候的点击事件
 * @param param0
 */
export function needNotAdsorption({ modifyProps, setModifyProps, sourceRef }: AdsorptionOptions) {
  const { eventFeatures, refreshModifyCallBack } = modifyProps.currentState!
  saveOperation(eventFeatures, refreshModifyCallBack, sourceRef)
  setModifyProps({
    visible: false,
    position: [0, 0],
    currentState: null,
  })
}

/**
 * 吸附保存操作，将数据保存到服务器
 * @param eventFeatures
 * @param refreshModifyCallBack
 * @param sourceRef
 */
function saveAdsorptionOperation(currentState: ModifyCurrentState, sourceRef: SourceRef) {
  const { eventFeatures, atPixelFeatures, coordinate, refreshModifyCallBack } = currentState

  const position = proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326')
  // console.log(coordinate);

  // console.log(position);

  const ids = eventFeatures.map((f) => f.get('id'))

  const otherFeatures: Feature<LineString>[] = atPixelFeatures.filter((f) => {
    return !ids.includes(f.get('id')) && f.getGeometry()?.getType() === 'LineString'
  })

  if (otherFeatures.length > 0) {
    otherFeatures.forEach((f) => {
      // console.log(f.getGeometry().getCoordinates())
    })
  }

  // console.log(otherFeatures);

  sourceRef.highLightSource.clear()
}
