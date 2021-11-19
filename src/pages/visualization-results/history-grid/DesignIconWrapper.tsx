import { Checkbox } from 'antd'
import { FC, ReactNode, useState } from 'react'
import FlowLayer from './components/flow-layer'
import Iconfont from './components/iconfont'
import { useHistoryGridContext } from './store'

interface DesignIconWrapperProps {
  beforeIcon: ReactNode
}

const DesignIconWrapper: FC<DesignIconWrapperProps> = ({ children, beforeIcon }) => {
  const [_visible, setVisible] = useState(true)

  return (
    <FlowLayer className="select-none" right={15} top={10}>
      {beforeIcon}
      <div className="rounded-full text-right pb-2">
        <Iconfont
          symbol="icon-tufutuli"
          className="w-6 h-6 cursor-pointer bg-white rounded-full"
          onClick={() => setVisible(!_visible)}
        />
      </div>
      <div
        style={{ visibility: _visible ? 'visible' : 'hidden' }}
        className="bg-gray-900 bg-opacity-50 w-32 text-white select-none"
      >
        {children}
      </div>
    </FlowLayer>
  )
}

export const HistoryBtn = () => {
  const {
    UIStatus: { showHistoryLayer, ...rest },
    mode,
    dispatch,
  } = useHistoryGridContext()

  return mode === 'preDesign' || mode === 'preDesigning' ? (
    <div className="px-2 py-3 text-center mb-6 bg-white bg-opacity-80">
      <Checkbox
        checked={showHistoryLayer}
        onChange={() =>
          dispatch({
            type: 'changeUIStatus',
            payload: { ...rest, showHistoryLayer: !showHistoryLayer },
          })
        }
      />
      <span className="ml-2">历史网架</span>
    </div>
  ) : null
}

export const DesignLabel = () => {
  const { mode } = useHistoryGridContext()

  const labels = [
    { text: '历史', bg: 'bg-theme-blue' },
    { text: '预设', bg: 'bg-theme-green-light' },
  ]

  return mode === 'preDesigning' || mode === 'preDesign' ? (
    <div className="border-0 border-b border-solid border-gray-400 flex justify-between items-center p-2">
      {labels.map(({ text, bg }, index) => (
        <div key={index} className="w-max flex items-center">
          <i className={`block p-2 mr-1 ${bg}`} />
          {text}
        </div>
      ))}
    </div>
  ) : null
}

export const Legend = () => {
  const legends = [
    {
      text: '无类型',
      icon: 'icon-icon_weixuanxingganta-copy-copy',
      circle: true,
    },
    {
      text: '开闭所',
      icon: 'icon-xinjiankaiguanzhan',
      circle: true,
    },
    {
      text: '环网柜',
      icon: 'icon-xinjianhuanwangxiang',
      circle: true,
    },
    {
      text: '分支箱',
      icon: 'icon-fenzhixiang',
      circle: true,
    },
    {
      text: '配变',
      icon: 'icon-peibian',
      circle: true,
    },
    {
      text: '联络开关',
      icon: 'icon-lianluokaiguan',
      circle: true,
    },
    {
      text: '分段开关',
      icon: 'icon-fenduankaiguan',
      circle: true,
    },
    {
      text: '无类型',
      icon: 'icon-wuleixingxian',
    },
    {
      text: '架空线',
      icon: 'icon-jiakongxian',
    },
    {
      text: '电缆',
      icon: 'icon-dianlan',
    },
  ]
  return (
    <div className="px-5 py-2 flex-col justify-center w-full space-y-2">
      {legends.map(({ text, icon, circle }, index) => (
        <div key={index} className="flex items-center">
          <Iconfont
            style={{ color: 'rgb(20, 109, 175)' }}
            className={`mr-2 w-5 h-5 ${icon}${circle ? ' rounded-full bg-white' : ''}`}
            symbol={icon}
          />
          <span>{text}</span>
        </div>
      ))}
    </div>
  )
}

export default DesignIconWrapper
