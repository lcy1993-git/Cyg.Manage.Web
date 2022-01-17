import { useCallback } from 'react'
import MapDisplay from '../components/map-display'
import FlowLayer from './components/flow-layer'
import { useHistoryGridContext } from './store'

const MapSwitcher = () => {
  const { UIStatus, dispatch } = useHistoryGridContext()

  const onMapTypeChange = useCallback(
    (type) => {
      dispatch({
        type: 'changeUIStatus',
        payload: { ...UIStatus, mapType: type },
      })
    },
    [UIStatus, dispatch]
  )

  return (
    <FlowLayer bottom={40} right={15}>
      <div className="h-30 flex justify-end">
        <div className="relative">
          <MapDisplay
            onSatelliteMapClick={() => onMapTypeChange('satellite')}
            onStreetMapClick={() => onMapTypeChange('street')}
          />
        </div>
      </div>
    </FlowLayer>
  )
}

export default MapSwitcher
