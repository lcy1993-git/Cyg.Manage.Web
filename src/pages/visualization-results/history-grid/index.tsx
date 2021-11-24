import CityPickerWrapper from './CityPickerWrapper'
import HistoryMapBase from './components/history-map-base'
import AddElectricalEquipment from '@/pages/visualization-results/components/map-form/add-electrical-equipment'
import VersionManagement from '../components/version-management/index'
const HistoryGrid = () => {
  return (
    <div className="relative h-full">
      <HistoryMapBase />
      <CityPickerWrapper />
      {/*<AddElectricalEquipment data={[*/}
      {/*  {*/}
      {/*  name: 'string',*/}
      {/*  type: 'string',*/}
      {/*  remark: 'string',*/}
      {/*  length: 1,*/}
      {/*  level: '10' ,*/}
      {/*}*/}
      {/*]} type={'LineString'} visible={true} />*/}
      <VersionManagement />
    </div>
  )
}

export default HistoryGrid
