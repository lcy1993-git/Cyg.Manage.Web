import { createContext, Reducer, useContext } from 'react'
import { CityWithProvince } from './components/city-picker/type'

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
type ReducerState = {
  /** record => 历史, history-edit => 历史绘制, edit => 预设计 */
  mode: 'record' | 'edit' | 'design'
  /** 当前定位的城市 */
  city?: CityWithProvince

  /** 预设计相关 */
  designData?: {
    /** 预设计名称 */
    title: string
  }
}

/** action */
type SimpleActions = never
type ComplexActions = 'reset' | 'changeMode' | 'setCity' | 'setDesignData'
type Actions = SimpleActions | ComplexActions

type ComplexActionReflectPayload<Action> = Action extends 'reset'
  ? InitParams
  : Action extends 'changeMode'
  ? ReducerState['mode']
  : Action extends 'setCity'
  ? ReducerState['city']
  : Action extends 'setDesignData'
  ? ReducerState['designData']
  : never

type ReducerActionWithPayload = { type: Actions; payload: any }
type ReducerActionFn = (state: ReducerState) => ReducerState
type ReducerAction = Actions | ReducerActionWithPayload | ReducerActionFn

export const historyGridReducer: Reducer<ReducerState, ReducerAction> = (state, action) => {
  if (typeof action === 'function') {
    return action(state)
  }

  if (typeof action === 'string') {
    switch (action) {
      default:
        throw new Error('action does not exist')
    }
  }

  const { type, payload } = action

  switch (type) {
    case 'changeMode':
      return { ...state, mode: payload }
    case 'setDesignData':
      return { ...state, designData: payload }
    case 'setCity':
      return { ...state, city: payload }
    case 'reset':
      return init(payload)
    default:
      throw new Error('action type does not exist')
  }
}

type InitParams = unknown

/** 惰性初始化 */
export const init = (params: InitParams) => {
  const initialState: ReducerState = {
    mode: 'design',
  }

  return initialState
}

type DispatchParam<T extends ReducerAction> = T extends ReducerActionFn
  ? T
  : T extends string
  ? SimpleActions
  : Exclude<T, Actions | ReducerActionFn>['type'] extends `${infer S}`
  ? S extends Actions
    ? IsNever<ComplexActionReflectPayload<S>> extends true
      ? { type: S }
      : { type: S; payload: ComplexActionReflectPayload<S> }
    : ReducerActionWithPayload
  : ReducerActionWithPayload

export type HistoryGridContextType = ReducerState & {
  dispatch: <T extends ReducerAction>(action: DispatchParam<T>) => void
}

export const HistoryGridContext = createContext<HistoryGridContextType | null>(null)
export const useHistoryGridContext = () =>
  useContext(HistoryGridContext) as NonNullable<HistoryGridContextType>
