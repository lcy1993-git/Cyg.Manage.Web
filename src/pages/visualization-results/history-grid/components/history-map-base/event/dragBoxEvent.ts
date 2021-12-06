import { Dispatch, SetStateAction } from 'react'
import { DragBoxProps, SourceRef } from '../typings'
import { getDataByFeature } from '../utils'
import { HistoryDispatch } from './../../../store/index'
import { InterActionRef } from './../typings/index'

interface DragBoxCancelProps {
  setDragBoxProps: Dispatch<SetStateAction<DragBoxProps>>
  interActionRef: InterActionRef
  sourceRef: SourceRef
}

export function onDragBoxPointSelect(
  mode: string,
  dragBoxProps: DragBoxProps,
  type: 'Point' | 'LineString',
  setState: HistoryDispatch,
  interActionRef: InterActionRef,
  sourceRef: SourceRef,
  setDragBoxProps: Dispatch<SetStateAction<DragBoxProps>>
) {
  const sourceType = mode === 'record' ? 'history' : 'preDesign'
  interActionRef.select.boxSelect.getFeatures().clear()
  const selectFeature = interActionRef.select.boxSelect.getFeatures()

  const filterFeature = dragBoxProps.selected.filter((feature) => {
    return (
      feature.getGeometry()?.getType() === type &&
      feature.get('sourceType') === sourceType &&
      selectFeature.push(feature)
    )
  })

  const selectedData = getDataByFeature(filterFeature)
  // interActionRef.select.boxSelect.getFeatures().remove(interActionRef.dragBoxFeature!)
  setState((data) => {
    return {
      ...data,
      selectedData: selectedData,
    }
  })
  setDragBoxProps({ visible: false, position: [0, 0], selected: [] })
  // 清楚线框
  sourceRef.dragBoxSource.clear()
}

export function onDragBoxCancel({
  setDragBoxProps,
  interActionRef,
  sourceRef,
}: DragBoxCancelProps) {
  setDragBoxProps({ visible: false, position: [0, 0], selected: [] })
  interActionRef.select.boxSelect.getFeatures().clear()
  // 清楚线框
  sourceRef.dragBoxSource.clear()
}
