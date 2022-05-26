import {
  Button,
  Col,
  Divider,
  Drawer,
  Form,
  Input,
  Radio,
  RadioChangeEvent,
  Row,
  Select,
} from 'antd'
import { useState } from 'react'
import { useMyContext } from '../Context'
import {
  BELONGINGCAPACITY,
  BELONGINGLINE,
  BELONGINGMODEL,
  BELONGINGPROPERITIES,
  CABLECIRCUITMODEL,
  FEATUREOPTIONS,
  KVLEVELOPTIONS,
  KVLEVELTYPES,
  LINEMODEL,
  POWERSUPPLY,
  TRANSFORMERSUBSTATION,
} from './GridUtils'
const { Option } = Select
const { useForm } = Form

const DrawToolbar = () => {
  const { drawToolbarVisible, setdrawToolbarVisible } = useMyContext()
  const [currentFeatureType, setcurrentFeatureType] = useState('PowerSupply')
  const [selectLineType, setselectLineType] = useState('')
  const [kelevelOptions, setkelevelOptions] = useState([
    ...KVLEVELOPTIONS.filter((item: KVLEVELTYPES) =>
      item.belonging.find((type: string) => type.includes(currentFeatureType))
    ),
  ])
  const [form] = useForm()
  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 },
  }

  /** 关闭模态框 **/
  const onClose = () => {
    setdrawToolbarVisible(false)
  }

  /** 图符型号 */
  const selectDrawFeature = (result: RadioChangeEvent) => {
    setcurrentFeatureType(result.target.value)
    const kelevelOptions = KVLEVELOPTIONS.filter((item: KVLEVELTYPES) =>
      item.belonging.find((type: string) => type.includes(result.target.value))
    )
    setkelevelOptions(kelevelOptions)
  }
  /** 选择线路型号 */
  const onChangeLineType = (value: string) => {
    setselectLineType(value)
    form.setFieldsValue({
      lineType: value,
      conductorModel: '',
    })
  }

  /** 插入图元 */
  const createFeature = () => {
    // const formData = form.getFieldsValue();
  }

  return (
    <Drawer
      title="绘制图元"
      placement="right"
      getContainer={false}
      style={{ position: 'absolute' }}
      mask={false}
      onClose={onClose}
      visible={drawToolbarVisible}
    >
      <Form
        {...formItemLayout}
        style={{ marginTop: '10px' }}
        form={form}
        initialValues={{ featureType: 'PowerSupply' }}
      >
        <Form.Item name="featureType" label="绘制图符">
          <Radio.Group
            className="EditFeature"
            options={FEATUREOPTIONS}
            onChange={selectDrawFeature}
          />
        </Form.Item>
        <Row style={{ display: 'flex', marginBottom: '16px', justifyContent: 'flex-end' }}>
          <Button style={{ marginRight: '16px' }} type="primary" onClick={createFeature}>
            插入图符
          </Button>
        </Row>
        <Divider plain></Divider>
        <Form.Item name="lineType" label="选择线路">
          <Row gutter={3}>
            <Col span={16}>
              <Select allowClear onChange={onChangeLineType}>
                <Option value="CableCircuit">电缆线路</Option>
                <Option value="Line">架空线路</Option>
              </Select>
            </Col>
            <Col span={5} style={{ marginLeft: '10px' }}>
              <Button type="primary">绘制线路</Button>
            </Col>
          </Row>
        </Form.Item>
        {selectLineType && (
          <Form.Item name="conductorModel" label="线路型号">
            <Select>
              {selectLineType === 'Line' && selectLineType
                ? LINEMODEL.map((item) => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))
                : CABLECIRCUITMODEL.map((item) => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
            </Select>
          </Form.Item>
        )}
        <Divider plain orientation="center">
          属性栏
        </Divider>

        <Form.Item
          name="name"
          // label={`${FEATUERTYPE[currentFeatureType]}名称`}
          label="名称"
        >
          <Input />
        </Form.Item>
        <Form.Item name="kvLevel" label="电压等级">
          <Select>
            {kelevelOptions.map((item) => (
              <Option key={item.kvLevel} value={item.kvLevel}>
                {item.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {/* 变电站 */}
        {currentFeatureType === TRANSFORMERSUBSTATION && (
          <>
            <Form.Item name="designScaleMainTransformer" label="设计规模">
              <Input />
            </Form.Item>
            <Form.Item name="builtScaleMainTransformer" label="已建规模">
              <Input />
            </Form.Item>
            <Form.Item name="mainWiringMode" label="主接线方式">
              <Input />
            </Form.Item>
          </>
        )}
        {/* 电源 */}
        {currentFeatureType === POWERSUPPLY && (
          <>
            <Form.Item name="powerType" label="电源类型">
              <Select>
                <Option value="水电">水电</Option>
                <Option value="火电">火电</Option>
                <Option value="风电">风电</Option>
                <Option value="光伏">光伏</Option>
                <Option value="生物质能">生物质能</Option>
              </Select>
            </Form.Item>
            <Form.Item name="installedCapacity" label="装机容量">
              <Input />
            </Form.Item>
            <Form.Item name="schedulingMode" label="调度方式">
              <Input />
            </Form.Item>
          </>
        )}

        {/* 杆塔 柱上断路器 柱上变压器*/}
        {BELONGINGLINE.includes(currentFeatureType) && (
          <Form.Item name="lineId" label="所属线路">
            <Select>
              <Option value="111">线路一</Option>
              <Option value="222">线路二</Option>
              <Option value="110KV">线路三</Option>
              <Option value="330KV">线路四</Option>
            </Select>
          </Form.Item>
        )}

        {/* 箱变 柱上变压器*/}
        {BELONGINGCAPACITY.includes(currentFeatureType) && (
          <>
            <Form.Item name="capacity" label="容量">
              <Input />
            </Form.Item>
          </>
        )}
        {/* 环网箱 */}
        {BELONGINGMODEL.includes(currentFeatureType) && (
          <>
            <Form.Item name="model" label="型号">
              <Input />
            </Form.Item>
          </>
        )}

        {BELONGINGPROPERITIES.includes(currentFeatureType) && (
          <Form.Item name="properties" label="配变性质">
            <Select>
              <Option value="公变">公变</Option>
              <Option value="专变">专变</Option>
            </Select>
          </Form.Item>
        )}

        <Form.Item name="lat" label="经度">
          <Input />
        </Form.Item>
        <Form.Item name="lng" label="纬度">
          <Input />
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default DrawToolbar
