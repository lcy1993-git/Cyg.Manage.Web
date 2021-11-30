import { getStyle } from '.'
import { SourceRef } from '../typings'

/**
 * 是否展示feature名
 * @param sourceRef
 * @param showText
 */
export function changeLayerStyleByShowText(sourceRef: SourceRef, showText: boolean) {
  ;[
    ...sourceRef.historyPointSource.getFeatures(),
    ...sourceRef.historyLineSource.getFeatures(),
    ...sourceRef.designPointSource.getFeatures(),
    ...sourceRef.designLineSource.getFeatures(),
  ].forEach((f) => {
    f.setStyle((f) => {
      return getStyle(f.getGeometry()!.getType())(
        f.get('sourceType'),
        f.get('typeStr'),
        f.get('name'),
        showText
      )
    })
  })
}
