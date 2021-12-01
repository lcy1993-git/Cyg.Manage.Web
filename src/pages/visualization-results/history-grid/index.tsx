import { useRequest } from 'ahooks'
import { useReducer } from 'react'
import { useLocation } from 'umi'
import HistoryVersionManagement from '../components/history-version-management'
import HistoryMapBase from './components/history-map-base'
import ConsoleWrapper from './ConsoleWrapper'
import DesignIconWrapper, { DesignLabel, HistoryBtn, Legend } from './DesignIconWrapper'
import DesignTitle from './DesignTitle'
import Footer from './Footer'
import { usePreDesign } from './hooks/usePreDesign'
import { useRefetch } from './hooks/useRefetch'
import { useSavaData } from './hooks/useSaveData'
import ImportGrid from './ImportGrid'
import MapOperator from './MapOperator'
import { initPreDesign } from './service/fetcher'
import { HistoryGridContext, historyGridReducer, initializeHistoryState } from './store'

const HistoryGrid = () => {
  const location = useLocation()
  const [state, dispatch] = useReducer(historyGridReducer, { location }, initializeHistoryState)
  const { refetch, mode, preDesignItemData, UIStatus, historyDataSource } = state
  useRequest(() => initPreDesign(preDesignItemData.id), {
    ready: !!preDesignItemData,
    onSuccess: (res) => {
      const initData = { ...state.preDesignDataSource, id: res.content }
      dispatch({ type: 'changePreDesignDataSource', payload: initData })
    },
  })

  usePreDesign({ location, mode }, dispatch)
  useRefetch({ refetch, mode, preDesignItemData }, dispatch)
  useSavaData({
    preDesignDataSource: state.preDesignDataSource,
    mode,
    recordVersion: UIStatus.recordVersion,
    historyDataSource,
  })

  return (
    <div className="relative h-full w-full">
      <div className="relative w-full" style={{ height: 'calc(100% - 40px)' }}>
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
