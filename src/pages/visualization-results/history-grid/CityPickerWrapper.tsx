import { EnvironmentFilled } from '@ant-design/icons'
import { Button, Select } from 'antd'
import { useCallback, useState } from 'react'
import CityPicker from './components/city-picker'
import FlowLayer from './components/flow-layer'
import { useHistoryGridContext } from './store'

const FL_MARGIN_LEFT = 10

const CityPickerWrapper = () => {
  const { city, mode, dispatch } = useHistoryGridContext()
  const [visible, setVisible] = useState(true)

  const onClick = useCallback(() => {
    const payload = mode === 'preDesign' ? 'preDesigning' : 'recordEdit'

    dispatch({ type: 'changeMode', payload: payload })
  }, [dispatch, mode])

  const BtnText = mode === 'preDesign' ? '预设' : mode === 'record' ? '绘制' : ''
  return (
    <>
      <FlowLayer left={FL_MARGIN_LEFT} top={FL_MARGIN_LEFT}>
        <div
          style={{ width: 280, height: 50 }}
          className="bg-white p-2 flex justify-between items-center"
        >
          <Select
            open={false}
            value={city?.name || '地区定位'}
            className="flex-1 truncate"
            onClick={() => !visible && setVisible(true)}
          />
          <Button className="ml-4" type="primary" onClick={onClick}>
            网架{BtnText}
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

export default CityPickerWrapper
