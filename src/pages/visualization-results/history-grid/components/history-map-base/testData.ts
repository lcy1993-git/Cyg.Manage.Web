// import * as proj from 'ol/proj'
// import testData from './data'
// // console.log(proj);
// // window.t = proj.transform

// const equipments = testData.equipments.map((item) => {
//   const [lng, lat] = proj.transform([item.lng!, item.lat!], 'EPSG:3857', 'EPSG:4326')
//   return {
//     ...item,
//     lng,
//     lat,
//   }
// })
// const lines = testData.lines.map((item) => {
//   const [startLng, startLat] = proj.transform(
//     [item.startLng!, item.startLat],
//     'EPSG:3857',
//     'EPSG:4326'
//   )
//   const [endLng, endLat] = proj.transform([item.endLng!, item.endLat], 'EPSG:3857', 'EPSG:4326')
//   return {
//     ...item,
//     startLng,
//     startLat,
//     endLng,
//     endLat,
//   }
// })

// const newData = {
//   equipments,
//   lines,
// }

// export default newData
