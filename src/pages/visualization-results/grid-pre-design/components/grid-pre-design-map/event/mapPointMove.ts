import MapBrowserEvent from 'ol/MapBrowserEvent'
export default function pointermove(evt: MapBrowserEvent<MouseEvent>) {
  // 当前经纬度
  let coordinate = evt.coordinate
  const positionDom = document.getElementById('historyGridPosition')
  if (positionDom) {
    positionDom.innerHTML = `经度：${coordinate[0].toFixed(4)} 维度${coordinate[1].toFixed(4)}`
  }

  // let lont = transform(coordinate, 'EPSG:3857', 'EPSG:4326');
}
