import CityPicker from './components/city-picker'
import HistoryMapBase from './components/history-map-base'

const HistoryGrid = () => {
  return (
    <div className="">
      <HistoryMapBase />
      <CityPicker
        onSelect={(city) => {
          console.log(city)
        }}
      >
        <span style={{ cursor: 'pointer' }}>定位</span>
      </CityPicker>
    </div>
  )
}

export default HistoryGrid
