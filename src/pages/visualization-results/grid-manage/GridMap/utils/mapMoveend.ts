import { getScale } from './initializeMap'

// 当前比例尺映射到HTML节点
const mapMoveend = (evt: any, map: any) => {
  const scaleSize: HTMLSpanElement = document.getElementById('grid_map_size_') as HTMLSpanElement
  if (scaleSize !== null) scaleSize.innerHTML = getScale(map) || ''
}
export default mapMoveend
