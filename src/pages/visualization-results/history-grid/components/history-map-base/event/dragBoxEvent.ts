import { Dispatch, SetStateAction } from 'react'
import { DragBoxProps } from '../typings'
import { getDataByFeature } from '../utils'
import { HistoryDispatch } from './../../../store/index'
import { InterActionRef } from './../typings/index'

interface DragBoxCancelProps {
  setDragBoxProps: Dispatch<SetStateAction<DragBoxProps>>
  interActionRef: InterActionRef
}

export function onDragBoxPointSelect(
  mode: string,
  dragBoxProps: DragBoxProps,
  type: 'Point' | 'LineString',
  setState: HistoryDispatch,
  interActionRef: InterActionRef
) {
  const sourceType = mode === 'record' ? 'history' : 'preDesign'

  const selectFeature = interActionRef.select.boxSelect.getFeatures()

  const filterFeature = dragBoxProps.selected.filter((feature) => {
    return (
      feature.getGeometry()?.getType() === type &&
      feature.get('sourceType') === sourceType &&
      selectFeature.push(feature)
    )
  })

  const selectedData = getDataByFeature(filterFeature)

  setState((data) => {
    return {
      ...data,
      selectedData: selectedData,
    }
  })
}

export function onDragBoxCancel({ setDragBoxProps, interActionRef }: DragBoxCancelProps) {
  setDragBoxProps({ visible: false, position: [0, 0], selected: [] })
  interActionRef.select.boxSelect.getFeatures().clear()
}
