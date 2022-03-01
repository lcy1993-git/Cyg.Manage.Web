import {
  getUseFulMapList,
  initIpLocation,
} from '@/services/visualization-results/visualization-results'
import { useMount, useRequest } from 'ahooks'
import MapContainer from '../map-container'

const UrlMapContainerBox = (props: any) => {
  const { data: mapData } = useRequest(() =>
    // getMapList({ sourceType: 0, layerType: 0, enableStatus: 1, availableStatus: 0 }),
    getUseFulMapList({
      serverCode: localStorage.getItem('serverCode'),
      layerType: 1,
      enableStatus: 0,
      // availableStatus: 0,
    })
  )
  const getLocation = async () => {
    await initIpLocation()
  }

  useMount(() => {
    getLocation()
  })

  return (
    <>
      {mapData && mapData.code === 200 && (
        <MapContainer mapData={mapData} {...props}></MapContainer>
      )}
    </>
  )
}

export default UrlMapContainerBox
