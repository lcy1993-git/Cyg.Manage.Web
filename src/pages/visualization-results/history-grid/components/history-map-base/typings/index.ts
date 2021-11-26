import '@/assets/icon/history-grid-icon.css'
import { Map, View } from 'ol'
import Geometry from 'ol/geom/Geometry'
import LineString from 'ol/geom/LineString'
import Point from 'ol/geom/Point'
import { DragBox, Draw, Modify, Select, Snap } from 'ol/interaction'
import { Layer } from 'ol/layer'
import 'ol/ol.css'
import { Source, Vector as VectorSource } from 'ol/source'
import { GridMapGlobalState } from '../../../store/mapReducer'

export type ElectricPointType =
  | '无类型'
  | '开闭所'
  | '环网柜'
  | '分支箱'
  | '配变'
  | '联络开关'
  | '分段开关'

export type ElectricLineType = '无类型' | '架空线' | '电缆'

export type GemotType = 'Point' | 'LineString'

export interface ElectricLineData {
  id: string
  name: string
  type: ElectricLineType | number
  typeStr: ElectricLineType
  startLng?: number
  startLat?: number
  endLng?: number
  endLat?: number
  remark?: string
  startId?: string
  endId?: string
  voltageLevelStr: string
  voltageLevel: number
}

export interface ElectricPointData {
  id: string
  name: string
  type: ElectricPointType | number
  typeStr: ElectricPointType
  lng?: number
  lat?: number
  remark?: string
  voltageLevelStr: string
  voltageLevel: number
}

export type DataSource = {
  id?: string
  equipments: ElectricPointData[]
  lines: ElectricLineData[]
}

export type EditDataSource = {
  equipments: ElectricPointData[]
  lines: ElectricLineData[]
  toBeDeletedEquipmentIds: []
  toBeDeletedLineIds: []
}

export type SelectedData = (ElectricPointData | ElectricLineData)[]

export type SelectType = 'pointSelect' | 'toggleSelect'

type selectKey = 'viewNoTextSelect' | 'viewTextSelect' | 'drawNoTextSelect' | 'drawTextSelect'

export interface InterActionRef {
  draw?: Draw
  snap?: Snap
  source?: VectorSource<Geometry>
  hightLightSource?: VectorSource<Geometry>
  designSource: VectorSource<Geometry>
  modify?: Modify
  isDraw?: boolean

  select: Record<selectKey, Select> & { currentSelect: Select | null }
  dragBox?: DragBox
  isDragBox?: boolean
}

export interface LayerRef {
  vecLayer: Layer<Source>
  streetLayer: Layer<Source>
  annLayer: Layer<Source>

  historyPointLayer: Layer<VectorSource<Point>>
  historyLineLayer: Layer<VectorSource<LineString>>
  designPointLayer: Layer<VectorSource<Point>>
  designLineLayer: Layer<VectorSource<LineString>>
  highLightPointLayer: Layer<VectorSource<Point>>
  highLightLineLayer: Layer<VectorSource<LineString>>
}

export interface ViewRef {
  view: View
}

export interface MapRef {
  mapRef: globalThis.Map<unknown, unknown>
  map: Map
}

export interface SourceRef {
  historyPointSource: VectorSource<Point>
  historyLineSource: VectorSource<LineString>
  designPointSource: VectorSource<Point>
  designLineSource: VectorSource<LineString>
  highLightPointSource: VectorSource<Point>
  highLightLineSource: VectorSource<LineString>
}

export type SetState = <T extends GridMapGlobalState, K extends keyof T = keyof T>(
  key: K,
  value: T[K]
) => void

/**
 * 数据源属性 是历史数据还是预设计数据
 * history 历史数据
 * design 预设计数据
 */
export enum SourceType {
  'history' = 'rgba(0, 117, 206, 1)',
  'design' = 'rgba(20, 168, 107, 1)',
  'highLight' = 'rgba(249, 149, 52, 1)',
}
