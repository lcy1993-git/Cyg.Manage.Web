import type { InterActionRef, MapRef, SelectType } from '../index'

/**
 * 处理选择类型改变时的交互行为
 * @param selectType
 * @param interActionRef
 * @param mapRef
 */

export default function onSelectTypeChange(
  selectType: SelectType,
  interActionRef: InterActionRef,
  mapRef: MapRef
) {
  mapRef.map.removeInteraction(interActionRef.dragBox!)
  if (interActionRef.currentSelect !== undefined) {
    mapRef.map.removeInteraction(interActionRef.currentSelect)
  }
  if (selectType === 'pointSelect') {
    interActionRef.currentSelect = interActionRef.select!.pointSelect
  } else if (selectType === 'boxSelect') {
    mapRef.map.addInteraction(interActionRef.dragBox!)
    interActionRef.currentSelect = interActionRef.select!.boxSelect
  } else if (selectType === 'toggleSelect') {
    interActionRef.currentSelect = interActionRef.select!.toggleSelect
  } else {
    interActionRef.currentSelect = undefined
  }
  if (interActionRef.currentSelect !== undefined) {
    mapRef.map!.addInteraction(interActionRef.currentSelect!)
  }
}
