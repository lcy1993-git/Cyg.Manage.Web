import { useReducer } from 'react'
import { useLocation } from 'umi'
import HistoryVersionManagement from '../components/history-version-management'
import HistoryMapBase from './components/history-map-base'
import { useVecUrl } from './components/history-map-base/utils/hooks'
import ConsoleWrapper from './ConsoleWrapper'
import DesignIconWrapper, { DesignLabel, HistoryBtn, Legend } from './DesignIconWrapper'
import DesignTitle from './DesignTitle'
import Footer from './Footer'
import { usePreDesign } from './hooks/usePreDesign'
import { useRefetch } from './hooks/useRefetch'
import { useSavaData } from './hooks/useSaveData'
import ImportGrid from './ImportGrid'
import MapOperator from './MapOperator'
import { HistoryGridContext, historyGridReducer, initializeHistoryState } from './store'

const HistoryGrid = () => {
  const location = useLocation()
  const [state, dispatch] = useReducer(historyGridReducer, { location }, initializeHistoryState)
  const { refetch, mode, preDesignItemData, UIStatus, historyDataSource } = state

  usePreDesign({ mode }, dispatch)
  useRefetch({ refetch, mode, preDesignItemData }, dispatch)
  useSavaData({
    preDesignDataSource: state.preDesignDataSource,
    mode,
    recordVersion: UIStatus.recordVersion,
    historyDataSource,
  })
  const [vecUrl] = useVecUrl()
  return (
    <div className="relative h-full w-full">
      <div className="relative w-full" style={{ height: 'calc(100% - 40px)' }}>
        <HistoryGridContext.Provider value={{ ...state, dispatch }}>
          {vecUrl && <HistoryMapBase />}
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
