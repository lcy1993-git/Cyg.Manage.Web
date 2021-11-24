import '@/assets/icon/history-grid-icon.css'
import { useCurrentRef } from '@/utils/hooks'
import { useMount, useUpdateEffect } from 'ahooks'
import { Map, MapBrowserEvent, MapEvent, View } from 'ol'
import { click as conditionClick, platformModifierKeyOnly } from 'ol/events/condition'
import BaseEvent from 'ol/events/Event'
import Geometry from 'ol/geom/Geometry'
import GeometryType from 'ol/geom/GeometryType'
import { DragBox, Draw, Modify, Select, Snap } from 'ol/interaction'
import { SelectEvent } from 'ol/interaction/Select'
import 'ol/ol.css'
import * as proj from 'ol/proj'
import { Vector as VectorSource } from 'ol/source'
import { useEffect, useRef, useState } from 'react'
import { useHistoryGridContext } from '../../store'
import { drawByDataSource, drawEnd } from './draw'
import { handlerGeographicSize, onMapLayerTypeChange } from './effects'
import { moveend, pointermove, pointSelectCallback, toggleSelectCallback } from './event'
import mapClick from './event/mapClick'
import { annLayer, getVectorLayer, streetLayer, vecLayer } from './layers'
import { getStyle } from './styles'
import { InterActionRef, LayerRef, MapRef } from './typings'
import {
  checkUserLocation,
  clear,
  clearScreen,
  isValidationData,
  moveToViewByLocation,
} from './utils'

