import { transform } from 'ol/proj'

// 计算主线路计算平行线
export const calculationLine = (features: any, LoopNumber: any) => {
  let multiloops = []
  for (let i = 0; i < features.length; i++) {
    const feature = features[i]
    const line: any = feature.getGeometry()
    const lonts = line.getCoordinates()
    let startLont, endLont
    startLont = lonts[0]
    endLont = lonts[1]

    let shapeCount = LoopNumber
    let startReferenceCoord = { x: startLont[0], y: startLont[1] }
    let endReferenceCoord = { x: endLont[0], y: endLont[1] }

    let cropLength_s, cropLength_e
    if (i === 0) cropLength_s = 0
    else cropLength_s = 0.5
    if (i === LoopNumber - 1) cropLength_e = 0
    else cropLength_e = 0.5

    for (let index = 0; index < shapeCount; index++) {
      let interval = getLineInterval(true, shapeCount)
      var s: any = computeParallelCoord(
        startReferenceCoord,
        endReferenceCoord,
        shapeCount,
        interval,
        index,
        true,
        cropLength_s
      )
      var e: any = computeParallelCoord(
        startReferenceCoord,
        endReferenceCoord,
        shapeCount,
        interval,
        index,
        false,
        cropLength_e
      )
      s = transform([s.x, s.y], 'EPSG:3857', 'EPSG:4326')
      e = transform([e.x, e.y], 'EPSG:3857', 'EPSG:4326')

      let wkt = `LINESTRING (${s[0]} ${s[1]},${e[0]} ${e[1]})`
      const loopData = { ...feature.get('data').data[index] }
      loopData.startId = feature.get('data').startId
      loopData.startType = feature.get('data').startType
      loopData.endId = feature.get('data').endId
      loopData.endType = feature.get('data').endType
      loopData.companyId = feature.get('data').companyId
      loopData.LoopNumber = LoopNumber
      loopData.name = feature.get('data').name
      loopData.type_ = feature.get('data').type_
      loopData.loop_serial = index + 1
      loopData.loop_seq = i + 1
      loopData.geom = wkt
      multiloops.push(loopData)
    }
  }
  return multiloops
}

// 根据两点计算平行线
export const calculationLineByPoints = (
  startCoord: any,
  endCoord: any,
  LoopNumber: number,
  isStart: boolean,
  isEnd: boolean
) => {
  const cropLength_s = isStart ? 0 : 0.5
  const cropLength_e = isEnd ? 0 : 0.5
  var datas: any = []
  for (let index = 0; index < LoopNumber; index++) {
    let interval = getLineInterval(true, LoopNumber)
    var s: any = computeParallelCoord(
      startCoord,
      endCoord,
      LoopNumber,
      interval,
      index,
      true,
      cropLength_s
    )
    var e: any = computeParallelCoord(
      startCoord,
      endCoord,
      LoopNumber,
      interval,
      index,
      false,
      cropLength_e
    )
    // s = transform([s.x, s.y], 'EPSG:3857', 'EPSG:4326')
    // e = transform([e.x, e.y], 'EPSG:3857', 'EPSG:4326')
    s = transform([s.x, s.y], 'EPSG:3857', 'EPSG:3857')
    e = transform([e.x, e.y], 'EPSG:3857', 'EPSG:3857')

    let wkt = `LINESTRING (${s[0]} ${s[1]},${e[0]} ${e[1]})`
    let loop_serial = index + 1
    datas.push({ wkt, loop_serial })
  }
  return datas
}

const getLineInterval = (isCable: any, shapeCount: any) => {
  var interval = 0
  if (shapeCount > 1) {
    var maxLength
    maxLength = isCable ? 1.5 : 2.5
    interval = maxLength / (shapeCount - 1)
  }
  return interval
}

// 根据参考点计算指定序号的点
const computeParallelCoord = (
  startReferenceCoord: any,
  endReferenceCoord: any,
  shapeCount: any,
  interval: any,
  index: any,
  isStartPoint: any,
  cropLength: any
) => {
  var destCoord = null
  if (isStartPoint) {
    startReferenceCoord =
      cropLength === 0
        ? startReferenceCoord
        : getCoordOnLine(startReferenceCoord, endReferenceCoord, cropLength)
    destCoord = computeParallelCoord_(
      null,
      startReferenceCoord,
      endReferenceCoord,
      shapeCount,
      interval,
      index
    )
  } else {
    //往延长线上增加一个临时终点用来临时参与计算
    var newStartCoord = { x: endReferenceCoord.x, y: endReferenceCoord.y }
    endReferenceCoord = getCoordOnLine(endReferenceCoord, startReferenceCoord, -5)

    startReferenceCoord =
      cropLength === 0
        ? newStartCoord
        : getCoordOnLine(newStartCoord, endReferenceCoord, -cropLength)
    destCoord = computeParallelCoord_(
      null,
      startReferenceCoord,
      endReferenceCoord,
      shapeCount,
      interval,
      index
    )
  }
  return destCoord
}

const computeParallelCoord_ = (
  preReferenceCoord: any,
  referenceCoord: any,
  nextReferenceCoord: any,
  shapeCount: any,
  interval: any,
  index: any
) => {
  var destCoord = null
  var offset: any = computeParallelCoordOffset(
    preReferenceCoord,
    referenceCoord,
    nextReferenceCoord,
    shapeCount,
    interval,
    index
  )
  destCoord = {
    x: referenceCoord.x + offset.x,
    y: referenceCoord.y + offset.y,
  }
  return destCoord
}

