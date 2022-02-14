import { Draw, Snap } from 'ol/interaction'
import { Vector as VectorLayer } from 'ol/layer'
import Map from 'ol/Map'
import { Vector as VectorSource } from 'ol/source'
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style'
interface DrawMapProps {
  geometryType: '' | 'Point' | 'LineString'
  map: Map
}

// 绘制设备线路逻辑在这里写

export const drawMap = ({ geometryType, map }: DrawMapProps) => {
  // console.log(geometryType);
  // console.log(map);

  const source = new VectorSource()
  const vector = new VectorLayer({
    source: source,
    style: new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)',
      }),
      stroke: new Stroke({
        color: '#ffcc33',
        width: 2,
      }),
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({
          color: '#ffcc33',
        }),
      }),
    }),
  })
  map.addLayer(vector)
  let draw = new Draw({
    source: source,
    type: geometryType,
  })
  map.addInteraction(draw)
  let snap = new Snap({ source: source })
  map.addInteraction(snap)
}
