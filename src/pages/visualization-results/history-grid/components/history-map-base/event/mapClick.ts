import { MapBrowserEvent } from 'ol'
import { HistoryDispatch } from '../../../store'
import type { InterActionRef, MapRef } from './../typings/index'

interface Ops {
  interActionRef: InterActionRef
  mapRef: MapRef
  setState: HistoryDispatch
  UIStatus: {
    /** 是否显示线路和电气设备名称 */
    showTitle: boolean
    /** 是否展示历史网架图层 */
    showHistoryLayer: boolean
    /** 是否定位到当前位置 */
    currentLocation: boolean
    /** 是否定位到现有网架 */
    currentProject: boolean
    /** 地图类型 street 街道 satellite 卫星 */
    mapType: 'street' | 'satellite'
    /** 是否为绘制状态 */
    drawing: boolean
    /** 是否显示导入模态框 */
    importModalVisible: boolean
    /** 记录版本和保存 */
    recordVersion: 'hide' | 'save' | 'record'
    /** 清屏 */
    cleanSelected: boolean
    /** 鼠标位置 */
    currentMousePosition: [number, number]
  }
}

export default function mapClick(
  e: MapBrowserEvent<MouseEvent>,
  { interActionRef, mapRef, setState, UIStatus }: Ops
) {
  setState((state: any) => ({
    ...state,
    UIStatus: { ...state.UIStatus, currentMousePosition: [...e.pixel] as [number, number] },
  }))

  // 当处于框选状态时，清理所有框选元素
  // if (interActionRef.isDragBox === true) {
  //   interActionRef.select!.boxSelect.getFeatures().clear()
  //   return
  // }
  // 多选状态下ctrl键按下 不进行操作
  // if (e.originalEvent.ctrlKey) return

  // console.log(sourceRef.historyPointSource.getFeatures());
  // console.log(sourceRef.historyLineSource.getFeatures());
  // console.log(sourceRef.designLineSource.getFeatures());
  // console.log(sourceRef.designLineSource.getFeatures());
  // console.log(sourceRef.highLightLineSource.getFeatures());
  // console.log(sourceRef.highLightPointSource.getFeatures());

  // 获取被选中的元素
  // const feature = mapRef.map.getFeaturesAtPixel(e.pixel)[0]
}
