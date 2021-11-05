import { Feature } from 'ol'
import GeometryType from 'ol/geom/GeometryType'
import LineString from 'ol/geom/LineString'
import Point from 'ol/geom/Point'
import { LineCoordType, PointCoordType } from 'ol/interaction/Draw'
import { Style } from 'ol/style'

type CoordType = PointCoordType | LineCoordType;

export const getFeature = (position: CoordType, gemotryType: string, type: string) => {
  const feature = new Feature();
  const gemotry = getGemotry(position, gemotryType)!;
  feature.setGeometry(gemotry);
  const style = getStyle(type);
  feature.setStyle(style);
  return feature;
}

function getGemotry(position: CoordType, gemotryType: string): Point | LineString | null  {
  if (gemotryType === GeometryType.POINT) {
    return new Point(position as PointCoordType)
  }
  if (gemotryType === GeometryType.LINE_STRING) {
    return new LineString(position as LineCoordType)
  }
  return null
}

function getStyle(type: string) {
  return new Style()
}
