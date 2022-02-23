import { Feature } from 'ol'
import { platformModifierKeyOnly, primaryAction } from 'ol/events/condition'
import Geometry from 'ol/geom/Geometry'
import LineString from 'ol/geom/LineString'
import Point from 'ol/geom/Point'
import { DragBox, Select } from 'ol/interaction'
import { SelectEvent } from 'ol/interaction/Select'
import VectorSource from 'ol/source/Vector'
import { Dispatch, SetStateAction } from 'react'
import { HistoryDispatch } from '../../../store'
import { getStyle } from '../styles'
import { DragBoxProps, InterActionRef, MapRef, SourceRef } from '../typings'
import { getDataByFeature } from '../utils'

interface SelectEventOps {
  setState: HistoryDispatch
  mapRef: MapRef
  interActionRef: InterActionRef
  sourceRef: SourceRef
  setDragBoxProps: Dispatch<SetStateAction<DragBoxProps>>
  mode: string
}

export default function initSelect({
  interActionRef,
  mapRef,
  setState,
  sourceRef,
  setDragBoxProps,
  mode,
}: SelectEventOps) {
  const modeSign = mode === 'record' ? 'history' : 'design'

  const boxSelect = new Select({
    style: (f) => {
      return getStyle(f.getGeometry()?.getType())?.(
        f.get('sourceType'),
        f.get('typeStr') || '无类型',
        f.get('name'),
        true,
        true
      )
    },
  })

  interActionRef.select = {
    viewNoTextSelect: getSelect(false, false),
    viewTextSelect: getSelect(true, false),
    drawNoTextSelect: getSelect(false, true),
    drawTextSelect: getSelect(true, true),
    boxSelect,
    currentSelect: null,
  }
  interActionRef.select.currentSelect = interActionRef.select.viewTextSelect
  mapRef.map.addInteraction(interActionRef.select.currentSelect)

  /**
   * 选择模式根据的展示文字和是否多选呈现的四种状态
   * @param showText
   * @param isToggle
   * @returns
   */
  function getSelect(showText: boolean, isToggle: boolean) {
    const select = new Select({
      style(f) {
        return getStyle(f.getGeometry()?.getType())?.(
          f.get('sourceType'),
          f.get('typeStr') || '无类型',
          f.get('name'),
          showText,
          true
        )
      },
      filter(feature) {
        // 非数据渲染的feature不会被选中
        if (!feature.get('id')) return false

        // @ts-ignore
        const f = this?.getFeatures()?.getArray()[0]

        if (f) {
          const selectType = f.getGeometry().getType()
          if (selectType === (feature as Feature<Geometry>).getGeometry()?.getType()) {
            return true
          } else {
            return false
          }
        } else {
          return true
        }
      },
      hitTolerance: 10,
      // condition: conditionClick,
      toggleCondition: isToggle ? platformModifierKeyOnly : undefined,
    })
    select.on('select', (e: SelectEvent) => {
      // @ts-ignore
      const selectedData = getDataByFeature(e.target?.getFeatures()?.getArray()) as SelectedData

      setState((data) => {
        return {
          ...data,
          selectedData,
        }
      })
    })
    return select
  }

  const dragBox = new DragBox({
    condition: primaryAction,
    className: 'history_drag_box_style',
  })
  interActionRef.dragBoxFeature = new Feature()

  sourceRef.highLightSource.addFeature(interActionRef.dragBoxFeature)
  // interActionRef.dragBoxFeature.setStyle(polygonDragBox)
  interActionRef.dragBox = dragBox

  dragBox.setActive(false)
  //框选
  // var selectedFeatures = boxSelect.getFeatures()

  // 框选结束添加高亮
  dragBox.on('boxend', function (e) {
    var extent = dragBox.getGeometry().getExtent()

    const source = new VectorSource<Point | LineString>({
      features: [
        ...sourceRef[`${modeSign}PointSource`].getFeatures(),
        ...sourceRef[`${modeSign}LineSource`].getFeatures(),
      ],
    })
    const selected: Feature<Point | LineString>[] = []
    source.forEachFeatureIntersectingExtent(extent, function (feature) {
      selected.push(feature)
    })

    if (selected.length > 0) {
      setDragBoxProps({
        visible: true,
        position: [...e.mapBrowserEvent.pixel],
        selected,
      })
      // 设置绘制完成后的线框
      const polygon = dragBox.getGeometry()
      interActionRef.dragBoxFeature!.setGeometry(polygon)
      sourceRef.dragBoxSource.addFeature(interActionRef.dragBoxFeature!)
    }
  })
  // 框选鼠标按下清除高亮
  dragBox.on('boxstart', function () {
    sourceRef.dragBoxSource.clear()
    boxSelect.getFeatures().clear()
  })

  mapRef.map.addInteraction(dragBox)
  mapRef.map.addInteraction(boxSelect)
}
