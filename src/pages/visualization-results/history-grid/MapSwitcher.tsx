import { useCallback } from 'react'
import CheckSource from '../components/check-source'
import MapDisplay from '../components/map-display'
import { HistoryState, useHistoryGridContext } from './store'

export type MapType = HistoryState['UIStatus']['mapType']

export type MapSwitcherProps = {
  onChange: (type: MapType) => void
}

const MapSwitcher = ({ onChange }: MapSwitcherProps) => {
  const { dispatch, sourceType, map } = useHistoryGridContext()

  const setSourceType = useCallback(
    (v) => {
      dispatch((d) => ({ ...d, sourceType: v }))
    },
    [dispatch]
  )

  return (
    <div className="relative">
      <MapDisplay
        onSatelliteMapClick={() => {
          onChange('satellite')
        }}
        onStreetMapClick={() => {
          onChange('street')
        }}
        setSourceType={setSourceType}
      />
      <CheckSource type={sourceType} map={map!} setSourceType={setSourceType}></CheckSource>
    </div>
  )
}

export default MapSwitcher
