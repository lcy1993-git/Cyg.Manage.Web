import { Feature } from 'ol'
import { Coordinate } from 'ol/coordinate'
import Geometry from 'ol/geom/Geometry'
import LineString from 'ol/geom/LineString'
import { DrawEvent } from 'ol/interaction/Draw'
import { Vector as VectorSource } from 'ol/source'
import { Dispatch, SetStateAction } from 'react'

// 绘制完成的回调事件
export const drawEnd = (
  e: DrawEvent,
  source: VectorSource<Geometry>,
  closeDawType: Dispatch<SetStateAction<string>>
) => {
  // 对线折线数据进行拆分
  if (e.feature.getGeometry().getType() === 'LineString') {
    setTimeout(() => {
      // 获取绘制点点位信息数组
      const coordinates = e.feature.getGeometry().getCoordinates() as Coordinate[]
      const features = coordinates.reduce((pre: Feature<Geometry>[], [x, y], index, origin) => {
        if (!origin[index + 1]) return pre
        const [nextPonintX, nextPonintY] = origin[index + 1]
        const lineString = new LineString([
          [x, y],
          [nextPonintX, nextPonintY],
        ])
        const feature = new Feature(lineString)
        return pre.concat(feature)
      }, [])
      // 移除原有要素层
      source!.removeFeature(e.feature)
      // 将拆分生成的新要素层添加至图层
      source!.addFeatures(features)
    }, 0)
  }

  // 绘制完成后关闭绘制状态
  closeDawType('')
}
