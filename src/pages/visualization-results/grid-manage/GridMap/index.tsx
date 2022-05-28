import { uploadAllFeature } from '@/services/grid-manage/treeMenu'
import { useMount, useRequest } from 'ahooks'
import { useRef } from 'react'
import { useMyContext } from '../Context'
import { clear, initMap } from './utils/initializeMap'
import { deletCurrrentSelectFeature } from './utils/select'

const GridMap = () => {
  const { mapRef } = useMyContext()
  const ref = useRef<HTMLDivElement>(null)

  // 上传所有点位
  const { run: stationItemsHandle } = useRequest(uploadAllFeature, {
    manual: true,
    onSuccess: () => {
      localStorage.setItem('transformerStatiionList', JSON.stringify([]))
      localStorage.setItem('powerSupplyList', JSON.stringify([]))
      localStorage.setItem('boxTransformerList', JSON.stringify([]))
      localStorage.setItem('cableBranchBoxList', JSON.stringify([]))
      localStorage.setItem('cableWellList', JSON.stringify([]))
      localStorage.setItem('columnCircuitBreakerList', JSON.stringify([]))
      localStorage.setItem('columnTransformerList', JSON.stringify([]))
      localStorage.setItem('electricityDistributionRoomList', JSON.stringify([]))
      localStorage.setItem('ringNetworkCabinetList', JSON.stringify([]))
      localStorage.setItem('switchingStationList', JSON.stringify([]))
      localStorage.setItem('towerList', JSON.stringify([]))
    },
  })

  /** 上传本地数据 **/
  const uploadLocalData = () => {
    const towerList = JSON.parse(localStorage.getItem('towerList') || '[]')
    const switchingStationList = JSON.parse(localStorage.getItem('switchingStationList') || '[]')
    const ringNetworkCabinetList = JSON.parse(
      localStorage.getItem('ringNetworkCabinetList') || '[]'
    )
    const electricityDistributionRoomList = JSON.parse(
      localStorage.getItem('electricityDistributionRoomList') || '[]'
    )
    const columnTransformerList = JSON.parse(localStorage.getItem('columnTransformerList') || '[]')
    const columnCircuitBreakerList = JSON.parse(
      localStorage.getItem('columnCircuitBreakerList') || '[]'
    )
    const cableWellList = JSON.parse(localStorage.getItem('cableWellList') || '[]')
    const cableBranchBoxList = JSON.parse(localStorage.getItem('cableBranchBoxList') || '[]')
    const boxTransformerList = JSON.parse(localStorage.getItem('boxTransformerList') || '[]')
    const powerSupplyList = JSON.parse(localStorage.getItem('powerSupplyList') || '[]')
    const transformerStatiionList = JSON.parse(
      localStorage.getItem('transformerStatiionList') || '[]'
    )
    stationItemsHandle({
      towerList,
      switchingStationList,
      ringNetworkCabinetList,
      electricityDistributionRoomList,
      columnTransformerList,
      columnCircuitBreakerList,
      cableWellList,
      cableBranchBoxList,
      boxTransformerList,
      powerSupplyList,
      transformerStatiionList,
    })
  }

  // 挂载地图
  useMount(() => {
    initMap({ mapRef, ref })
    document.addEventListener('keydown', (e) => {
      if (e.keyCode === 27) {
        uploadLocalData()
        clear()
      }

      if (e.keyCode === 46 || e.keyCode === 8) {
        deletCurrrentSelectFeature(mapRef.map)
      }
    })
  })

  return <div ref={ref} id="map" className="w-full h-full"></div>
}

export default GridMap
