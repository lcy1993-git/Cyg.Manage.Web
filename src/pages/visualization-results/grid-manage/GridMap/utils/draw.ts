import { Draw, Modify, Snap } from 'ol/interaction'
import { lineStyle, pointStyle } from './style'
class DrawTool {
  map: any
  options: any
  select: any
  draw: any
  snap: any
  modify: any
  source: any
  constructor(map: any, options: any) {
    this.map = map
    this.options = options
    // this.addDraw(this.source, this.options.type_)
    // this.addSnap(this.source)
  }

  setSource(source: any) {
    this.source = source
  }

  drawGeometry(options: any) {
    this.options = options
    this.draw && this.map.removeInteraction(this.draw)
    this.snap && this.map.removeInteraction(this.snap)
    this.addDraw(this.source, this.options.type_)
    this.addSnap(this.source)
  }

  addDraw = (source: any, type: string) => {
    this.draw = new Draw({
      source: source,
      type,
    })
    this.map.addInteraction(this.draw)
    let this_ = this
    this.draw.on('drawabort ', function (e: any) {})

    this.draw.on('drawstart', function (e: any) {})

    this.draw.on('drawend', function (e: any) {
      e.feature.set('data', this_.options)
      if (e.feature.getGeometry().getType() === 'LineString')
        e.feature.setStyle(lineStyle(this_.options))
      else e.feature.setStyle(pointStyle(this_.options))
    })
  }

  addSnap = (source: any) => {
    this.snap = new Snap({ source: source })
    this.map.addInteraction(this.snap)
  }

  addModify = (source: any) => {
    this.modify = new Modify({ source: source })
    this.map.addInteraction(this.modify)
  }

  handleLine = () => {}
}
export default DrawTool
