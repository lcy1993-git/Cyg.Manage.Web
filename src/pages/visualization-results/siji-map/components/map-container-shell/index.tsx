import {
  getCustomMapList,
  getUseFulMapList,
  initIpLocation,
} from '@/services/visualization-results/visualization-results'
import { useMount, useRequest } from 'ahooks'
import MapContainer from '../map-container'

const SijiMapContainerBox = (props: any) => {
  const { data: mapData } = useRequest(() =>
    // getMapList({ sourceType: 0, layerType: 0, enableStatus: 1, availableStatus: 0 }),
    getUseFulMapList({
      serverCode: localStorage.getItem('serverCode'),
      layerType: 1,
      enableStatus: 1,
      // availableStatus: 0,
    })
  )

  const { data: customData } = useRequest(() => getCustomMapList({ isEnable: 1 }))
  const getLocation = async () => {
    await initIpLocation()
  }

  useMount(() => {
    getLocation()
  })
  return (
    <>
      {customData && mapData && (
        <MapContainer
          mapData={customData && customData.length > 0 ? customData : mapData}
          {...props}
        ></MapContainer>
      )}
    </>
  )
}

export default SijiMapContainerBox
