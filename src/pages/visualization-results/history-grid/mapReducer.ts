import type { DataSource, SelectedData } from './components/history-map-base/typings'
import { useHistoryGridContext } from './context'

export type MapLayerType = 'STREET' | 'SATELLITE'

export interface GridMapGlobalState {
  mapLayerType: string
  isDraw: boolean
  dataSource?: DataSource
  selectedData: SelectedData
  currentMousePosition: [number, number]
  cleanSelected: boolean
}

export const initGridMapState = {
  mapLayerType: 'SATELLITE', // 卫星图 ？ 街道图 ？
  isDraw: false, // 是否为绘制状态
  dataSource: undefined, // 绘制元素的数据源
  selectedData: [], //被选中的元素
  currentMousePosition: [0, 0], // 当前操作鼠标位置
  cleanSelected: false, // 清屏(操作完成后)
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

// // 选择类型
// const [selectType, setSelectType] = useState<SelectType>('')
// // 绘制类型
// const [geometryType, setGeometryType] = useState<string>('')
// // 当前地图类型(街道图,卫星图)
// const [mapLayerType, setMapLayerType] = useState<MapLayerType>('SATELLITE')
// // 显示名称
// const [nameVisible, setNameVisible] = useState<boolean>(false)
// // 定位到当前项目
// const locateCurrent$ = useEventEmitter()
// // 根据地区定位地图事件
// const centerView$ = useEventEmitter()
// // 导入事件
// const importFile$ = useEventEmitter()
// // 保存事件
// const saveFile$ = useEventEmitter()

// const ref = useRef<HTMLDivElement>(null)
// // 地图实例
// const mapRef = useCurrentRef<MapRef>({ map: {} })
// // 图层缓存数据
// const layerRef = useCurrentRef<Record<string, Layer<Source>>>({})
// // 视图实例
// const viewRef = useCurrentRef<{ view: View }>({})
// // 画图缓存数据
// const interActionRef = useCurrentRef<InterActionRef>({})

export const useGridMap = () => {
  const { gridMapState, dispatch } = useHistoryGridContext()

  return [
    gridMapState,
    <T extends GridMapGlobalState, K extends keyof T = keyof T>(key: K, value: T[K]) =>
      dispatch({ type: 'changeGridMap', payload: [key, value] }),
  ] as const
}
