import CityPickerWrapper from './CityPickerWrapper'
import HistoryMapBase from './components/history-map-base'
import VersionManagement from '@/pages/visualization-results/components/version-management'
import AddElectricalEquipment, {
  ElectricalEquipmentForm,
} from '@/pages/visualization-results/components/map-form/add-electrical-equipment'

const HistoryGrid = () => {
  const onFiniosh = (value: ElectricalEquipmentForm) => {
    console.log(value)
  }
  return (
    <div className="relative h-full">
      <HistoryMapBase />
      {/*时间轴组件*/}
      <VersionManagement listHeight={'50vh'} />
      <CityPickerWrapper />
      <AddElectricalEquipment
        type={'edit'}
        onFinish={onFiniosh}
        values={{
          name: 'lzw',
          type: '1',
          remark: '123',
          level: '10',
        }}
      />
    </div>
  )
}

export default HistoryGrid
