import '@/assets/icon/history-grid-icon.css'
import { useCurrentRef } from '@/utils/hooks'
import { useEventEmitter, useMount, useUpdateEffect } from 'ahooks'
import { FeatureCollection, LineString as LineStringJSON, Point as PointJSON } from 'geojson'
import { Feature, Map, MapEvent, View } from 'ol'
import { always, pointerMove as ConditionMove } from 'ol/events/condition'
import BaseEvent from 'ol/events/Event'
import GeoJSON from 'ol/format/GeoJSON'
import Geometry from 'ol/geom/Geometry'
import GeometryType from 'ol/geom/GeometryType'
import LineString from 'ol/geom/LineString'
import Point from 'ol/geom/Point'
import { DragBox, Draw, Modify, Select, Snap } from 'ol/interaction'
import { LineCoordType, PointCoordType } from 'ol/interaction/Draw'
import { Layer } from 'ol/layer'
import 'ol/ol.css'
import * as proj from 'ol/proj'
import { Source, Vector as VectorSource } from 'ol/source'
import { useRef, useState } from 'react'
import { drawEnd } from './draw'
import { onMapLayerTypeChange } from './effects'
import { moveend, pointermove } from './event'
import styles from './index.less'
import { annLayer, getVectorLayer, streetLayer, vecLayer } from './layers'
import { featureStyle, modifyStyle } from './styles'
import pointStyle from './styles/pointStyles'

type SelecyType = '' | 'pointmove' | 'boxSelect'
type MapLayerType = 'STREET' | 'SATELLITE'

interface interActionRef {
  draw?: Draw
  snap?: Snap
  source?: VectorSource<Geometry>
  modify?: Modify
  isDraw?: boolean
  currentSelect?: Select
  select?: Record<Exclude<SelecyType, ''>, Select>
}

const HistoryMapBase = () => {
  // 选择类型
  const [selectType, setSelectType] = useState<SelecyType>('')
  // 绘制类型
  const [geometryType, setGeometryType] = useState<string>('')
  // 当前地图类型(街道图,卫星图)
  const [mapLayerType, setMapLayerType] = useState<MapLayerType>('SATELLITE')
  // 显示名称
  const [nameVisible, setNameVisible] = useState<boolean>(false)
  // 定位到当前项目
  const locateCurrent$ = useEventEmitter()
  // 根据地区定位地图事件
  const centerView$ = useEventEmitter()
  // 导入事件
  const importFile$ = useEventEmitter()
  // 保存事件
  const saveFile$ = useEventEmitter()

  const ref = useRef<HTMLDivElement>(null)
  // 地图实例
  const mapRef = useCurrentRef<{ map: Map }>({ map: {} })
  // 图层缓存数据
  const layerRef = useCurrentRef<Record<string, Layer<Source>>>({})
  // 视图实例
  const viewRef = useCurrentRef<{ view: View }>({})
  // 画图缓存数据
  const interActionRef = useCurrentRef<interActionRef>({})
  // 挂载地图
  useMount(() => {
    beforeInit()
    initLayer()
    initView()
    initMap()
    // test map
    window.m = mapRef.map
    // 初始化之后注册交互行为
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
  // 处理当选择类型发生变化
  useUpdateEffect(() => {}, [selectType])
  // beforinit
  function beforeInit() {
    ref.current!.innerHTML = ''
    interActionRef.source = new VectorSource()
  }
  // 初始化layer
  function initLayer() {
    // 添加 卫星图
    layerRef.vecLayer = vecLayer
    // 添加街道图层
    layerRef.streetLayer = streetLayer
    // 添加地域名称图层
    layerRef.annLayer = annLayer
    // 添加 vectorLayer
    layerRef.vectorLayer = getVectorLayer(interActionRef.source!)
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
  }

  // 绑定事件
  function bindEvent() {
    mapRef.map.on('click', (e: BaseEvent) => {})
    mapRef.map.on('pointermove', (e) => pointermove(e))
    // 地图拖动事件
    mapRef.map.on('moveend', (e: MapEvent) => moveend(e))
  }

  // 初始化interaction
  function initInterAction() {
    interActionRef.modify = new Modify({
      source: interActionRef.source,
      style: modifyStyle,
      // 设置容差

      pixelTolerance: 25,
    })
    interActionRef.modify.on(['modifyend'], (e: Event | BaseEvent) => {
      // e.features.getArray()[0].setStyle(pointStyle.hight)
      // e.features.getArray()[0].setStyle(featureStyle.type2)
    })

    mapRef.map.addInteraction(interActionRef.modify)
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

  function LoadJSON() {
    interActionRef.source?.clear()
    // 读取GeoJSON数据
    // new GeoJSON().writeFeatures(interActionRef.source?.getFeatures()!)
    const json = JSON.parse(window.localStorage.getItem('json')!) as FeatureCollection
    const features = json.features.map((f) => {
      const geometry = f.geometry as PointJSON | LineStringJSON

      const feature = new Feature()

      if (geometry.type === GeometryType.LINE_STRING) {
        feature.setGeometry(new LineString(geometry.coordinates as LineCoordType))
        feature.setStyle(featureStyle.type1)
      } else if (geometry.type === GeometryType.POINT) {
        const point = new Point(geometry.coordinates as PointCoordType)
        feature.setGeometry(point)
        feature.setStyle(pointStyle.t0)
      }
      return feature
    })

    interActionRef.source?.addFeatures(features)
  }

  const SaveJSON = () => {
    console.log(JSON.parse(new GeoJSON().writeFeatures(interActionRef.source?.getFeatures()!)))

    localStorage.setItem('json', new GeoJSON().writeFeatures(interActionRef.source?.getFeatures()!))
  }

  return (
    <div>
      <div ref={ref} style={{ height: window.innerHeight - 300, width: window.innerWidth }}></div>
      <button onClick={() => setGeometryType(GeometryType.POINT)}>Point</button>
      <button style={{ color: 'red' }} onClick={() => setGeometryType(GeometryType.LINE_STRING)}>
        Line
      </button>
      <button style={{ color: 'red' }} onClick={() => setGeometryType('')}>
        None
      </button>
      <button onClick={SaveJSON}>SaveJSON</button>
      <button onClick={LoadJSON}>加载数据</button>
      <button
        onClick={() => setMapLayerType(mapLayerType === 'SATELLITE' ? 'STREET' : 'SATELLITE')}
      >
        {mapLayerType === 'SATELLITE' ? '卫星图' : '街道图'}
      </button>

      <button>显示名称</button>
      <button>定位到当前位置</button>
      <button>定位到现有网架</button>
      <button
        onClick={() => {
          interActionRef.source?.clear()
        }}
      >
        清屏
      </button>
      <button>导入</button>
      <i className={styles.font}>&#xe901;</i>
      <div></div>
      <span id="historyGridPosition" style={{ color: 'red' }}>
        经维度：
      </span>
      <span id="historyGridScale" style={{ color: 'green' }}>
        比例：
      </span>
      <div>
        <span>选择方式：</span>
        <button onClick={() => setSelectType('')}>不选择</button>
        <button onClick={() => setSelectType('pointmove')}>鼠标悬浮</button>
        <button onClick={() => setSelectType('boxSelect')}>框选</button>
      </div>
    </div>
  )
}

export default HistoryMapBase
