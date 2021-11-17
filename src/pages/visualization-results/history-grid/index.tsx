import CityPickerWrapper from './CityPickerWrapper'
import HistoryMapBase from './components/history-map-base'

const HistoryGrid = () => {
  return (
    <div className="relative h-full">
      <HistoryMapBase />
      <CityPickerWrapper />
    </div>
  )
}

export default HistoryGrid
