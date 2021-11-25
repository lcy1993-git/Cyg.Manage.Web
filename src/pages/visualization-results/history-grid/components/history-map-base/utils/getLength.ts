import proj4 from 'proj4'
function getLineLength(startLont: number[], endLont: number[]): number {
  // 获取UTM坐标系的epsg值
  let zid = Math.round((startLont[0] + endLont[0]) / 2 / 6 + 31)
  let start = 32601
  let epsg = start + zid - 1 // 通过proj4将wgs84坐标转成UTM投影坐标
  let code = 'EPSG:' + epsg
  let info = '+proj=utm +zone=' + zid + ' +datum=WGS84 +units=m +no_defs'
  proj4.defs([[code, info]])
  let startLontUTM = proj4('EPSG:4326', code, startLont)
  let endLonttUTM = proj4('EPSG:4326', code, endLont) // 计算距离
  let distance = Math.sqrt(
    (startLontUTM[0] - endLonttUTM[0]) ** 2 + (startLontUTM[1] - endLonttUTM[1]) ** 2
  )
  return distance
}

export default getLineLength
