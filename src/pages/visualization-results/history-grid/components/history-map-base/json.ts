type ElectricPointType =
  | '无类型'
  | '开闭所'
  | '环网柜'
  | '分支箱'
  | '配变'
  | '联络开关'
  | '分段开关'
type ElectricLineType = '无类型' | '架空线' | '电缆'

interface ElectricLineData {
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

interface ElectricPointData {
  id: string
  name: string
  type: ElectricPointType
  Lng?: number
  Lat?: number
  remark?: string
}

type DataSource = {
  point: ElectricPointData[]
  line: ElectricLineData[]
}

const dataSource: DataSource = {
  point: [],
  line: [],
}

export default dataSource

const testData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [11328288.300262434, 3791136.272883413],
          [12309551.553392634, 4280473.356898209],
        ],
      },
      properties: null,
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [12309551.553392634, 4280473.356898209],
          [11607909.491128031, 3459733.380005667],
        ],
      },
      properties: null,
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [11607909.491128031, 3459733.380005667],
          [12757463.275797712, 3612489.4009415032],
        ],
      },
      properties: null,
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [12757463.275797712, 3612489.4009415032],
          [11947079.6393076, 3229304.80605161],
        ],
      },
      properties: null,
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [11328288.300262434, 3791136.272883413] },
      properties: null,
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [12309551.553392634, 4280473.356898209] },
      properties: null,
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [11607909.491128031, 3459733.380005667] },
      properties: null,
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [12757463.275797712, 3612489.4009415032] },
      properties: null,
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [11947079.6393076, 3229304.80605161] },
      properties: null,
    },
  ],
}

const resData = {
  point: [],
  line: [],
}

testData.features.forEach((f) => {
  if (f.geometry.type === 'Point') {
  } else if (f.geometry.type === 'LineString') {
  }
})
