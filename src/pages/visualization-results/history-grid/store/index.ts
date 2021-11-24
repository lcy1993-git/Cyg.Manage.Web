import { HistoryGridVersion } from '@/pages/visualization-results/components/history-version-management'
import { createContext, Reducer, useContext } from 'react'
import { CityWithProvince } from '../components/city-picker/type'
import { DataSource, SelectedData } from './../components/history-map-base/typings'
import init, { InitParams } from './initialize'
import { GridMapGlobalState, mapReducer } from './mapReducer'

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
  /** 当前网架数据 */
  currentGridData?: HistoryGridVersion
  /** 当前网架数据 */
  selectedData?: SelectedData
  /** 预设计项目相关数据 */
  preDesignItemData?: DataSource
  /** 所有历史版本网架数据 */
  allHistoryGridData?: HistoryGridVersion[]
  /** 历史版本网架数据 */
  historyGridVersion: HistoryGridVersion

  // 历史网架点线的数据
  historyDataSource: DataSource
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
    //* 鼠标位置*/
    currentMousePosition: [number, number]
  }
}

/** action */
type SimpleActions = 'locate' | 'refetch'

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
}

type ComplexActions = keyof ComplexActionReflectPayload
type Actions = SimpleActions | ComplexActions

type ReducerActionWithPayload = { type: Actions; payload: any }
type ReducerActionFn = (state: ReducerState) => ReducerState
type ReducerAction = Actions | ReducerActionWithPayload | ReducerActionFn

export const historyGridReducer: Reducer<ReducerState, ReducerAction> = (state, action) => {
  if (typeof action === 'function') {
    return action(state)
  }

  if (typeof action === 'string') {
    switch (action) {
      case 'locate':
        return { ...state, locate: !state.locate }
      case 'refetch':
        return { ...state, refetch: !state.refetch }
      default:
        throw new Error('action does not exist')
    }
  }

  const { type, payload } = action

  switch (type) {
    case 'changeMode':
      return { ...state, mode: payload }
    case 'changeUIStatus':
      return { ...state, UIStatus: payload }
    case 'setCity':
      return { ...state, city: payload }
    case 'reset':
      return init(payload)
    case 'changeGridMap':
      return { ...state, gridMapState: { ...mapReducer(state.gridMapState, payload) } }
    case 'changePreDesignItemData':
      return { ...state, preDesignItemData: payload }
    case 'changeCurrentGridData':
      return { ...state, currentGridData: payload }
    case 'changeSelectedData':
      return { ...state, selectedData: payload }
    case 'changeHistoryGirdVersion':
      return { ...state, historyGridVersion: payload }
    case 'changeAllHistoryGridData':
      return { ...state, allHistoryGridData: payload }
    case 'changeHistoryDataSource':
      return { ...state, historyDataSource: payload }
    default:
      throw new Error('action type does not exist')
  }
}

type DispatchParam<T extends ReducerAction> = T extends ReducerActionFn
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

export type HistoryState = ReducerState
export type HistoryDispatch = <T extends ReducerAction>(action: DispatchParam<T>) => void

export type HistoryGridContextType = ReducerState & { dispatch: HistoryDispatch }
export const HistoryGridContext = createContext<HistoryGridContextType>(
  {} as HistoryGridContextType
)
export const useHistoryGridContext = () => useContext(HistoryGridContext)
