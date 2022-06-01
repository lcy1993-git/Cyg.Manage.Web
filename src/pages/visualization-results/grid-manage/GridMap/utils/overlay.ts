import Overlay from 'ol/Overlay'
import { transform } from 'ol/proj'
var overlayLayer: Overlay

export const addOverlay = (map: any, coordinate: any) => {
  document.getElementById('tag').style.display = 'block'
  overlayLayer = new Overlay({
    element: document.getElementById('tag'),
    position: coordinate,
    positioning: 'center-center',
    stopEvent: false,
    offset: [50, 30],
  })
  map.addOverlay(overlayLayer)
}

export const moveOverlay = (map: any, coorC: any) => {
  if (!overlayLayer) {
    addOverlay(map, coorC)
  }
  const lont = transform(coorC, 'EPSG:3857', 'EPSG:4326')
  overlayLayer.getElement().innerHTML = `${lont[0].toFixed(4)}, ${lont[1].toFixed(4)}`
  overlayLayer.setPosition(coorC)
}
