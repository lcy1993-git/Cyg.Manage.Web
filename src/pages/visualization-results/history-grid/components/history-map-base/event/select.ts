import { Feature } from 'ol'
import Geometry from 'ol/geom/Geometry'
import { SelectEvent } from 'ol/interaction/Select'
import { addHightStyle, getDataByFeature, getGeometryType } from '../utils'
import type { InterActionRef, SelectedData, SetState } from './../typings'

interface SelectCallbackOptions {
  interActionRef: InterActionRef
  setState: SetState
  showText: boolean
  mode: string
}

export function toggleSelectCallback(
  e: SelectEvent,
  { interActionRef, setState, showText, mode }: SelectCallbackOptions
) {
  let flag = false // 是否需要set数据
  const hightFeatures = interActionRef.hightLightSource!.getFeatures()
  const { selected, deselected } = e
  if (selected.length > 0) {
    if (hightFeatures.length === 0) {
      if (!isAdded(selected)) {
        flag = true
        interActionRef.hightLightSource!.addFeatures(addHightStyle(selected, showText, mode))
      }
    } else {
      const currentType = getGeometryType(hightFeatures[0])
      if (currentType === getGeometryType(selected[0])) {
        if (!isAdded(selected)) {
          flag = true
          interActionRef.hightLightSource!.addFeatures(addHightStyle(selected, showText, mode))
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


    setState(
      'selectedData',
      getDataByFeature(interActionRef.hightLightSource!.getFeatures()) as SelectedData
    )
  }
  // 判断是否已经被添加
  function isAdded(selected: Feature<Geometry>[]) {
    return hightFeatures.some((f) => f.get('name') === selected[0].get('name'))
  }

  // 判断是否能删除
  function canRemove(o: Feature<Geometry>) {
    return interActionRef
      .hightLightSource!.getFeatures()
      .some((f) => f.get('name') === o.get('name'))
  }
}

export function pointSelectCallback(
  e: SelectEvent,
  { interActionRef, setState, showText }: SelectCallbackOptions
) {
  const { selected, deselected } = e
  selected.forEach((f) => {
    interActionRef.hightLightSource!.addFeatures(addHightStyle(selected, showText, ""))
  })
  deselected.forEach((f) => {
    interActionRef.hightLightSource!.removeFeature(f)
  })

  setState(
    'selectedData',
    getDataByFeature(interActionRef.hightLightSource!.getFeatures()) as SelectedData
  )
}
