import { CloseOutlined } from '@ant-design/icons'
import { Form, Radio, Select } from 'antd'
import { useMyContext } from '../Context'

const { Option } = Select

interface PropsType {
  style: React.CSSProperties
}

const DrawToolbar = (props: PropsType) => {
  const { style } = props

  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 15 },
  }

  // const store = useContainer()
  const { setdrawToolbarVisible } = useMyContext()
  const toolbarOptions = [
    { label: '杆塔', value: 'Tower' },
    { label: '箱变', value: 'BoxTransformer' },
    { label: '电源', value: 'PowerPack' },
    { label: '环网柜', value: 'HXGN' },
    { label: '配电室', value: 'DistributionRoom' },
    { label: '开闭所', value: 'SSP' },
    { label: '变电站', value: 'Substation' },
    { label: '柱上断路器', value: 'Breaker' },
    { label: '电缆分支箱', value: 'DFW' },
  ]
  /**
   * 选择将要绘制的要素
   * */
  const selectDrawFeature = (result: any) => {}
  return (
    <div
      className="absolute top-2 right-4 w-60 rounded"
      style={{ background: 'rgba(255,255,255, .8)', height: '340px', ...style }}
    >
      <div className="absolute right-0 top-0 w-8 h-8">
        <span
          className="flex justify-center items-center h-full w-full"
          onClick={() => setdrawToolbarVisible(false)}
        >
          <CloseOutlined />
        </span>
      </div>
      <Form name="validate_other" {...formItemLayout} style={{ marginTop: '50px' }}>
        <Form.Item
          name="select"
          label="电压等级"
          hasFeedback
          rules={[{ required: true, message: '请选择电压等级' }]}
        >
          <Select placeholder="请选择电压等级" allowClear>
            <Option value="20KV">20KV</Option>
            <Option value="35KV">35KV</Option>
            <Option value="110KV">110KV</Option>
            <Option value="380KV">380KV</Option>
          </Select>
        </Form.Item>
        <Form.Item name="lineMode" label="线路型号" hasFeedback>
          <Select placeholder="请选择电压等级" allowClear>
            <Option value="20KV">20KV</Option>
            <Option value="35KV">35KV</Option>
            <Option value="110KV">110KV</Option>
            <Option value="380KV">380KV</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="rate"
          label="绘制图符"
          rules={[{ required: true, message: '请选择要绘制的图符' }]}
        >
          <Radio.Group
            style={{ marginTop: '6px' }}
            options={toolbarOptions}
            onChange={selectDrawFeature}
          />
        </Form.Item>
      </Form>
    </div>
  )
}

export default DrawToolbar
