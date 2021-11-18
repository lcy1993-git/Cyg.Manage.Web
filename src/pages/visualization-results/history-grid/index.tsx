import { useReducer } from 'react'
import CityPickerWrapper from './CityPickerWrapper'
import FlowLayer from './components/flow-layer'
import HistoryMapBase from './components/history-map-base'
import { HistoryGridContext, historyGridReducer, init, useHistoryGridContext } from './context'
import DesignIcon from './DesignIcon'
import styles from './index.less'
import AddElectricalEquipment from '@/pages/visualization-results/components/map-form/add-electrical-equipment'
import GridVersionManagement from '@/pages/visualization-results/history-grid/components/grid-version-management'
import HistoryVersionManagement from '@/pages/visualization-results/components/history-version-management'
const HistoryGrid = () => {
  const [state, dispatch] = useReducer(historyGridReducer, undefined, init)

  return (
    <div className="relative h-full">
      <HistoryGridContext.Provider value={{ ...state, dispatch }}>
        <HistoryMapBase />
        <DesignTitle />
        <CityPickerWrapper />
        <DesignIcon />
        <GridVersionManagement />
        <HistoryVersionManagement />
        {/*<AddElectricalEquipment data={[]} type={'Point'} visible/>*/}
      </HistoryGridContext.Provider>
    </div>
  )
}

/** 预设计标题 */
const DesignTitle = () => {
  const { mode, designData } = useHistoryGridContext()

  return mode === 'design' && designData ? (
    <FlowLayer className="text-white left-1/2 top-0 transform -translate-x-1/2">
      <div className={`${styles.designTitle} inline-block relative px-6 py-2`}>
        <span className="relative">预设计_{designData.title}</span>
      </div>
    </FlowLayer>
  ) : null
}

export default HistoryGrid
