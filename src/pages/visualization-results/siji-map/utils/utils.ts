// 格式化输出时间
export const format = (fmt: string, date: Date) => {
  //author: meizz
  var o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  }
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
  return fmt
}

/**
 *  * wkt转经纬度坐标
 * @param {String} wkt  wkt数据
 * @returns
 */
export const wktToGeometry = (wkt: string) => {
  if (!wkt) {
    return
  }

  let type: any = wkt.match(/[a-zA-Z]+/g)
  if (!type) {
    return null
  }

  let coordinates = wkt.replace(type, '')
  coordinates = coordinates.trim()
  coordinates = coordinates.replaceAll('(', '[')
  coordinates = coordinates.replaceAll(')', ']')
  coordinates = coordinates.replaceAll(' ', ',')
  let lngLats = coordinatesFormat(JSON.parse(coordinates))
  const newType = getType(type[0])
  // 点特殊处理
  if (newType === 'point') {
    lngLats = lngLats[0]
  }

  return {
    type: newType,
    lngLats,
  }
}

/**
 * 经纬度坐标转wkt
 * @param {Object} geometry 要素空间信息
 * @returns
 */
export const geometryToWkt = (geometry: any) => {
  let { type, coordinates } = geometry

  let coordinateWkt = ''

  let typeMap: any = {
    point: getPointWkt,
    linestring: getLineWkt,
    multiLinestring: getMultiLineWkt,
    polygon: getPolygonWkt,
    multiPolygon: getMultiPolygonWkt,
  }

  // 根据类型调取方法
  if (typeMap[type]) {
    // 点特殊处理
    if (type === 'point') {
      coordinateWkt = `(${typeMap[type](coordinates)})`
    } else {
      coordinateWkt = typeMap[type](coordinates)
    }
  }
  return `${type}${coordinateWkt}`
}

/**
 * 判断是否为数组
 * @param arr
 * @returns
 */
const isArr = (arr: any) => {
  return Array.isArray(arr)
}

/**
 * 获取几何类型
 * @param type 类型
 * @returns
 */
const getType = (type: string) => {
  let newType = type.toLowerCase()

  if (newType === 'point') {
    return 'Point'
  } else if (newType === 'linestring') {
    return 'LineString'
  } else if (newType === 'multilinestring') {
    return 'MultiLineString'
  } else if (newType === 'polygon') {
    return 'Polygon'
  } else if (newType === 'multipolygon') {
    return 'MultiPolygon'
  }

  return newType
}

/**
 * 坐标处理
 * @param coordinates 原始坐标信息
 * @returns
 */
const coordinatesFormat = (coordinates: any) => {
  const arr = []
  if (!isArr) {
    return
  }
  for (let i = 0; i < coordinates.length; i++) {
    if (isArr(coordinates[i])) {
      coordinates[i] = coordinatesFormat(coordinates[i])
    } else {
      if (i % 2 === 0) {
        arr.push([coordinates[i], coordinates[i + 1]])
      }
      if (i === coordinates.length - 1) {
        coordinates = arr
      }
    }
  }
  return coordinates
}

/**
 * 获取点位wkt数据
 * @param coordinates 点位对象
 * @returns
 */
const getPointWkt = (coordinates: any) => {
  if (isArr(coordinates)) {
    return `${coordinates[1]} ${coordinates[0]}`
  }
}

/**
 * 获取线路wkt数据
 * @param coordinates 线路对象
 * @returns
 */
const getLineWkt = (coordinates: any) => {
  let str = ''
  if (isArr(coordinates)) {
    coordinates.forEach((coordinate: any) => {
      const symbol = str ? ',' : ''
      str += `${symbol}${getPointWkt(coordinate)}`
    })
  }
  return `(${str})`
}

/**
 * 获取多线wkt数据
 * @param coordinates 多线对象
 * @returns
 */
const getMultiLineWkt = (coordinates: any) => {
  let str = ''
  if (isArr(coordinates)) {
    coordinates.forEach((coordinate: any) => {
      const symbol = str ? ',' : ''
      str += `${symbol}${getLineWkt(coordinate)}`
    })
  }
  return `(${str})`
}

/**
 * 获取面wkt数据
 * @param coordinates 面对象
 * @returns
 */
const getPolygonWkt = (coordinates: any) => {
  return getMultiLineWkt(coordinates)
}

/**
 * 获取多面wkt数据
 * @param coordinates 多面对象
 * @returns
 */
const getMultiPolygonWkt = (coordinates: any) => {
  let str = ''
  if (isArr(coordinates)) {
    coordinates.forEach((coordinate: any) => {
      const symbol = str ? ',' : ''
      str += `${symbol}${getPolygonWkt(coordinate)}`
    })
  }
  return `(${str})`
}
