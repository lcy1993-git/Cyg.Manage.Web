import CityPickerWrapper from './CityPickerWrapper'
import HistoryMapBase from './components/history-map-base'
import VersionManagement from '@/pages/visualization-results/components/version-management'

const HistoryGrid = () => {
  return (
    <div className="relative h-full">
      <HistoryMapBase />
      <VersionManagement />
      <CityPickerWrapper />
    </div>
  )
}

export default HistoryGrid