// 计算平行线上的点相对偏移
const computeParallelCoordOffset = (
  preReferenceCoord: any,
  referenceCoord: any,
  nextReferenceCoord: any,
  shapeCount: any,
  interval: any,
  index: any
) => {
  var centerIndex = (shapeCount - 1) / 2.0
  var distance = (centerIndex - index) * interval
  var offset = computeParallelCoordOffset_(
    preReferenceCoord,
    referenceCoord,
    nextReferenceCoord,
    distance
  )
  return offset
}

// 计算平行线上的点相对偏移
const computeParallelCoordOffset_ = (
  preReferenceCoord: any,
  referenceCoord: any,
  nextReferenceCoord: any,
  distance: any
) => {
  var offset = null
  if (referenceCoord == null) return offset
  offset = { x: 0, y: 0 }
  if (distance == 0) return offset

  var angle1 = angle_(referenceCoord, nextReferenceCoord, true)
  if (preReferenceCoord == null) {
    offset.x = -distance * Math.sin(angle1)
    offset.y = distance * Math.cos(angle1)
  } else {
    var angle0 = angle_(preReferenceCoord, referenceCoord, true)
    if (nextReferenceCoord == null) {
      offset.x = -distance * Math.sin(angle0)
      offset.y = distance * Math.cos(angle0)
    } else {
      var crossProduct = getCrossProduct(preReferenceCoord, referenceCoord, nextReferenceCoord) //叉积
      if (crossProduct == 0) {
        //在线上
        offset.x = -distance * Math.sin(angle0)
        offset.y = distance * Math.cos(angle0)
      } else {
        var radian = getAngleOfAngularBisector(
          preReferenceCoord,
          referenceCoord,
          nextReferenceCoord,
          false,
          true
        )
        var angle3 = angle1 + Math.PI / 2 - radian
        if (Math.cos(angle3) != 0) {
          distance /= Math.cos(angle3)
        }
        offset.x = distance * Math.cos(radian)
        offset.y = distance * Math.sin(radian)
      }
    }
  }
  return offset
}

const getCoordOnLine = (startPoint: any, endPoint: any, distance: any) => {
  var cmPoint = null
  if (startPoint != null && endPoint != null) {
    var radian = angle_(startPoint, endPoint, true)
    cmPoint = getCoordOnLine_(startPoint, radian, distance)
  }
  return cmPoint
}

const getCoordOnLine_ = (point: any, radian: any, distance: any) => {
  var cmPoint = null
  if (point != null) {
    cmPoint = getCoordOnLine__(point.x, point.y, radian, distance)
  }
  return cmPoint
}

const getCoordOnLine__ = (x: any, y: any, radian: any, distance: any) => {
  var dextX = distance * Math.cos(radian) + x
  var destY = distance * Math.sin(radian) + y
  //if (reverse)
  //{
  //    ///夹角（内角）平分线的点
  //    x = 2 * inflectionX - x;
  //    y = 2 * inflectionY - y;
  //}
  var cmPoint = { x: dextX, y: destY }
  return cmPoint
}

const angle_ = (startPoint: any, endPoint: any, useRadian: any) => {
  let startX = startPoint.x
  let startY = startPoint.y
  let endX = endPoint.x
  let endY = endPoint.y
  var dx = endX - startX
  var dy = endY - startY
  var dc = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
  let radian = 0
  if (dc != 0) {
    radian = Math.acos(dx / dc)
    if (dy < 0) {
      radian = Math.PI * 2 - radian
    }
    radian %= 2 * Math.PI
  }
  let angle = useRadian ? radian : (radian * 180) / Math.PI
  return angle
}

const getCrossProduct = (preReferenceCoord: any, referenceCoord: any, nextReferenceCoord: any) => {
  let startX = preReferenceCoord.x
  let startY = preReferenceCoord.y
  let x = referenceCoord.x
  let y = referenceCoord.y
  let endX = nextReferenceCoord.x
  let endY = nextReferenceCoord.y

  let x0 = endX - startX
  let y0 = endY - startY
  let x1 = x - startX
  let y1 = y - startY
  var crossProduct = x0 * y1 - y0 * x1 //叉积
  return crossProduct
}

const getAngleOfAngularBisector = (
  startPoint: any,
  inflectionPoint: any,
  endPoint: any,
  reverse: any,
  useRadian: any
) => {
  var angleOfAngularBisector = 0
  if (startPoint != null && inflectionPoint != null && endPoint != null) {
    angleOfAngularBisector = getAngleOfAngularBisector_(
      startPoint.x,
      startPoint.y,
      inflectionPoint.x,
      inflectionPoint.y,
      endPoint.x,
      endPoint.y,
      reverse,
      useRadian
    ) //角平分线角度;
  }
  return angleOfAngularBisector
}

const getAngleOfAngularBisector_ = (
  startX: any,
  startY: any,
  inflectionX: any,
  inflectionY: any,
  endX: any,
  endY: any,
  reverse: any,
  useRadian: any
) => {
  var inflection = { x: inflectionX, y: inflectionY }
  var start = { x: startX, y: startY }
  var angle0 = angle_(inflection, start, true)
  var angle1 = angle_(inflection, start, true)
  var angle = angle1 - angle0 //夹角
  var angleOfAngularBisector //角平分线角度
  if (angle > 0) {
    if (angle > Math.PI) {
      angleOfAngularBisector = Math.PI + angle0 + angle / 2
    } else {
      angleOfAngularBisector = angle0 + angle / 2
    }
  } else {
    if (angle < -Math.PI) {
      angleOfAngularBisector = Math.PI + angle0 + angle / 2
    } else {
      angleOfAngularBisector = angle0 + angle / 2
    }
  }
  angleOfAngularBisector %= Math.PI * 2
  if (reverse) {
    angleOfAngularBisector = angleOfAngularBisector - Math.PI
  }
  if (!useRadian) {
    angleOfAngularBisector *= 180 / Math.PI
  }
  return angleOfAngularBisector
}
