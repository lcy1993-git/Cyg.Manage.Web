import { useReducer } from 'react'
import CityPickerWrapper from './CityPickerWrapper'
import HistoryMapBase from './components/history-map-base'
import { HistoryGridContext, historyGridReducer, init } from './context'

const HistoryGrid = () => {
  const [state, dispatch] = useReducer(historyGridReducer, undefined, init)

  return (
    <div className="relative h-full">
      <HistoryGridContext.Provider value={{ ...state, dispatch }}>
        <HistoryMapBase />
        <CityPickerWrapper />
      </HistoryGridContext.Provider>
    </div>
  )
}

export default HistoryGrid
