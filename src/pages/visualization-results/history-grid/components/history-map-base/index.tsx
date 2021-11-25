import '@/assets/icon/history-grid-icon.css'
import { useCurrentRef } from '@/utils/hooks'
import { useMount, useUpdateEffect } from 'ahooks'
import { MapEvent, View } from 'ol'
import { Draw, Snap } from 'ol/interaction'
import 'ol/ol.css'
import { useRef, useState } from 'react'
import { useHistoryGridContext } from '../../store'
import { drawByDataSource, drawEnd } from './draw'
import { handlerGeographicSize, onMapLayerTypeChange } from './effects'
import { mapClick, moveend, pointermove } from './event'
import init from './init'
import { InterActionRef, LayerRef, MapRef, SourceRef } from './typings'
import { checkUserLocation, clear, getSelectByType, moveToViewByLocation } from './utils'

const HistoryMapBase = () => {
  // const [state, setState, mode] = useGridMap()

  const {
    dispatch: setState,
    UIStatus,
    mode,
    city,
    locate,
    historyDataSource: dataSource,
    preDesignItemData: importDesignData,
  } = useHistoryGridContext()

  const {
    showTitle: showText,
    showHistoryLayer: historyLayerVisible,
    currentLocation: onCurrentLocationClick,
    currentProject: onProjectLocationClick,
    mapType: mapLayerType,
    drawing: isDraw,
    cleanSelected,
  } = UIStatus

  // const {
  // mapLayerType,
  // isDraw,
  // dataSource,
  // onProjectLocationClick,
  // onCurrentLocationClick,
  // showText,
  // importDesignData,
  // historyLayerVisible,
  // moveToByCityLocation,
  // cleanSelected,
  // } = state

  // 绘制类型
  const [geometryType, setGeometryType] = useState<string>('')

  const ref = useRef<HTMLDivElement>(null)
  // 地图实例
  const mapRef = useCurrentRef<MapRef>({ map: {} })
  // 图层缓存数据
  const layerRef = useCurrentRef<LayerRef>({})
  // 视图实例
  const viewRef = useCurrentRef<{ view: View }>({})
  // 画图缓存数据
  const interActionRef = useCurrentRef<InterActionRef>({})

  const sourceRef = useCurrentRef<SourceRef>({})

  // const bindEvent = useCallback(() => {
  //   mapRef.map.on('click', (e: MapBrowserEvent<UIEvent>) =>
  //     mapClick(e, { interActionRef, mapRef, setState, UIStatus }))
  //     mapRef.map.on('pointermove', (e) => pointermove(e, { mode }))
  // // 地图拖动事件
  // mapRef.map.on('moveend', (e: MapEvent) => moveend(e))
  // viewRef.view.on('change:resolution', () => handlerGeographicSize({ mode, viewRef }))
  // }, [])

  // 挂载地图
  useMount(() => {
    init({
      interActionRef,
      sourceRef,
      layerRef,
      viewRef,
      mapRef,
      ref: ref.current!,
      setState,
      mode,
    })
    bindEvent()
  })

  // 处理geometryType变化
  useUpdateEffect(() => {
    removeaddInteractions()
    if (geometryType) addInteractions(geometryType)
  }, [geometryType])

  // 处理当前地图类型变化
  useUpdateEffect(
    () => onMapLayerTypeChange(mapLayerType, layerRef.vecLayer, layerRef.streetLayer),
    [mapLayerType]
  )

  // 根据历史数据绘制点位线路
  useUpdateEffect(() => {
    drawHistoryLayer()
  }, [dataSource])
  // 根据预设计数据绘制点位线路
  useUpdateEffect(() => {
    drawDesignLayer()
  }, [importDesignData])

  // 处理select
  useUpdateEffect(() => {
    interActionRef.select.currentSelect?.getFeatures().clear()
    mapRef.map.removeInteraction(interActionRef.select.currentSelect!)
    interActionRef.select.currentSelect = getSelectByType(interActionRef, showText, isDraw)!
    mapRef.map.addInteraction(interActionRef.select.currentSelect)
  }, [isDraw, showText])

  // 处理绘制状态的select
  useUpdateEffect(() => {
    clear(sourceRef)
    drawHistoryLayer()
    drawDesignLayer()
  }, [showText])

  // 当绘制状态改变时
  useUpdateEffect(() => {
    // clear(interActionRef)
    setState({
      type: 'changeSelectedData',
      payload: [],
    })
    // if (isDraw) {
    //   mapRef.map.removeInteraction(interActionRef.select!.pointSelect)
    //   mapRef.map.addInteraction(interActionRef.select!.toggleSelect)
    // } else {
    //   mapRef.map.removeInteraction(interActionRef.select!.toggleSelect)
    //   mapRef.map.addInteraction(interActionRef.select!.pointSelect)
    // }
  }, [isDraw])

  // 定位当当前项目位置
  useUpdateEffect(() => {
    viewRef.view.fit([
      ...sourceRef.historyPointSource.getExtent(),
      ...sourceRef.historyLineSource.getExtent(),
    ])
  }, [onProjectLocationClick])

  // 定位到当前用户位置
  useUpdateEffect(() => checkUserLocation(viewRef), [onCurrentLocationClick])

  // 历史图层开关
  useUpdateEffect(() => {
    layerRef.historyPointLayer.setVisible(historyLayerVisible)
    layerRef.historyLineLayer.setVisible(historyLayerVisible)
  }, [historyLayerVisible])

  // 根据城市选择定位
  useUpdateEffect(
    () => moveToViewByLocation(viewRef, [city?.lng || 0, city?.lat || 0] as [number, number]),
    [locate]
  )

  useUpdateEffect(() => clear(sourceRef), [cleanSelected])

  // 绑定事件
  function bindEvent() {
    mapRef.map.on('click', (e: MapBrowserEvent<UIEvent>) =>
      mapClick(e, { interActionRef, mapRef, setState, sourceRef })
    )
    mapRef.map.on('pointermove', (e) => pointermove(e, { mode }))
    // 地图拖动事件
    mapRef.map.on('moveend', (e: MapEvent) => moveend(e))
    viewRef.view.on('change:resolution', () => handlerGeographicSize({ mode, viewRef }))
  }

  // 初始化interaction
  // function initInterAction() {
  //   interActionRef.modify = new Modify({
  //     source: interActionRef.source,
  //     // 设置容差
  //     style: undefined,
  //     pixelTolerance: 25,
  //   })
  //   interActionRef.modify.on(['modifyend'], (e: Event | BaseEvent) => {
  //     // e.features.getArray()[0].setStyle(pointStyle.hight)
  //     // e.features.getArray()[0].setStyle(featureStyle.type2)
  //   })
  //   // 暂时屏蔽编辑功能
  //   false && mapRef.map.addInteraction(interActionRef.modify!)

  //   const pointSelect = new Select()
  //   const dragBox = new DragBox({})
  //   const boxSelect = new Select()
  //   const toggleSelect = new Select({
  //     condition: conditionClick,
  //     toggleCondition: platformModifierKeyOnly,
  //     style: (feature) => {
  //       const geometryType = feature.getGeometry()?.getType()

  //       return getStyle(geometryType)(
  //         feature.get('sourceType'),
  //         feature.get('typeStr') || '无类型',
  //         feature.get('name'),
  //         showText
  //       )
  //     },
  //   })
  //   // 绑定单选及多选回调事件
  //   toggleSelect.on('select', (e: SelectEvent) =>
  //     toggleSelectCallback(e, { interActionRef, setState, showText, mode })
  //   )
  //   pointSelect.on('select', (e: SelectEvent) =>
  //     pointSelectCallback(e, { interActionRef, setState, showText, mode })
  //   )
  //   toggleSelect.setHitTolerance(8)
  //   pointSelect.setHitTolerance(8)
  //   interActionRef.select = {
  //     pointSelect,
  //     toggleSelect,
  //   }

  //   mapRef.map.addInteraction(interActionRef.select.pointSelect)

  //   interActionRef.dragBox = dragBox
  //   const selectedFeatures = boxSelect.getFeatures()
  //   dragBox.on('boxend', function () {
  //     var extent = dragBox.getGeometry().getExtent()
  //     interActionRef.source!.forEachFeatureIntersectingExtent(extent, function (feature) {
  //       selectedFeatures.push(feature)
  //     })
  //   })
  //   // 框选鼠标按下清除高亮
  //   dragBox.on('boxstart', function () {
  //     selectedFeatures.clear()
  //   })
  // }

  function drawHistoryLayer() {
    drawByDataSource(dataSource!, {
      source: 'history',
      showText,
      sourceType: 'history',
      sourceRef,
    })
  }

  function drawDesignLayer() {
    if (mode === 'preDesign')
      drawByDataSource(importDesignData!, {
        source: 'design',
        showText,
        sourceType: 'design',
        sourceRef,
      })
  }

  // 删除draw交互行为
  function removeaddInteractions() {
    if (interActionRef.draw && interActionRef.snap) {
      mapRef.map.removeInteraction(interActionRef.draw)
      mapRef.map.removeInteraction(interActionRef.snap)
    }
  }

  // 添加draw交互行为
  function addInteractions(type: string) {
    if (type) {
      interActionRef.draw = new Draw({
        source: interActionRef.source,
        type: type,
      })
      // 绑定绘制完成事件
      interActionRef.draw.on('drawend', (e) => drawEnd(e, interActionRef.source!, setGeometryType))
      mapRef.map.addInteraction(interActionRef.draw)
      interActionRef.snap = new Snap({ source: interActionRef.source })
      mapRef.map.addInteraction(interActionRef.snap)
    }
  }

  return (
    <div className="w-full h-full">
      <div ref={ref} className="w-full h-full"></div>
    </div>
  )
}

export default HistoryMapBase
