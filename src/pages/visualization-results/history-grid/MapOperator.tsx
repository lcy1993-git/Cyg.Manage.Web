import { Tooltip } from 'antd'
import { useCallback } from 'react'
import FlowLayer from './components/flow-layer'
import Iconfont from './components/iconfont'
import { Satellite, Street } from './Images'
import { HistoryState, useHistoryGridContext } from './store'

const MapOperator = () => {
  const { UIStatus, dispatch } = useHistoryGridContext()
  const { showTitle, currentLocation, currentProject } = UIStatus

  const onClick = useCallback(
    (key: string) => {
      const payload = { ...UIStatus, [key]: !UIStatus[key] }
      dispatch({ type: 'changeUIStatus', payload })
    },
    [dispatch, UIStatus]
  )

  return (
    <FlowLayer className="select-none" bottom={0} right={15}>
      <div className="text-right">
        <div>
          <IconSwitcher
            title="显示/关闭名称"
            flag="showTitle"
            onClick={onClick}
            icon={showTitle ? 'icon-xianshi' : 'icon-yincang'}
          />
        </div>

        <div>
          <IconSwitcher
            title="定位到当前位置"
            flag="currentLocation"
            onClick={onClick}
            icon={
              currentLocation
                ? 'icon-dingweidaodangqianweizhi_h'
                : 'icon-dingweidaodangqianweizhi_n'
            }
          />
        </div>

        <div>
          <IconSwitcher
            title="定位到现有网架"
            flag="currentProject"
            onClick={onClick}
            icon={
              currentProject ? 'icon-dingweidaoxianyouwangjia_h' : 'icon-dingweidaoxianyouwangjia_n'
            }
          />
        </div>
      </div>
      <div className="w-full h-28 flex justify-end">
        <MapSwitcher />
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
}

export const IconSwitcher = ({ title, icon, flag, onClick }: IconSwitcherProps) => {
  const iconClass = 'w-7 h-7 bg-white cursor-pointer'

  return (
    <Tooltip placement="left" title={title}>
      <div className="inline-block">
        <Iconfont className={iconClass} symbol={icon} onClick={() => onClick(flag)} />
      </div>
    </Tooltip>
  )
}

type MapType = HistoryState['UIStatus']['mapType']

export const MapSwitcher = () => {
  const { UIStatus, dispatch } = useHistoryGridContext()
  const { mapType } = UIStatus

  const getClassName = useCallback(
    (type: MapType) => {
      const defaultClass = 'cursor-pointer border border-solid w-24 h-20'
      const typeClass = `${mapType === type ? 'border-theme-green-darker' : 'border-transparent'}`
      return `${defaultClass} ${typeClass}`
    },
    [mapType]
  )

  const changeMapType = useCallback(
    (e: React.MouseEvent<HTMLImageElement>) => {
      dispatch({
        type: 'changeUIStatus',
        payload: { ...UIStatus, mapType: ((e.target as unknown) as { alt: MapType }).alt },
      })
    },
    [dispatch, UIStatus]
  )

  const descTextClass = 'absolute px-1 bg-theme-green-darker'
  const descTextStyle = { right: 1, bottom: 1 }

  return (
    <div className="mt-4 w-max bg-white text-white flex space-x-2 p-2">
      <div className="relative">
        <Street alt="street" className={getClassName('street')} onClick={changeMapType} />
        <span style={descTextStyle} className={descTextClass}>
          街道图
        </span>
      </div>
      <div className="relative">
        <Satellite alt="satellite" className={getClassName('satellite')} onClick={changeMapType} />
        <span style={descTextStyle} className={descTextClass}>
          卫星图
        </span>
      </div>
    </div>
  )
}

export const GEOGRAPHIC_LOCATION = 'GeographicLocation'

export const GeographicLocation = () => {
  const { UIStatus, dispatch, mode } = useHistoryGridContext()

  const { currentLocation } = UIStatus

  const action = {
    type: 'changeUIStatus',
    payload: {
      ...UIStatus,
      currentLocation: !currentLocation,
    },
  }
  return (
    <div className="bg-black bg-opacity-80 mt-1 px-2 py-1 text-white" id={GEOGRAPHIC_LOCATION}>
      经度：
      <span className="inline-block" id={`grid_map_lat_${mode}`}>
        123
      </span>
      <span className="w-2 inline-block text-center"> </span>
      维度：<span id={`grid_map_lng_${mode}`}>123</span>
      <span className="w-6 inline-block text-center"> | </span>
      比列尺：<span id={`grid_map_size_${mode}`}></span>
    </div>
  )
}

export default MapOperator
