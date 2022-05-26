import { Draw, Modify, Snap } from 'ol/interaction'
class DrawTool {
  map: any
  type: string
  select: any
  draw: any
  snap: any
  modify: any
  source: any
  constructor(map: any, source: any, type: string) {
    this.map = map
    this.type = type
    this.source = source
    this.addDraw(source, type)
    this.addSnap(source)
  }

  change(type: string) {
    this.map.removeInteraction(this.draw)
    this.map.removeInteraction(this.snap)
    this.addDraw(this.source, type)
    this.addSnap(this.source)
  }
  // addSelect = () => {
  //     this.select = new Select({
  //         layers,
  //         style: function(feature) {
  //             let geomType = feature.getGeometry().getType();
  //             if (geomType === 'LineString') {
  //                 return this_.style.getLineStyle(feature.get('data').layerName_, feature.get('data'), 1);
  //             }
  //             return this_.style.getPointStyle(feature.get('data').layerName_, feature.get('data'), 1, true, readonly, false);
  //         },
  //         hitTolerance: 10,
  //     });
  // }
  addDraw = (source: any, type: string) => {
    this.draw = new Draw({
      source: source,
      type,
    })
    this.map.addInteraction(this.draw)
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
