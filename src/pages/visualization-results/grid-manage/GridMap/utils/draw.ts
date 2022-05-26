import { Draw, Modify, Snap } from 'ol/interaction'
import { pointStyle } from './style'
class DrawTool {
  map: any
  options: any
  select: any
  draw: any
  snap: any
  modify: any
  source: any
  constructor(map: any, source: any, options: any) {
    this.map = map
    this.options = options
    this.source = source
    // this.addDraw(this.source, this.options.type_)
    // this.addSnap(this.source)
  }

  drawPoint(options: any) {
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
    this.draw.on('drawend', function (e: any) {
      e.feature.set('data', this_.options)
      e.feature.setStyle(pointStyle(this_.options))
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
}
export default DrawTool
