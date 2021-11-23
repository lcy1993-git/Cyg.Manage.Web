import { HistoryGridVersion } from '@/pages/visualization-results/components/history-version-management'
import { createContext, Reducer, useContext } from 'react'
import { CityWithProvince } from '../components/city-picker/type'
import init, { InitParams } from './initialize'
import { GridMapGlobalState, mapReducer } from './mapReducer'

// ! 使用
// 子组件中调用 useHistoryGridContext hook
// 如：const { city, dispatch } = useHistoryGridContext()
// dispatch('reset')
// dispatch({ type: 'setCity', payload: city })
// dispatch((state: ReducerState) => ({...state})) 尽量不使用

// ! 新增状态
// 1. 在 ReducerState 增加新的 state 类型
// 2. 如果有初始状态，修改 init 函数
// 2. 如果需要传入参数对该 state 进行更新，首先在 ComplexActions 增加 action，
//    然后在 ComplexActionReflectPayload 中更新对应的传入参数类型
//    如不需要则在 SimpleActions 增加 action 即可
// 3. 更新 historyGridReducer 函数，增加 switch 逻辑

/** state */
export type ReducerState = {
  /** record 历史网架, recordEdit 历史网架绘制, preDesign 预设计, preDesigning 预设计中 */
  mode: 'record' | 'recordEdit' | 'preDesign' | 'preDesigning'
  /** 当前定位的城市 */
  city?: CityWithProvince
  /** 触发定位 */
  locate?: boolean
  gridMapState: GridMapGlobalState
  /** 预设计项目相关数据 */
  preDesignItemData?: any
  /** 当前网架数据 */
  currentGridData?: any
  /** 历史版本网架数据 */
  historyGridVersion: HistoryGridVersion
  /** 记录版本和保存 */
  recordVersion: 'hide' | 'save' | 'record'

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
    /** 地图类型 */
    mapType: 'street' | 'satellite'
  }
}

/** action */
type SimpleActions = 'locate'
type ComplexActions =
  | 'reset'
  | 'changeMode'
  | 'setCity'
  | 'changeUIStatus'
  | 'changeGridMap'
  | 'changeHistoryGirdVersion'
  | 'changePreDesignItemData'
  | 'changeCurrentGridData'
  | 'changeRecordVersion'

type Actions = SimpleActions | ComplexActions

type ComplexActionReflectPayload = {
  reset: InitParams
  changeMode: ReducerState['mode']
  setCity: ReducerState['city']
  changeGridMap: [any, any]
  changeUIStatus: ReducerState['UIStatus']
  changePreDesignItemData: ReducerState['preDesignItemData']
  changeHistoryGirdVersion: ReducerState['historyGridVersion']
  changeRecordVersion: ReducerState['recordVersion']
  changeCurrentGridData: ReducerState['currentGridData']
}

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
    case 'changeHistoryGirdVersion':
      return { ...state, historyGridVersion: payload }
    case 'changeRecordVersion':
      return { ...state, recordVersion: payload }
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
