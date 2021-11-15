import AddElectricalEquipment from '@/pages/visualization-results/components/map-form/add-electrical-equipment'
import VersionManagement from '@/pages/visualization-results/components/version-management'
import { useReducer, useState } from 'react'
import CityPickerWrapper from './CityPickerWrapper'
import HistoryMapBase from './components/history-map-base'
import { HistoryGridContext, historyGridReducer, init } from './context'

const HistoryGrid = () => {
  const [state, dispatch] = useReducer(historyGridReducer, undefined, init)
  const [visible, setVisible] = useState<boolean>(true)

  return (
    <div className="relative h-full">
      <HistoryGridContext.Provider value={{ ...state, dispatch }}>
        <button onClick={() => setVisible(!visible)}>222</button>
        <HistoryMapBase />
        {/*时间轴组件*/}
        <VersionManagement listHeight={'50vh'} />
        <CityPickerWrapper />
        <AddElectricalEquipment
          showLength={true}
          type={'LineString'}
          visible={visible}
          position={{
            x: 500,
            y: 200,
          }}
          data={[]}
        />
      </HistoryGridContext.Provider>
    </div>
  )
}

export default HistoryGrid
