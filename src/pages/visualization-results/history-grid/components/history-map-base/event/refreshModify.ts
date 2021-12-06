import { Collection, Feature } from 'ol'
import Geometry from 'ol/geom/Geometry'
import { Modify } from 'ol/interaction'
import { ModifyEvent } from 'ol/interaction/Modify'
import { InterActionRef, MapRef, SourceRef } from '../typings'

interface InitModify {
  interActionRef: InterActionRef
  mapRef: MapRef
  sourceRef: SourceRef
  isDraw: boolean
}

export function refreshModify({ interActionRef, mapRef, sourceRef, isDraw }: InitModify) {
  if (!isDraw) return
  const modify = new Modify({
    features: new Collection([
      ...sourceRef.historyLineSource.getFeatures(),
      ...sourceRef.historyPointSource.getFeatures(),
      ...sourceRef.designLineSource.getFeatures(),
      ...sourceRef.designPointSource.getFeatures(),
    ]),
    // style(f) {
    //   console.log(f);

    //   return (f as Feature<Geometry>).setStyle(
    //     getStyle(f.getGeometry()!.getType())(
    //       f.get('sourceType'),
    //       f.get('typeStr'),
    //       f.get('name'),
    //       true,
    //       true
    //     )
    //   )
    // },

    // features: interActionRef.select.currentSelect!.getFeatures()
  })

  modify.on('modifystart', (e: ModifyEvent) => {
    sourceRef.highLightSource.addFeatures(e.features.getArray() as Feature<Geometry>[])
  })
  modify.on('modifyend', (e: ModifyEvent) => {
    sourceRef.highLightSource.clear()
  })

  // 移除前一个modify
  if (interActionRef.modify) {
    mapRef.map.removeInteraction(interActionRef.modify)
  }
  interActionRef.modify = modify
  mapRef.map.addInteraction(interActionRef.modify)
}
