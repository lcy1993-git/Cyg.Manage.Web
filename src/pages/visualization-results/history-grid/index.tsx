import { useReducer } from 'react'
import { useLocation } from 'umi'
import HistoryVersionManagement from '../components/history-version-management'
import HistoryMapBase from './components/history-map-base'
import ConsoleWrapper from './ConsoleWrapper'
import DesignIconWrapper, { DesignLabel, HistoryBtn, Legend } from './DesignIconWrapper'
import DesignTitle from './DesignTitle'
import Footer from './Footer'
import { usePreDesign } from './hooks/usePreDesign'
import ImportGrid from './ImportGrid'
import MapOperator from './MapOperator'
import { HistoryGridContext, historyGridReducer } from './store'
import initialize from './store/initialize'

const HistoryGrid = () => {
  const location = useLocation()
  const [state, dispatch] = useReducer(historyGridReducer, { location }, initialize)

  usePreDesign(location, dispatch)

  return (
    <div className="relative h-full">
      <div className="relative" style={{ height: 'calc(100% - 40px)' }}>
        <HistoryGridContext.Provider value={{ ...state, dispatch }}>
          <HistoryMapBase />
          <DesignTitle />
          <MapOperator />
          <ConsoleWrapper />
          <DesignIconWrapper beforeIcon={<HistoryBtn />}>
            <DesignLabel />
            <Legend />
          </DesignIconWrapper>
          <HistoryVersionManagement />
          <ImportGrid />
          {/* <HistoryGirdForm /> */}
        </HistoryGridContext.Provider>
      </div>
      <Footer />
    </div>
  )
}

export default HistoryGrid
