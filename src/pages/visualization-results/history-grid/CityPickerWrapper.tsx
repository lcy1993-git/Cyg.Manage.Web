import { EnvironmentFilled } from '@ant-design/icons'
import { Button, Select } from 'antd'
import { useState } from 'react'
import CityPicker from './components/city-picker'
import FlowLayer from './components/flow-layer'
import { useHistoryGridContext } from './context'

const FL_MARGIN_LEFT = 10

const CityPickerWrapper = () => {
  const { city, dispatch } = useHistoryGridContext()
  const [visible, setVisible] = useState(true)

  return (
    <>
      <FlowLayer left={FL_MARGIN_LEFT} top={FL_MARGIN_LEFT}>
        <div
          style={{ width: 300, height: 50 }}
          className="bg-white p-2 flex justify-between items-center"
        >
          <Select
            open={false}
            value={city?.name || '选择城市'}
            className="flex-1"
            onClick={() => !visible && setVisible(true)}
          />
          <Button className="ml-4" type="primary">
            网架预设
          </Button>
        </div>
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
          }}
        >
          <span className="cursor-pointer text-base text-theme-green">
            <EnvironmentFilled className="pr-1" />
            定位
          </span>
        </CityPicker>
      </FlowLayer>
    </>
  )
}

export default CityPickerWrapper
