import { Feature } from 'ol'
import Geometry from 'ol/geom/Geometry'
import RenderFeature from 'ol/render/Feature'
import { Style } from 'ol/style'
import { getStyle } from '.'

export const getLayerStyleByShowText = (showText: boolean) => (
  f: RenderFeature | Feature<Geometry>
): Style[] => {
  if (f.getGeometry()?.getType() === 'Point') {
    return getStyle('Point')(
      f.get('sourceType'),
      f.get('typeStr') || '无类型',
      f.get('name'),
      showText
    )
  } else {
    return getStyle('LineString')(
      f.get('sourceType'),
      f.get('typeStr') || '无类型',
      f.get('name'),
      showText
    )
  }
}
