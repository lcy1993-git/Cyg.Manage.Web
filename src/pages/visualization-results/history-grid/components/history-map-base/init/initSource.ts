import VectorSource from 'ol/source/Vector'
import { SourceRef } from './../typings/index'

/**
 * 初始化数据源
 * @param sourceRef
 */
export function initSource(sourceRef: SourceRef) {
  // 历史网架
  sourceRef.historyPointSource = new VectorSource()
  sourceRef.historyLineSource = new VectorSource()
  // 预设计
  sourceRef.designPointSource = new VectorSource()
  sourceRef.designLineSource = new VectorSource()
  // 高亮
  sourceRef.highLightPointSource = new VectorSource()
  sourceRef.highLightLineSource = new VectorSource()
}
