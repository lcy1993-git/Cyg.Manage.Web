import '@/assets/icon/history-grid-icon.css'
import { Map, View } from 'ol'
import Geometry from 'ol/geom/Geometry'
import { DragBox, Draw, Modify, Select, Snap } from 'ol/interaction'
import { Layer } from 'ol/layer'
import 'ol/ol.css'
import { Source, Vector as VectorSource } from 'ol/source'

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
  type: ElectricLineType
  startLng?: number
  startLat?: number
  endLng?: number
  endLat?: number
  remark?: string
  startId?: string
  endId?: string
}

export interface ElectricPointData {
  id: string
  name: string
  type: ElectricPointType
  lng?: number
  lat?: number
  remark?: string
}

export type DataSource = {
  equipments: ElectricPointData[]
  lines: ElectricLineData[]
}

export type SelectedData = (ElectricPointData | ElectricLineData)[]

export type SelectType = 'pointSelect' | 'toggleSelect'

export interface InterActionRef {
  draw?: Draw
  snap?: Snap
  source?: VectorSource<Geometry>
  hightLightSource?: VectorSource<Geometry>
  designSource: VectorSource<Geometry>
  modify?: Modify
  isDraw?: boolean
  currentSelect?: Select
  select?: Record<Exclude<SelectType, ''>, Select>
  dragBox?: DragBox
  isDragBox?: boolean
}

export interface LayerRef {
  vecLayer: Layer<Source>
  streetLayer:Layer<Source>
  annLayer:Layer<Source>
  vectorLayer: Layer<VectorSource<Geometry>>
  hightLayer: Layer<VectorSource<Geometry>>
  designLayer: Layer<VectorSource<Geometry>>
}

export interface ViewRef {
  view: View
}

export interface MapRef {
  map: Map
}
