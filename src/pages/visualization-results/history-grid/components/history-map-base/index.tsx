import '@/assets/icon/history-grid-icon.css'
import { useMount, useReactive, useSize, useUpdateEffect } from 'ahooks'
import { message } from 'antd'
import { MapBrowserEvent, MapEvent, View } from 'ol'
import 'ol/ol.css'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useHistoryGridContext } from '../../store'
import AdsorptionModal from './components/adsorption-modal'
import DragBoxModal from './components/drag-box-modal'
import { drawByDataSource, drawMap } from './draw'
import { handlerGeographicSize, onMapLayerTypeChange } from './effects'
import {
  mapClick,
  moveend,
  needAdsorption,
  onDragBoxCancel,
  onDragBoxPointSelect,
  pointermove,
  refreshModify,
} from './event'
import './index.css'
import init from './init'
import { DragBoxProps, InterActionRef, LayerRef, LifeStateRef, MapRef, SourceRef } from './typings'
import {
  checkUserLocation,
  clearScreen,
  getFitExtend,
  getSelectByType,
  moveToViewByLocation,
} from './utils'
import { useCurrentRef } from './utils/hooks'

const HistoryMapBase = () => {
  // const [state, setState, mode] = useGridMap()
  const {
    dispatch: setState,
    UIStatus,
    mode: preMode,
    city,
    locate,
    historyDataSource: dataSource,
    preDesignDataSource: importDesignData,
    geometryType,
    refetch,
  } = useHistoryGridContext()
  const modeRef = useRef(preMode === 'record' || preMode === 'recordEdit' ? 'record' : 'preDesign')
  const mode = modeRef.current
  const {
    showTitle,
    showHistoryLayer: historyLayerVisible,
    currentLocation: onCurrentLocationClick,
    currentProject: onProjectLocationClick,
    mapType: mapLayerType,
    drawing: isDraw,
    cleanSelected,
    disableShowTitle,
  } = UIStatus

  // 刷新组件
  const reFetchData = useCallback(
    () =>
      setState((state) => {
        return { ...state, refetch: !state.refetch }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }),
    []
  )

  const showText = showTitle && disableShowTitle

  const ref = useRef<HTMLDivElement>(null)
  const size = useSize(ref)
  // 地图实例
  const mapRef = useCurrentRef<MapRef>({ map: {} })
  // 图层缓存数据
  const layerRef = useCurrentRef<LayerRef>({})
  // 视图实例
  const viewRef = useCurrentRef<{ view: View }>({})
  // 画图缓存数据
  const interActionRef = useCurrentRef<InterActionRef>({})

  const lifeStateRef = useCurrentRef<LifeStateRef>({ state: { isFirstDrawHistory: true } })

  const sourceRef = useCurrentRef<SourceRef>({})

  const [dragBoxProps, setDragBoxProps] = useState<DragBoxProps>({
    visible: false,
    position: [0, 0],
    selected: [],
  })

  const modifyProps = useReactive({
    visible: false,
    position: [0, 0],
    currentState: null,
  })

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
      setDragBoxProps,
    })
    bindEvent()
  })

  useUpdateEffect(() => {
    mapRef.map.updateSize()
  }, [size])

  // 处理geometryType变化
  useUpdateEffect(() => {
    drawMap({ geometryType })
    // removeaddInteractions()
    // if (geometryType) addInteractions(geometryType)
  }, [geometryType])

  // 处理当前地图类型变化
  useUpdateEffect(() => onMapLayerTypeChange(mapLayerType, layerRef.streetLayer), [mapLayerType])
  // 根据历史数据绘制点位线路
  useEffect(() => {
    drawHistoryLayer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource])
  // 根据预设计数据绘制点位线路
  useEffect(() => {
    drawDesignLayer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importDesignData])

  // 处理select
  useUpdateEffect(() => {
    interActionRef.select.currentSelect?.getFeatures().clear()
    mapRef.map.removeInteraction(interActionRef.select.currentSelect!)
    interActionRef.select.currentSelect = getSelectByType(interActionRef, showText, isDraw)!
    mapRef.map.addInteraction(interActionRef.select.currentSelect)
  }, [isDraw, showText])

  // 处理绘制状态的select
  // useUpdateEffect(() => changeLayerStyleByShowText(sourceRef, showText), [showText])

  // 当绘制状态改变时
  useUpdateEffect(() => {
    // clear(interActionRef)
    setState({
      type: 'changeSelectedData',
      payload: [],
    })
    if (isDraw) {
      refreshModify({
        mapRef,
        interActionRef,
        sourceRef,
        isDraw,
        mode,
        modifyProps,
        preId: importDesignData?.id,
      })
    } else {
      interActionRef.modify && mapRef.map.removeInteraction(interActionRef.modify)
      sourceRef.highLightSource.clear()
    }
    interActionRef.dragBox?.setActive(isDraw)
  }, [isDraw, refetch])

  // 定位当当前项目位置
  useUpdateEffect(() => {
    const extend = getFitExtend(
      sourceRef.designPointSource.getExtent(),
      sourceRef.designLineSource.getExtent(),
      historyLayerVisible && sourceRef.historyPointSource.getExtent(),
      historyLayerVisible && sourceRef.historyLineSource.getExtent()
    )
    const canFit = extend.every(Number.isFinite)
    if (canFit) {
      viewRef.view.fit(extend, {
        duration: 600,
      })

      handlerGeographicSize({ mode, viewRef })
    } else {
      message.error('当前项目没有数据，无法定位')
    }
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
    () => moveToViewByLocation(viewRef, [city?.lng || 0, city?.lat || 0] as [number, number], mode),
    [locate]
  )

  useUpdateEffect(() => clearScreen({ sourceRef, interActionRef }), [cleanSelected])

  // 绑定事件
  function bindEvent() {
    mapRef.map.on('click', (e: MapBrowserEvent<MouseEvent>) =>
      mapClick(e, { interActionRef, mapRef, setState, setDragBoxProps, sourceRef })
    )
    mapRef.map.on('pointermove', (e) => pointermove(e, { mode }))
    // 地图拖动事件
    mapRef.map.on('moveend', (e: MapEvent) => moveend(e))
    viewRef.view.on('change:resolution', (e) => {
      if (viewRef.view.getZoom()! > 14.0) {
        setState((state) => {
          return {
            ...state,
            UIStatus: {
              ...state.UIStatus,
              disableShowTitle: true,
            },
          }
        })
      } else {
        setState((state) => {
          return {
            ...state,
            UIStatus: {
              ...state.UIStatus,
              disableShowTitle: false,
            },
          }
        })
      }

      // 修改比例尺
      handlerGeographicSize({ mode, viewRef })
    })
  }

  // 初次挂载自适应屏幕
  const autoSizeScreen = useCallback(() => {
    if (lifeStateRef.state.isFirstDrawHistory) {
      const extend = getFitExtend(
        historyLayerVisible && sourceRef.historyPointSource.getExtent(),
        historyLayerVisible && sourceRef.historyLineSource.getExtent(),
        sourceRef.designLineSource.getExtent(),
        sourceRef.designLineSource.getExtent()
      )

      const canFit = extend.every((i) => Number.isFinite(i))
      if (canFit) {
        viewRef.view.fit(extend)
        handlerGeographicSize({ mode, viewRef })
      }
    }
    lifeStateRef.state.isFirstDrawHistory = false
  }, [
    historyLayerVisible,
    lifeStateRef.state,
    mode,
    sourceRef.designLineSource,
    sourceRef.historyLineSource,
    sourceRef.historyPointSource,
    viewRef,
  ])

  const drawHistoryLayer = useCallback(() => {
    if (!dataSource) return
    drawByDataSource(
      dataSource!,
      {
        source: 'history',
        sourceType: 'history',
        sourceRef,
      },
      autoSizeScreen
    )
    refreshModify({
      mapRef,
      interActionRef,
      sourceRef,
      isDraw,
      mode,
      modifyProps,
      preId: importDesignData?.id,
    })
  }, [
    dataSource,
    sourceRef,
    autoSizeScreen,
    mapRef,
    interActionRef,
    isDraw,
    mode,
    modifyProps,
    importDesignData,
  ])

  const drawDesignLayer = useCallback(() => {
    if (mode === 'preDesign')
      drawByDataSource(importDesignData!, {
        source: 'design',
        sourceType: 'design',
        sourceRef,
      })
    refreshModify({
      mapRef,
      interActionRef,
      sourceRef,
      isDraw,
      mode,
      modifyProps,
      preId: importDesignData?.id,
    })
  }, [mode, importDesignData, sourceRef, mapRef, interActionRef, isDraw, modifyProps])

  // 拖拽时是否需要吸附
  const needAdsorptionFn = useCallback(
    (flag: boolean) => {
      needAdsorption(
        { modifyProps, sourceRef, reFetchData, mode, preId: importDesignData?.id },
        flag
      )
      modifyProps.visible = false
      modifyProps.position = [0, 0]
      modifyProps.currentState = null
    },
    [modifyProps, sourceRef, reFetchData, mode, importDesignData]
  )

  return (
    <div className="w-full h-full relative">
      <div ref={ref} className="w-full h-full absolute"></div>
      {modifyProps.visible && (
        <AdsorptionModal
          position={modifyProps.position}
          needAdsorption={needAdsorptionFn}
        ></AdsorptionModal>
      )}

      {dragBoxProps.visible && (
        <DragBoxModal
          position={dragBoxProps.position}
          onSelectClick={(type: 'LineString' | 'Point') =>
            onDragBoxPointSelect(
              dragBoxProps,
              type,
              setState,
              interActionRef,
              sourceRef,
              setDragBoxProps
            )
          }
          onCancelClick={() => onDragBoxCancel({ setDragBoxProps, interActionRef, sourceRef })}
        ></DragBoxModal>
      )}
    </div>
  )
}

export default HistoryMapBase
