import { EnvironmentFilled } from '@ant-design/icons'
import { Select } from 'antd'
import { useState } from 'react'
import CityPicker from './components/city-picker'
import FlowLayer from './components/flow-layer'
import OperationPane from './OperatePane'
import { useHistoryGridContext } from './store'

const FL_MARGIN_LEFT = 10

const ConsoleWrapper = () => {
  const { city, dispatch } = useHistoryGridContext()
  const [visible, setVisible] = useState(true)

  // const { data } = useApi(getRegionData)

  return (
    <>
      <FlowLayer left={FL_MARGIN_LEFT} top={FL_MARGIN_LEFT}>
        <OperationPane>
          <Select
            open={false}
            value={city?.name || '地区定位'}
            className="w-36 flex-grow-0 truncate"
            onClick={() => !visible && setVisible(true)}
          />
        </OperationPane>
      </FlowLayer>

      <FlowLayer
        left={FL_MARGIN_LEFT}
        top={FL_MARGIN_LEFT + 55}
        visible={visible}
        onClose={() => setVisible(false)}
        title="城市列表"
        showClose
      >
        <CityPicker
          value={city}
          onSelect={(city) => {
            dispatch({ type: 'setCity', payload: city })
            dispatch('locate')
          }}
        >
          <span
            onClick={() => dispatch('locate')}
            className="cursor-pointer text-base text-theme-green"
          >
            <EnvironmentFilled className="pr-1" />
            定位
          </span>
        </CityPicker>
      </FlowLayer>
    </>
  )
}

export default ConsoleWrapper
