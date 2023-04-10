import { Feature } from 'ol'
import Geometry from 'ol/geom/Geometry'
import { SelectEvent } from 'ol/interaction/Select'
import { HistoryDispatch } from '../../../store'
import { addHightStyle, getDataByFeature, getGeometryType } from '../utils'
import type { InterActionRef, SelectedData } from './../typings'

interface SelectCallbackOptions {
  interActionRef: InterActionRef
  setState: HistoryDispatch
  showText: boolean
  mode: string
}

export function toggleSelectCallback(
  e: SelectEvent,
  { interActionRef, setState, showText }: SelectCallbackOptions
) {
  let flag = false // 是否需要set数据
  const hightFeatures = interActionRef.hightLightSource!.getFeatures()
  const { selected, deselected } = e
  if (selected.length > 0) {
    if (hightFeatures.length === 0) {
      if (!isAdded(selected)) {
        flag = true
        interActionRef.hightLightSource!.addFeatures(addHightStyle(selected, showText))
      }
    } else {
      const currentType = getGeometryType(hightFeatures[0])
      if (currentType === getGeometryType(selected[0])) {
        if (!isAdded(selected)) {
          flag = true
          interActionRef.hightLightSource!.addFeatures(addHightStyle(selected, showText))
        }
      }
    }
  }

  if (deselected.length > 0) {
    deselected.forEach((f) => {
      if (canRemove(f)) {
        flag = true
        interActionRef.hightLightSource!.removeFeature(f)
      }
    })
  }

  if (flag) {
    setState({
      type: 'changeSelectedData',
      payload: getDataByFeature(interActionRef.hightLightSource!.getFeatures()) as SelectedData,
    })
    // setState(
    //   'selectedData',
    //   getDataByFeature(interActionRef.hightLightSource!.getFeatures()) as SelectedData
    // )
  }
  // 判断是否已经被添加
  function isAdded(selected: Feature<Geometry>[]) {
    return hightFeatures.some((f) => f.get('id') === selected[0].get('id'))
  }

  // 判断是否能删除
  function canRemove(o: Feature<Geometry>) {
    return interActionRef.hightLightSource!.getFeatures().some((f) => f.get('id') === o.get('id'))
  }
}

export function pointSelectCallback(
  e: SelectEvent,
  { interActionRef, setState, showText }: SelectCallbackOptions
) {
  const { selected, deselected } = e
  selected.forEach(() => {
    interActionRef.hightLightSource!.addFeatures(addHightStyle(selected, showText))
  })
  deselected.forEach((f) => {
    interActionRef.hightLightSource!.removeFeature(f)
  })

  // setState(
  //   'selectedData',
  //   getDataByFeature(interActionRef.hightLightSource!.getFeatures()) as SelectedData
  // )

  setState({
    type: 'changeSelectedData',
    payload: getDataByFeature(interActionRef.hightLightSource!.getFeatures()) as SelectedData,
  })
}
