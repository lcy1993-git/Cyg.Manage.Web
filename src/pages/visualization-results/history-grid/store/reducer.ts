import { Reducer } from 'react'
import { HistoryAction, HistoryState, initializeHistoryState } from '.'
import { mapReducer } from './mapReducer'

export const historyGridReducer: Reducer<HistoryState, HistoryAction> = (state, action) => {
  if (typeof action === 'function') {
    // 命令式
    // dispatch((state) => ({...state}))
    return action(state)
  }

  if (typeof action === 'string') {
    // 没有 payload 的 action
    // dispatch('locate')

    switch (action) {
      case 'locate':
        return { ...state, locate: !state.locate }
      case 'refetch':
        return { ...state, refetch: !state.refetch }
      default:
        throw new Error('action does not exist')
    }
  }

  // 有 payload 的 action
  const { type, payload } = action

  switch (type) {
    case 'changeMode':
      return { ...state, mode: payload }
    case 'changeUIStatus':
      return { ...state, UIStatus: payload }
    case 'setCity':
      return { ...state, city: payload }
    case 'reset':
      return initializeHistoryState(payload)
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
    case 'changePreDesignDataSource':
      return { ...state, preDesignDataSource: payload }
    default:
      throw new Error(`action type does not exist, the type is ${type} `)
  }
}
