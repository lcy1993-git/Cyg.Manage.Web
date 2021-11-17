import '@/assets/icon/history-grid-icon.css'
import { useCurrentRef } from '@/utils/hooks'
import { useEventEmitter, useMount, useRequest, useUpdateEffect } from 'ahooks'
import { FeatureCollection, LineString as LineStringJSON, Point as PointJSON } from 'geojson'
import { Feature, Map, MapBrowserEvent, MapEvent, View } from 'ol'
import { click as conditionClick, platformModifierKeyOnly } from 'ol/events/condition'
import BaseEvent from 'ol/events/Event'
import GeoJSON from 'ol/format/GeoJSON'
import Geometry from 'ol/geom/Geometry'
import GeometryType from 'ol/geom/GeometryType'
import LineString from 'ol/geom/LineString'
import Point from 'ol/geom/Point'
import { DragBox, Draw, Modify, Select, Snap } from 'ol/interaction'
import { LineCoordType, PointCoordType } from 'ol/interaction/Draw'
import { SelectEvent } from 'ol/interaction/Select'
import { Layer } from 'ol/layer'
import 'ol/ol.css'
import * as proj from 'ol/proj'
import { Source, Vector as VectorSource } from 'ol/source'
import { useRef, useState } from 'react'
import { getData } from './data'
import { drawEnd } from './draw'
import { onMapLayerTypeChange, onSelectTypeChange } from './effects'
import { moveend, pointermove } from './event'
import mapClick from './event/mapClick'
import styles from './index.less'
import { annLayer, getVectorLayer, streetLayer, vecLayer } from './layers'
import { featureStyle, getStyle } from './styles'
import { DataSource } from './typings'
export interface MapRef {
  map: Map
}

export interface InterActionRef {
  draw?: Draw
  snap?: Snap
  source?: VectorSource<Geometry>
  hightLightSource?: VectorSource<Geometry>
  modify?: Modify
  isDraw?: boolean
  currentSelect?: Select
  select?: Record<Exclude<SelectType, ''>, Select>
  dragBox?: DragBox
  isDragBox?: boolean
}

export type SelectType = '' | 'pointSelect' | 'boxSelect'
export type MapLayerType = 'STREET' | 'SATELLITE'

const HistoryMapBase = () => {
  // 数据源
  const { data } = useRequest(getData)

  // 选择类型
  const [selectType, setSelectType] = useState<SelectType>('')
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
  const mapRef = useCurrentRef<MapRef>({ map: {} })
  // 图层缓存数据
  const layerRef = useCurrentRef<Record<string, Layer<Source>>>({})
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
    // test map in chrome
    // @ts-ignore
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
  // 加载数据
  useUpdateEffect(() => {
    LoadJSON1(data as DataSource)
  }, [JSON.stringify(data)])

  function LoadJSON1(data: DataSource) {
    if (data) {
      interActionRef.source?.clear()

      if (Array.isArray(data.point)) {
        const points = data.point.map((p) => {
          const feature = new Feature()
          feature.setGeometry(new Point([p.Lng!, p.Lat!]))
          feature.setStyle(getStyle('Point')(p.type))
          // feature.setStyle(pointStyle[p.type])
          Object.keys(p).forEach((key) => {
            feature.set(key, p[key])
          })
          return feature
        })

        interActionRef.source?.addFeatures(points)
      }
      if (Array.isArray(data.line)) {
        const lines = data.line.map((p) => {
          const feature = new Feature()
          feature.setGeometry(
            new LineString([
              [p.startLng!, p.startLat!],
              [p.endLng!, p.endLat!],
            ])
          )
          feature.setStyle(getStyle('LineString')(p.type))
          // feature.setStyle(lineStyle[p.type])
          Object.keys(p).forEach((key) => {
            feature.set(key, p[key])
          })
          return feature
        })
        console.log(lines)

        interActionRef.source?.addFeatures(lines)
      }
    }
  }

  // 处理当选择类型发生变化
  useUpdateEffect(() => onSelectTypeChange(selectType, interActionRef, mapRef), [selectType])
  // beforinit
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
    // 添加 vectorLayer
    layerRef.vectorLayer = getVectorLayer(interActionRef.source!)
    layerRef.hightLayer = getVectorLayer(interActionRef.hightLightSource!)
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
    mapRef.map.on('click', (e: MapBrowserEvent<UIEvent>) => mapClick(e, { interActionRef, mapRef }))
    mapRef.map.on('pointermove', (e) => pointermove(e))
    // 地图拖动事件
    mapRef.map.on('moveend', (e: MapEvent) => moveend(e))
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
    mapRef.map.addInteraction(interActionRef.modify!)

    const pointSelect = new Select()
    const dragBox = new DragBox({})
    const boxSelect = new Select()
    const toggleSelect = new Select({
      condition: conditionClick,
      toggleCondition: platformModifierKeyOnly,
      style: (feature) => {
        const geometryType = feature.getGeometry()?.getType()
        return getStyle(geometryType)(feature.get('type'))
      },
    })
    toggleSelect.on('select', (e: SelectEvent) => {
      console.log(e)
      function getType(f: Feature<Geometry>) {
        return f?.getGeometry()!.getType()
      }

      const select = e.target as Select
      const features = select.getFeatures()
      console.log(features)

      const firstFeature = features.item(0)

      if (firstFeature && features.getLength() > 1) {
        console.log(firstFeature)
        if (getType(firstFeature) === getType(e.selected[0] as Feature<Geometry>)) {
        } else {
        }
      }
      // return false
    })
    toggleSelect.setHitTolerance(8)
    // toggleSelect.on('change', (...args) => {
    //   console.log(...args);
    // })

    mapRef.map.addInteraction(toggleSelect)
    interActionRef.select = {
      pointSelect,
      boxSelect,
      // toggleSelect,
    }
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

  const onKeyDown = () => {
    console.log('down')
  }

  const onKeyUp = () => {
    console.log('up')
  }

  return (
    <div onKeyDown={onKeyDown} onKeyUp={onKeyUp} onKeyPress={onKeyDown}>
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
        <button onClick={() => setSelectType('pointSelect')}>点选</button>
        {/* <button onClick={() => setSelectType('toggleSelect')}>多选</button> */}
        <button onClick={() => setSelectType('boxSelect')}>框选</button>
      </div>
    </div>
  )
}

export default HistoryMapBase
