import { createContext, Reducer, useContext } from 'react'
import { CityWithProvince } from './components/city-picker/type'

// ! 使用
// 子组件中调用 useHistoryGridContext hook
// 如：const { city, mapVisible, dispatch } = useHistoryGridContext()
// dispatch('closeMap')
// dispatch({ type: 'setCity', payload: city })

// ! 新增状态
// 1. 在 ReducerState 增加新的 state 类型
// 2. 如果有初始状态，修改 init 函数
// 2. 如果需要传入参数对该 state 进行更新，首先在 ComplexActions 增加 action，
//    然后在 ComplexActionReflectPayload 中更新对应的传入参数类型
//    如不需要则在 SimpleActions 增加 action 即可
// 3. 更新 historyGridReducer 函数，增加 switch 逻辑

/** state */
type ReducerState = {
  city?: CityWithProvince
}

/** action */
type SimpleActions = 'reset'
type ComplexActions = 'setCity'
type Actions = SimpleActions | ComplexActions

type ComplexActionReflectPayload<Action> = Action extends 'setCity' ? ReducerState['city'] : never

type ReducerActionWithPayload = { type: Actions; payload: any }
type ReducerAction = Actions | ReducerActionWithPayload

export const historyGridReducer: Reducer<ReducerState, ReducerAction> = (state, action) => {
  if (typeof action === 'string') {
    switch (action) {
      default:
        throw new Error('action does not exist')
    }
  }

  const { type, payload } = action

  switch (type) {
    case 'setCity':
      console.log(payload)
      return { ...state, city: payload }
    case 'reset':
      return init(payload)
    default:
      throw new Error('action type does not exist')
  }
}

/** 惰性初始化 */
export const init = (params: unknown) => {
  const initialState: ReducerState = {}

  return initialState
}

type DispatchParam<T extends ReducerAction> = T extends string
  ? SimpleActions
  : Exclude<T, Actions>['type'] extends `${infer S}`
  ? S extends Actions
    ? { type: S; payload: ComplexActionReflectPayload<S> }
    : ReducerActionWithPayload
  : ReducerActionWithPayload

export type HistoryGridContextType = ReducerState & {
  dispatch: <T extends ReducerAction>(action: DispatchParam<T>) => void
}

export const HistoryGridContext = createContext<HistoryGridContextType | null>(null)
export const useHistoryGridContext = () =>
  useContext(HistoryGridContext) as NonNullable<HistoryGridContextType>
