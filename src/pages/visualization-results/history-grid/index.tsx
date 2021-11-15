import CityPickerWrapper from './CityPickerWrapper'
import HistoryMapBase from './components/history-map-base'
import VersionManagement from '@/pages/visualization-results/components/version-management'
import AddElectricalEquipment, {
  ElectricalEquipmentForm,
} from '@/pages/visualization-results/components/map-form/add-electrical-equipment'
import { useState } from 'react'

const HistoryGrid = () => {
  const [visible, setVisible] = useState<boolean>(true)
  return (
    <div className="relative h-full">
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
    </div>
  )
}

export default HistoryGrid
