import { Feature } from 'ol'
import LineString from 'ol/geom/LineString'
import Point from 'ol/geom/Point'
import * as proj from 'ol/proj'
import { DataSource, SourceRef, SourceType } from './../typings'

/**
 * 根据数据源渲染当前点位和线段
 * @param {DataSource} data 数据源
 * @param {InterActionRef} interActionRef interActionRef实例
 */

export function drawByDataSource(
  data: DataSource,
  {
    source,
    sourceType,
    sourceRef,
  }: {
    source: 'history' | 'design'
    sourceRef: SourceRef
    sourceType: keyof typeof SourceType
  },
  callback?: () => void | undefined
) {
  let cache: number = 0
  if (data) {
    // 清理缓存
    if (source === 'history') {
      sourceRef.historyLineSource.clear()
      sourceRef.historyPointSource.clear()
    } else if (source === 'design') {
      sourceRef.designLineSource.clear()
      sourceRef.designPointSource.clear()
    }

    // 渲染设备
    if (Array.isArray(data.equipments) && data.equipments.length > 0) {
      cache += 1
      const points = data.equipments.map((p) => {
        const feature = new Feature<Point>()
        feature.setGeometry(new Point(proj.transform([p.lng!, p.lat!], 'EPSG:4326', 'EPSG:3857')))
        feature.setProperties(p)
        feature.set('sourceType', sourceType)
        return feature
      })
      sourceRef[`${source}PointSource`].addFeatures(points)
    }

    // 渲染线路
    if (Array.isArray(data.lines) && data.lines.length > 0) {
      cache += 1
      const lines = data.lines.map((p) => {
        const feature = new Feature<LineString>()
        feature.setGeometry(
          new LineString([
            proj.transform([p.startLng!, p.startLat!], 'EPSG:4326', 'EPSG:3857'),
            proj.transform([p.endLng!, p.endLat!], 'EPSG:4326', 'EPSG:3857'),
          ])
        )

        // feature.setStyle(
        //   getStyle('LineString')(sourceType, p.typeStr || '无类型', p.name, showText)
        // )
        // feature.setStyle(lineStyle[p.type])
        // Object.keys(p).forEach((key) => {
        //   feature.set(key, p[key])
        // })
        feature.setProperties(p)
        feature.set('sourceType', sourceType)
        return feature
      })
      sourceRef[`${source}LineSource`].addFeatures(lines)
    }

    // 处理回调, 当数据加载完成时,cache > 0, 执行自适应屏幕回调
    if (cache > 0) {
      callback?.()
    }
  }
}
