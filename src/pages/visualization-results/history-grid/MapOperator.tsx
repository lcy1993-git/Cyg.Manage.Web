import { Tooltip } from 'antd'
import { useCallback, useMemo, useRef } from 'react'
import FlowLayer from './components/flow-layer'
import Iconfont from './components/iconfont'
import MapSwitcher from './MapSwitcher'
import { useHistoryGridContext } from './store'

const MapOperator = () => {
  const { UIStatus, dispatch, historyDataSource, preDesignDataSource } = useHistoryGridContext()
  const { showTitle } = UIStatus

  const isClickable: boolean = useMemo(() => {
    return !!(
      historyDataSource?.equipments.length ||
      historyDataSource?.lines.length ||
      preDesignDataSource?.equipments.length ||
      preDesignDataSource?.lines.length
    )
  }, [historyDataSource, preDesignDataSource])

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
            icon={showTitle ? 'icon-xianshi' : 'icon-yincang'}
          />
        </div>

        <div>
          <IconSwitcher
            title="定位到当前位置"
            flag="currentLocation"
            onClick={onClick}
            icon="icon-a-dingweidaodangqianweizhi_n-fuben"
            className="hover:text-theme-green"
          />
        </div>

        <div>
          <IconSwitcher
            title={isClickable ? '定位到现有网架' : '无数据...'}
            flag="currentProject"
            onClick={onClick}
            className={isClickable ? `hover:text-theme-green cursor-pointer` : 'cursor-not-allowed'}
            icon="icon-a-dingweidaoxianyouwangjia_n-fuben"
          />
        </div>
      </div>
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
  const { mode: preMode } = useHistoryGridContext()

  const idRef = useRef(preMode === 'record' || preMode === 'recordEdit' ? 'record' : 'preDesign')

  return (
    <div className="bg-black bg-opacity-80 mt-1 px-2 py-1 text-white">
      <span id={`grid_map_${idRef.current}`} className="inline-block"></span>
      <span className="w-6 inline-block text-center"> | </span>
      比列尺：<span id={`grid_map_size_${idRef.current}`}></span>
    </div>
  )
}

export default MapOperator
