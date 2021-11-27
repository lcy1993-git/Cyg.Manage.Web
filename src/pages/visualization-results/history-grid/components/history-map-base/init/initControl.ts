import MousePosition from 'ol/control/MousePosition'
import { format } from 'ol/coordinate'
import { MapRef } from '../typings'

/**
 * memoText
 * 解决当前组件没有存在于地图上时候导致经纬度数据丢失的bug
 */
let memoText = ''

export function initControl({ mode, mapRef }: { mode: string; mapRef: MapRef }) {
  //鼠标获取坐标控件
  const mousePositionControl = new MousePosition({
    coordinateFormat: function (coordinate) {
      memoText = format(coordinate!, '经度:{x} 纬度:{y}', 4)

      return format(coordinate!, '经度:{x} 纬度:{y}', 4)
    },
    projection: 'EPSG:4326',
    className: 'custom-mouse-position',
    target: document.getElementById(`grid_map_${mode}`)!,
    undefinedHTML: memoText,
  })
  //添加控件到地图
  mapRef.map.addControl(mousePositionControl)
}
