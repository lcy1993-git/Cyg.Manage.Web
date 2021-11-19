import { useReducer } from 'react'
import { useLocation } from 'umi'
import CityPickerWrapper from './CityPickerWrapper'
import HistoryMapBase from './components/history-map-base'
import DesignIconWrapper, { DesignLabel, HistoryBtn, Legend } from './DesignIconWrapper'
import DesignTitle from './DesignTitle'
import MapOperator from './MapOperator'
import { HistoryGridContext, historyGridReducer, init } from './store'

const HistoryGrid = () => {
  const location = useLocation()
  const [state, dispatch] = useReducer(historyGridReducer, { location }, init)

  return (
    <div className="relative h-full">
      <HistoryGridContext.Provider value={{ ...state, dispatch }}>
        <HistoryMapBase />
        <DesignTitle />
        <MapOperator />
        <CityPickerWrapper />
        <DesignIconWrapper beforeIcon={<HistoryBtn />}>
          <DesignLabel />
          <Legend />
        </DesignIconWrapper>
      </HistoryGridContext.Provider>
    </div>
  )
}

export default HistoryGrid
