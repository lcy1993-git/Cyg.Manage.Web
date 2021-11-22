import { Feature } from 'ol'
import LineString from 'ol/geom/LineString'
import Point from 'ol/geom/Point'
import { getStyle } from '../styles'
import { clear } from '../utils'
import { DataSource, InterActionRef, SourceType } from './../typings/index'

/**
 * 根据数据源渲染当前点位和线段
 * @param {DataSource} data 数据源
 * @param {InterActionRef} interActionRef interActionRef实例
 */

export function drawByDataSource(
  data: DataSource,
  {
    interActionRef,
    source,
    showText,
    sourceType
  }: {
    interActionRef: InterActionRef
    showText: boolean
    source: string,
    sourceType: keyof typeof SourceType
  }
) {

  if (data) {
    console.log(123);

    // 清理缓存
    clear(interActionRef)
    if(source === "source") interActionRef.source.clear()

    // 渲染设备
    if (Array.isArray(data.equipments)) {
      const points = data.equipments.map((p) => {
        const feature = new Feature()
        feature.setGeometry(new Point([p.lng!, p.lat!]))
        feature.setStyle(getStyle('Point')(sourceType, p.type || "无类型", p.name, showText))
        // feature.setStyle(pointStyle[p.type])
        // Object.keys(p).forEach((key) => {
        //   feature.set(key, p[key])
        // })
        feature.setProperties(p)
        feature.set("sourceType", sourceType)
        return feature
      })

      interActionRef[source].addFeatures(points)
    }

    // 渲染线路
    if (Array.isArray(data.lines)) {
      const lines = data.lines.map((p) => {
        const feature = new Feature()
        feature.setGeometry(
          new LineString([
            [p.startLng!, p.startLat!],
            [p.endLng!, p.endLat!],
          ])
        )

        feature.setStyle(getStyle('LineString')(sourceType, p.type || "无类型", p.name, showText))
        // feature.setStyle(lineStyle[p.type])
        // Object.keys(p).forEach((key) => {
        //   feature.set(key, p[key])
        // })
        feature.setProperties(p)
        feature.set("sourceType", sourceType)
        return feature
      })

      interActionRef[source]?.addFeatures(lines)
    }
  }
}
