// 引入假数据 后续需要删除
import { useHistoryGridContext } from '.'
import dataSource from '../components/history-map-base/data'
import type { DataSource, SelectedData } from '../components/history-map-base/typings'

export type MapLayerType = 'STREET' | 'SATELLITE'

export interface GridMapGlobalState {
  mapLayerType: string
  isDraw: boolean
  dataSource?: DataSource
  selectedData: SelectedData
  currentMousePosition: [number, number]
  cleanSelected: boolean
  moveToByCityLocation: [number, number, boolean]
  showText: boolean
  historyLayerVisible: boolean

  onCurrentLocationClick: boolean
  onProjectLocationClick: boolean
}

export const initGridMapState = {
  mapLayerType: 'SATELLITE', // 卫星图 ？ 街道图 ？
  isDraw: false, // 是否为绘制状态
  dataSource: dataSource, // 绘制元素的数据源 //这里暂时写假数据 后续真实数据过来需要删除
  selectedData: [], //被选中的元素
  currentMousePosition: [0, 0], // 当前操作鼠标位置
  cleanSelected: false, // 清屏(操作完成后)
  moveToByCityLocation: [0, 0, false], // 当城市被点击时  flag用于标识是否被点击
  showText: true, // 是否显示元素名称
  historyLayerVisible: true, // 历史网架开关
  // event
  onCurrentLocationClick: false, // 定位当用户当前位置
  onProjectLocationClick: false, // 定位当前项目
}

export const mapReducer = <T extends GridMapGlobalState, K extends keyof GridMapGlobalState>(
  state: T,
  props: [K, T[K]]
): T => {
  const [key, value] = props
  if (key in initGridMapState) {
    return { ...state, [key]: value }
  } else {
    console.error(`使用mapReducer时，发现错误的key,错误key为${key}`)
    return { ...state }
  }
}

export const useGridMap = () => {
  const { gridMapState, dispatch, mode } = useHistoryGridContext()

  return [
    gridMapState,
    <T extends GridMapGlobalState, K extends keyof T = keyof T>(key: K, value: T[K]) =>
      dispatch({ type: 'changeGridMap', payload: [key, value] }),
    mode,
  ] as const
}
