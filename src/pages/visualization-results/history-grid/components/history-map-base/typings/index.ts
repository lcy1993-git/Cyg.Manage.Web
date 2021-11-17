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
  Lng?: number
  Lat?: number
  remark?: string
}

export type DataSource = {
  point: ElectricPointData[]
  line: ElectricLineData[]
}

export type SelectedData = (ElectricPointData | ElectricLineData)[]
