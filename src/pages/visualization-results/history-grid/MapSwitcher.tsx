import MapDisplay from '../components/map-display'
import { HistoryState } from './store'

export type MapType = HistoryState['UIStatus']['mapType']

export type MapSwitcherProps = {
  onChange: (type: MapType) => void
}

const MapSwitcher = ({ onChange }: MapSwitcherProps) => {
  return (
    <div className="relative">
      <MapDisplay
        onSatelliteMapClick={() => {
          onChange('satellite')
        }}
        onStreetMapClick={() => {
          onChange('street')
        }}
      />
    </div>
  )
}

export default MapSwitcher
