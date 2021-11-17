// type ElectricPointType =
//   | '无类型'
//   | '开闭所'
//   | '环网柜'
//   | '分支箱'
//   | '配变'
//   | '联络开关'
//   | '分段开关'
// type ElectricLineType = '无类型' | '架空线' | '电缆'

// type DataSource = {
//   point: ElectricPointData[]
//   line: ElectricLineData[]
// }

// const dataSource: DataSource = {
//   point: [],
//   line: [],
// }

// export default dataSource

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

let pIndex = 0
let lIndex = 0

const pt = ['无类型', '开闭所', '环网柜', '分支箱', '配变', '分段开关']
const lt = ['无类型', '架空线', '电缆']

testData.features.forEach((f, index) => {
  if (f.geometry.type === 'Point') {
    resData.point.push({
      id: '000' + index,
      name: Math.random().toString(16).slice(2),
      type: pt[pIndex++],
      Lng: f.geometry.coordinates[0],
      Lat: f.geometry.coordinates[1],
      remark: '',
    })
  } else if (f.geometry.type === 'LineString') {
    resData.line.push({
      id: '000' + index,
      name: Math.random().toString(16).slice(2),
      type: lt[lIndex++ % 3],
      startLng: f.geometry.coordinates[0][0],
      startLat: f.geometry.coordinates[0][1],
      endLng: f.geometry.coordinates[1][0],
      endLat: f.geometry.coordinates[1][1],
      remark: '',
      startId: '',
      endId: '',
    })
  }
})

console.log(resData)
