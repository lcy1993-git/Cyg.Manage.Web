import { HistoryGridVersion } from '@/pages/visualization-results/components/history-version-management'
import { createContext, useContext } from 'react'
import { CityWithProvince } from '../components/city-picker/type'
import { DataSource, SelectedData } from './../components/history-map-base/typings'
import { InitParams } from './initialize'
import { GridMapGlobalState } from './mapReducer'
export * from './initialize'
export * from './reducer'

/** state */
export type ReducerState = {
  /** record 历史网架, recordEdit 历史网架绘制, preDesign 预设计, preDesigning 预设计中 */
  mode: 'record' | 'recordEdit' | 'preDesign' | 'preDesigning'

  /** 当前定位的城市 */
  city?: CityWithProvince
  /** 触发定位 */
  locate?: boolean

  /** 触发请求网架数据 */
  refetch: boolean
  /** 最新历史网架 */
  currentGridData?: HistoryGridVersion
  /** 当前网架数据 */
  selectedData?: SelectedData
  /** 预设计项目相关数据 */
  preDesignItemData?: any
  /** 所有历史版本网架数据 */
  allHistoryGridData?: HistoryGridVersion[]
  /** 历史版本网架数据 */
  historyGridVersion: HistoryGridVersion

  // 历史网架点线的数据
  historyDataSource: DataSource
  /** 预设计网架数据 */
  preDesignDataSource: DataSource
  gridMapState: GridMapGlobalState

  /** UI 状态 */
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

/** action */
type SimpleActions = 'locate' | 'refetch'
type ComplexActions = keyof ComplexActionReflectPayload

type ComplexActionReflectPayload = {
  reset: InitParams
  changeMode: ReducerState['mode']
  setCity: ReducerState['city']
  changeGridMap: ReducerState['gridMapState']
  changeUIStatus: ReducerState['UIStatus']
  changePreDesignItemData: ReducerState['preDesignItemData']
  changeAllHistoryGridData: ReducerState['allHistoryGridData']
  changeHistoryGirdVersion: ReducerState['historyGridVersion']
  changeCurrentGridData: ReducerState['currentGridData']
  changeSelectedData: ReducerState['selectedData']
  changeHistoryDataSource: ReducerState['historyDataSource']
  changePreDesignDataSource: ReducerState['preDesignDataSource']
}

type Actions = SimpleActions | ComplexActions
type ReducerActionWithPayload = { type: Actions; payload: any }
type ReducerActionFn = (state: ReducerState) => ReducerState

type DispatchParam<T extends HistoryAction> = T extends ReducerActionFn
  ? T
  : T extends string
  ? SimpleActions
  : Exclude<T, Actions | ReducerActionFn>['type'] extends `${infer S}`
  ? S extends SimpleActions
    ? { type: S }
    : S extends ComplexActions
    ? { type: S; payload: ComplexActionReflectPayload[S] }
    : ReducerActionWithPayload
  : ReducerActionWithPayload

export type HistoryGridContextType = ReducerState & { dispatch: HistoryDispatch }
export const HistoryGridContext = createContext<HistoryGridContextType>(
  {} as HistoryGridContextType
)
export const useHistoryGridContext = () => useContext(HistoryGridContext)

export type HistoryState = ReducerState
export type HistoryAction = Actions | ReducerActionWithPayload | ReducerActionFn
export type HistoryDispatch = <T extends HistoryAction>(action: DispatchParam<T>) => void