export type MapLayerType = 'STREET' | 'SATELLITE'

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

  // 挂载地图
  useMount(() => {
    beforeInit()
    initLayer()
    initView()
    initMap()
    bindEvent()
    initInterAction()
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
  // 根据数据绘制点位线路
  useEffect(() => {
    if (interActionRef.source)
      drawByDataSource(dataSource!, {
        interActionRef,
        source: 'source',
        showText,
        sourceType: 'history',
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(dataSource), showText])

  useEffect(() => {
    if (importDesignData && mode === 'preDesign')
      isValidationData(importDesignData, interActionRef) &&
        drawByDataSource(importDesignData!, {
          interActionRef,
          source: 'designSource',
          showText,
          sourceType: 'design',
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importDesignData, showText])

  // 当绘制状态改变时
  useUpdateEffect(() => {
    clear(interActionRef)
    setState({
      type: 'changeSelectedData',
      payload: [],
    })
    if (isDraw) {
      mapRef.map.removeInteraction(interActionRef.select!.pointSelect)
      mapRef.map.addInteraction(interActionRef.select!.toggleSelect)
    } else {
      mapRef.map.removeInteraction(interActionRef.select!.toggleSelect)
      mapRef.map.addInteraction(interActionRef.select!.pointSelect)
    }
  }, [isDraw])

  // 定位当当前项目位置
  useUpdateEffect(
    () =>
      viewRef.view.fit((layerRef.vectorLayer.getSource() as VectorSource<Geometry>).getExtent()),
    [onProjectLocationClick]
  )

  // 定位到当前用户位置
  useUpdateEffect(() => checkUserLocation(viewRef), [onCurrentLocationClick])

  // 历史图层开关
  useUpdateEffect(() => layerRef.vectorLayer.setVisible(historyLayerVisible), [historyLayerVisible])

  // 根据城市选择定位
  useUpdateEffect(
    () => moveToViewByLocation(viewRef, [city?.lng || 0, city?.lat || 0] as [number, number]),
    [locate]
  )

  useUpdateEffect(() => clearScreen(interActionRef), [cleanSelected])
  // before init
  function beforeInit() {
    ref.current!.innerHTML = ''
    interActionRef.source = new VectorSource()
    interActionRef.hightLightSource = new VectorSource()
  }

  // 初始化layer
  function initLayer() {
    // 添加 卫星图
    layerRef.vecLayer = vecLayer
    // 添加街道图层
    layerRef.streetLayer = streetLayer
    // 添加地域名称图层
    layerRef.annLayer = annLayer

    // 添加 历史网架图层
    layerRef.vectorLayer = getVectorLayer(interActionRef.source!)
    // 添加高亮图层
    layerRef.hightLayer = getVectorLayer(interActionRef.hightLightSource!)

    // 添加 预设计图层
    if (mode === 'preDesign')
      layerRef.designLayer = getVectorLayer((interActionRef.designSource = new VectorSource()))
  }
  // 初始化view
  function initView() {
    viewRef.view = new View({
      center: proj.transform([104.08537388, 30.58850819], 'EPSG:4326', 'EPSG:3857'),
      zoom: 5,
      maxZoom: 25,
      minZoom: 1,
      projection: 'EPSG:3857',
    })
  }
  // 初始化地图实例
  function initMap() {
    mapRef.map = new Map({
      target: ref.current!,
      layers: Object.values(layerRef),
      view: viewRef.view,
      // controls: defaults({attribution: false})
    })
    // 清楚地图控件
    mapRef.map.getControls().clear()
    // 初始化地图比例尺
    handlerGeographicSize({ mode, viewRef })
  }

  // 绑定事件
  function bindEvent() {
    mapRef.map.on('click', (e: MapBrowserEvent<UIEvent>) =>
      mapClick(e, { interActionRef, mapRef, setState })
    )
    mapRef.map.on('pointermove', (e) => pointermove(e, { mode }))
    // 地图拖动事件
    mapRef.map.on('moveend', (e: MapEvent) => moveend(e))
    viewRef.view.on('change:resolution', () => handlerGeographicSize({ mode, viewRef }))
  }

  // 初始化interaction
  function initInterAction() {
    interActionRef.modify = new Modify({
      source: interActionRef.source,
      // 设置容差
      style: undefined,
      pixelTolerance: 25,
    })
    interActionRef.modify.on(['modifyend'], (e: Event | BaseEvent) => {
      // e.features.getArray()[0].setStyle(pointStyle.hight)
      // e.features.getArray()[0].setStyle(featureStyle.type2)
    })
    // 暂时屏蔽编辑功能
    false && mapRef.map.addInteraction(interActionRef.modify!)

    const pointSelect = new Select()
    const dragBox = new DragBox({})
    const boxSelect = new Select()
    const toggleSelect = new Select({
      condition: conditionClick,
      toggleCondition: platformModifierKeyOnly,
      style: (feature) => {
        const geometryType = feature.getGeometry()?.getType()

        return getStyle(geometryType)(
          feature.get('sourceType'),
          feature.get('typeStr') || '无类型',
          feature.get('name'),
          showText
        )
      },
    })
    // 绑定单选及多选回调事件
    toggleSelect.on('select', (e: SelectEvent) =>
      toggleSelectCallback(e, { interActionRef, setState, showText, mode })
    )
    pointSelect.on('select', (e: SelectEvent) =>
      pointSelectCallback(e, { interActionRef, setState, showText, mode })
    )
    toggleSelect.setHitTolerance(8)
    pointSelect.setHitTolerance(8)
    interActionRef.select = {
      pointSelect,
      toggleSelect,
    }

    mapRef.map.addInteraction(interActionRef.select.pointSelect)

    interActionRef.dragBox = dragBox
    const selectedFeatures = boxSelect.getFeatures()
    dragBox.on('boxend', function () {
      var extent = dragBox.getGeometry().getExtent()
      interActionRef.source!.forEachFeatureIntersectingExtent(extent, function (feature) {
        selectedFeatures.push(feature)
      })
    })
    // 框选鼠标按下清除高亮
    dragBox.on('boxstart', function () {
      selectedFeatures.clear()
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
      {false && (
        <div className="absolute bottom-0">
          <button onClick={() => setGeometryType(GeometryType.POINT)}>Point</button>
          <button
            style={{ color: 'red' }}
            onClick={() => setGeometryType(GeometryType.LINE_STRING)}
          >
            Line
          </button>
          <button style={{ color: 'red' }} onClick={() => setGeometryType('')}>
            None
          </button>
          <button
            onClick={() =>
              setState('mapLayerType', mapLayerType === 'SATELLITE' ? 'STREET' : 'SATELLITE')
            }
          >
            {mapLayerType === 'SATELLITE' ? '卫星图' : '街道图'}
          </button>
          <button>显示名称</button>
          <button onClick={() => setState('onCurrentLocationClick', !onCurrentLocationClick)}>
            定位到当前位置
          </button>
          <button onClick={() => setState('onProjectLocationClick', !onProjectLocationClick)}>
            定位到当前项目
          </button>
          <button onClick={() => setState('showText', !showText)}>元素名称开关</button>
          <button onClick={() => setState('cleanSelected', !cleanSelected)}>清屏</button>
          <button>导入</button>
          <button>{mode}</button>
          {/* <button onClick={() => setSelectType('')}>不选择</button>{' '}
        <button onClick={() => setSelectType('pointSelect')}>不选择</button>{' '} */}
          {/* <button onClick={() => setSelectType('boxSelect')}>框选</button> */}
          <button onClick={() => setState('isDraw', !isDraw)} style={{ color: 'red' }}>
            状态{isDraw ? '绘制' : '查看'}
          </button>
          <button
            onClick={() =>
              setState('dataSource', {
                lines: dataSource?.lines.slice(0, 1) ?? [],
                equipments: dataSource?.equipments.slice(0, 2) ?? [],
              })
            }
          >
            testData
          </button>
          <button onClick={() => setState('historyLayerVisible', !historyLayerVisible)}>
            历史图层{historyLayerVisible}
          </button>
        </div>
      )}
    </div>
  )
}

export default HistoryMapBase
