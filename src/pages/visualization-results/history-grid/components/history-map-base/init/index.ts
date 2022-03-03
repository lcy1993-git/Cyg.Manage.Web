import { Feature } from 'ol'
import { platformModifierKeyOnly } from 'ol/events/condition'
import Geometry from 'ol/geom/Geometry'
import { Select } from 'ol/interaction'
import { SelectEvent } from 'ol/interaction/Select'
import { HistoryDispatch } from '../../../store'
import { handlerGeographicSize } from '../effects'
// import { select } from 'ol/interaction/Select'
import { getStyle } from '../styles'
import { getDataByFeature } from '../utils'
import { InterActionRef, LayerRef, MapRef, SourceRef, ViewRef } from './../typings'
import { initControl } from './initControl'
import { initLayer } from './initLayer'
import { initMap } from './initMap'
import { initSource } from './initSource'
import { initView } from './initView'

interface InitOps {
  sourceRef: SourceRef
  layerRef: LayerRef
  viewRef: ViewRef
  mapRef: MapRef
  ref: HTMLDivElement
  interActionRef: InterActionRef
  setState: HistoryDispatch
  mode: string
}

function init({
  setState,
  interActionRef,
  sourceRef,
  layerRef,
  viewRef,
  mapRef,
  ref,
  mode,
}: InitOps) {
  initSource(sourceRef)
  initLayer(layerRef, sourceRef)
  initView(viewRef)
  initMap({ viewRef, mapRef, layerRef, ref })

  initControl({ mapRef, mode })

  // 显示比例尺
  handlerGeographicSize({ mode, viewRef })

  const getSelect = (showText: boolean, isToggle: boolean) => {
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
      filter(feature, layer) {
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

  interActionRef.select = {
    viewNoTextSelect: getSelect(false, false),
    viewTextSelect: getSelect(true, false),
    drawNoTextSelect: getSelect(false, true),
    drawTextSelect: getSelect(true, true),
    currentSelect: null,
  }

  // select.on("select", (e: SelectEvent) => {

  //   console.log((e.target as VectorSource<Geometry>)?.getFeatures().getArray());

  // })
  interActionRef.select.currentSelect = interActionRef.select.viewTextSelect

  mapRef.map.addInteraction(interActionRef.select.currentSelect)
}

export default init
