import { getAllBelongingLineItem } from '@/services/grid-manage/treeMenu'
import { useRequest } from 'ahooks'
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
  Tabs,
} from 'antd'
import { useEffect, useState } from 'react'
import { useMyContext } from '../Context'
import { drawLine, drawPoint } from '../GridMap/utils/initializeMap'
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
  RINGNETWORKCABINET,
  TRANSFORMERSUBSTATION,
} from './GridUtils'
const { Option } = Select
const { useForm } = Form
const { TabPane } = Tabs

interface BelongingLineType {
  id: string
  name: string
  kvLevel: number
  isOverhead: boolean
  isPower: boolean
}

const DrawToolbar = () => {
  const {
    drawToolbarVisible,
    setdrawToolbarVisible,
    mapRef,
    setisRefresh,
    isRefresh,
    zIndex,
    setzIndex,
  } = useMyContext()
  const [currentFeatureType, setcurrentFeatureType] = useState('PowerSupply')
  const [selectLineType, setselectLineType] = useState('')
  const [currentKvleve, setcurrentKvleve] = useState<number>()
  const [currentFeature, setcurrentFeature] = useState('feature')
  // const [currentfeatureData, setcurrentfeatureData] = useState({ id: '', geom: '' })
  // 变电站间隔模态框
  // const [editModel, seteditModel] = useState(false)
  /**所属线路数据**/
  const [belongingLineData, setbelongingLineData] = useState<BelongingLineType[]>([])
  /**所属厂站**/

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
  const lineformLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 17 },
  }

  /** 关闭模态框 **/
  const onClose = () => {
    setzIndex('edit')
    setdrawToolbarVisible(false)
  }

  /** 图符型号 */
  const selectDrawFeature = (result: RadioChangeEvent) => {
    setcurrentFeatureType(result.target.value)
    const kelevelOptions = KVLEVELOPTIONS.filter((item: KVLEVELTYPES) =>
      item.belonging.find((type: string) => type.includes(result.target.value))
    )
    setkelevelOptions(kelevelOptions)
    form.resetFields()
    form.setFieldsValue({
      featureType: result.target.value,
    })
  }
  /** 选择线路型号 */
  const onChangeLineType = (value: string) => {
    setselectLineType(value)
    form.setFieldsValue({
      lineType: value,
      conductorModel: '',
    })
  }

  /* 绘制线路选择所属线路 **/
  const seleceBelongingLine = (value: string) => {
    const currentLineData = belongingLineData.find((item) => item.id === value)
    if (currentLineData) {
      form.setFieldsValue({
        lineId: currentLineData?.id,
        kvLevel: currentLineData?.kvLevel,
      })
      setcurrentKvleve(currentLineData?.kvLevel)
    }
  }

  /* 切换tab **/
  const tabsOnChange = (value: string) => {
    setcurrentFeature(value)
  }

  /** 插入图元 */
  const createFeature = async () => {
    try {
      await form.validateFields()
      const formData = form.getFieldsValue()
      if (formData.featureType === TRANSFORMERSUBSTATION || formData.featureType === POWERSUPPLY) {
        setisRefresh(false)
      }

      drawPoint(mapRef.map, {
        ...formData,
      })
    } catch (err) {}
  }

  /** 绘制线路 **/
  const createLine = async () => {
    try {
      await form.validateFields()
      const formData = form.getFieldsValue()
      drawLine(mapRef.map, {
        ...formData,
        featureType: formData.lineType,
      })
    } catch (err) {}
  }

  // 获取所有所属线路
  const { data, run } = useRequest(getAllBelongingLineItem, {
    manual: true,
    onSuccess: () => {
      data && setbelongingLineData(data)
    },
  })

  useEffect(() => {
    run()
  }, [isRefresh, run])

  const FormRules = () => ({
    validator(_: any, value: string) {
      const reg = /^((\d|[123456789]\d)(\.\d+)?|100)$/
      if (reg.test(value)) {
        return Promise.resolve()
      }
      return Promise.reject(new Error('请输入0到100的正整数'))
    },
  })

  return (
    <Drawer
      title="手动绘制"
      placement="right"
      getContainer={false}
      style={{
        position: 'absolute',
        width: drawToolbarVisible ? '378px' : 0,
        height: '100%',
        overflow: 'hidden',
        zIndex: zIndex === 'create' ? 1000 : 900,
      }}
      mask={false}
      onClose={onClose}
      visible={drawToolbarVisible}
    >
      <Tabs
        defaultActiveKey="feature"
        type="line"
        style={{ overflow: 'hidden' }}
        onChange={tabsOnChange}
      >
        <TabPane tab="插入图符" key="feature">
          {currentFeature === 'feature' && (
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

              <Divider plain orientation="center">
                属性栏
              </Divider>

              <Form.Item
                name="name"
                label="名称"
                rules={[{ required: true, message: '请输入名称' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="kvLevel"
                label="电压等级"
                rules={[{ required: true, message: '请输入名称' }]}
              >
                <Select dropdownStyle={{ zIndex: 3000 }}>
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
                  <Form.Item
                    name="powerType"
                    label="电源类型"
                    rules={[{ required: true, message: '请输入名称' }]}
                  >
                    <Select dropdownStyle={{ zIndex: 3000 }}>
                      <Option value="水电">水电</Option>
                      <Option value="火电">火电</Option>
                      <Option value="风电">风电</Option>
                      <Option value="光伏">光伏</Option>
                      <Option value="生物质能">生物质能</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="installedCapacity" label="装机容量" rules={[FormRules]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="schedulingMode" label="调度方式">
                    <Input />
                  </Form.Item>
                </>
              )}

              {/* 杆塔 柱上断路器 柱上变压器*/}
              {BELONGINGLINE.includes(currentFeatureType) && (
                <Form.Item
                  name="lineId"
                  label="所属线路"
                  rules={[{ required: true, message: '请选择所属线路' }]}
                >
                  <Select dropdownStyle={{ zIndex: 3000 }}>
                    {belongingLineData.map((item) => (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}

              {/* 箱变 柱上变压器*/}
              {BELONGINGCAPACITY.includes(currentFeatureType) && (
                <>
                  <Form.Item name="capacity" label="容量" rules={[FormRules]}>
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
                <Form.Item
                  name="properties"
                  label={`${currentFeatureType === RINGNETWORKCABINET ? '' : '配变'}性质`}
                >
                  <Select dropdownStyle={{ zIndex: 3000 }}>
                    <Option value="公变">公变</Option>
                    <Option value="专变">专变</Option>
                  </Select>
                </Form.Item>
              )}

              <Form.Item name="lng" label="经度">
                <Input />
              </Form.Item>
              <Form.Item name="lat" label="纬度">
                <Input />
              </Form.Item>
            </Form>
          )}
        </TabPane>
        <TabPane tab="绘制线路" key="drawline">
          {currentFeature === 'drawline' && (
            <Form {...lineformLayout} style={{ marginTop: '10px' }} form={form}>
              <Form.Item
                name="lineId"
                label="所属线路"
                rules={[{ required: true, message: '请选择所属线路' }]}
              >
                <Select dropdownStyle={{ zIndex: 3000 }} onChange={seleceBelongingLine}>
                  {belongingLineData.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="lineType"
                label="线路类型"
                rules={[{ required: true, message: '请选择线路类型' }]}
              >
                <Row gutter={3}>
                  <Col span={16}>
                    <Select allowClear onChange={onChangeLineType} dropdownStyle={{ zIndex: 3000 }}>
                      <Option value="Line">架空线路</Option>
                      <Option value="CableCircuit">电缆线路</Option>
                    </Select>
                  </Col>
                  <Col span={5} style={{ marginLeft: '10px' }}>
                    <Button type="primary" onClick={createLine}>
                      绘制线路
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item
                name="lineModel"
                label="线路型号"
                rules={[{ required: true, message: '请选择线路型号' }]}
              >
                <Select dropdownStyle={{ zIndex: 3000 }}>
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
              <Form.Item
                name="kvLevel"
                label="电压等级"
                rules={[{ required: true, message: '请输入名称' }]}
              >
                <Select
                  dropdownStyle={{ zIndex: 3000 }}
                  onChange={(value: number) => {
                    setcurrentKvleve(value)
                  }}
                >
                  {KVLEVELOPTIONS.map((item) => (
                    <Option key={item.kvLevel} value={item.kvLevel}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              {currentKvleve === 3 && (
                <Form.Item name="color" label="线路颜色">
                  <Select allowClear>
                    <Option value="#00FFFF">青</Option>
                    <Option value="#1EB9FF">蓝</Option>
                    <Option value="#F2DA00">黄</Option>
                    <Option value="#FF3E3E">红</Option>
                    <Option value="#FF5ECF">洋红</Option>
                  </Select>
                </Form.Item>
              )}
            </Form>
          )}
        </TabPane>
      </Tabs>
    </Drawer>
  )
}

export default DrawToolbar
