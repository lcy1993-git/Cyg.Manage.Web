import { EnvironmentFilled } from '@ant-design/icons'
import CityPicker from './components/city-picker'
import FlowLayer from './components/flow-layer'
import HistoryMapBase from './components/history-map-base'

const HistoryGrid = () => {
  return (
    <div className="relative h-full">
      <HistoryMapBase />

      <FlowLayer left={20} top={20} title="城市列表" showClose>
        <CityPicker
          onSelect={(city) => {
            console.log(city)
          }}
        >
          <span className="cursor-pointer text-base text-theme-green">
            <EnvironmentFilled className="pr-1" />
            定位
          </span>
        </CityPicker>
      </FlowLayer>
    </div>
  )
}

export default HistoryGrid
