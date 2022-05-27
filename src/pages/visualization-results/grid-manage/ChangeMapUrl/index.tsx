import { Tooltip } from 'antd'
import Map from 'ol/Map'
import { useCallback, useState } from 'react'
import CheckSource from '../../components/check-source'
import Iconfont from '../../history-grid/components/iconfont'
import MapSwitcher from '../../history-grid/MapSwitcher'
import { useHistoryGridContext } from '../../history-grid/store'
import FlowLayer from './FlowLayer'
const ChangMapUrl = () => {
  const { UIStatus, dispatch, historyDataSource, preDesignDataSource } = useHistoryGridContext()
  // 图层切换模态框类型
  const [sourceType, setSourceType] = useState<string | number>('')
  const [map, setMap] = useState<Map | null>(null)
  const [street, setStreet] = useState(0)
  const [satellite, setSatellite] = useState(0)

  const prop = { street, setStreet, satellite, setSatellite }

  const onClick = useCallback(
    (key: string) => {
      const payload = { ...UIStatus, [key]: !UIStatus[key] }
      dispatch({ type: 'changeUIStatus', payload })
    },
    [dispatch, UIStatus]
  )

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
    <FlowLayer className="select-none z-50" bottom={0} right={15}>
      <div className="text-right">
        <div>
          <IconSwitcher
            title="显示/关闭名称"
            flag="showTitle"
            onClick={onClick}
            icon={false ? 'icon-xianshi' : 'icon-yincang'}
          />
        </div>

        <div>
          <IconSwitcher
            title="定位到当前位置"
            flag="currentLocation"
            onClick={() => {}}
            icon="icon-a-dingweidaodangqianweizhi_n-fuben"
            className="hover:text-theme-green"
          />
        </div>

        <div>
          <IconSwitcher
            title={'定位到现有网架'}
            flag="currentProject"
            onClick={() => {}}
            // className={is Click able ? `hover:text-theme-green cursor-pointer` : 'cursor-not-allowed'}
            className={`hover:text-theme-green cursor-pointer`}
            icon="icon-a-dingweidaoxianyouwangjia_n-fuben"
          />
        </div>
      </div>
      {/* <div className="w-full h-30 flex justify-end">
        <CheckSource type={sourceType} map={map!} setSourceType={() => {}} {...prop} />
      </div> */}
      <div className="w-full h-30 flex justify-end">
        <MapSwitcher onChange={onMapTypeChange} />
      </div>
      <GeographicLocation />
    </FlowLayer>
  )
}

interface IconSwitcherProps {
  title: string
  icon: string
  flag: string
  onClick: (key: string) => void
  className?: string
  disabled?: boolean
}

export const IconSwitcher = ({ title, className, icon, flag, onClick }: IconSwitcherProps) => {
  const iconClass = 'w-7 h-7 bg-white'
  const clickEvent = (flag: string) => {
    onClick(flag)
  }
  return (
    <Tooltip placement="left" title={title}>
      <div className={`inline-block`}>
        <Iconfont
          className={iconClass + ` ${className || ''}`}
          symbol={icon}
          onClick={() => clickEvent(flag)}
        />
      </div>
    </Tooltip>
  )
}

export const GEOGRAPHIC_LOCATION = 'GeographicLocation'

export const GeographicLocation = () => {
  // const { mode: preMode } = useHistoryGridContext()

  // const idRef = useRef(preMode === 'record' || preMode === 'recordEdit' ? 'record' : 'preDesign')

  return (
    <div className="bg-black bg-opacity-80 mt-1 px-2 py-1 text-white">
      <span id={`grid_map_`} className="inline-block"></span>
      <span className="w-6 inline-block text-center"> | </span>
      比列尺：<span id={`grid_map_size_`}></span>
    </div>
  )
}

export default ChangMapUrl
