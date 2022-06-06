import { getAllBelongingLineItem, uploadAllFeature } from '@/services/grid-manage/treeMenu'
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
import {
  clear,
  drawLine,
  drawPoint,
  getDrawLines,
  getDrawPoints,
} from '../GridMap/utils/initializeMap'
import {
  BELONGINGCAPACITY,
  BELONGINGLINE,
  BELONGINGMODEL,
  BELONGINGPROPERITIES,
  BOXTRANSFORMER,
  CABLEBRANCHBOX,
  CABLECIRCUITMODEL,
  CABLEWELL,
  COLUMNCIRCUITBREAKER,
  COLUMNTRANSFORMER,
  createFeatureId,
  ELECTRICITYDISTRIBUTIONROOM,
  FEATUREOPTIONS,
  KVLEVELOPTIONS,
  KVLEVELTYPES,
  LINE,
  LINEMODEL,
  POWERSUPPLY,
  RINGNETWORKCABINET,
  SWITCHINGSTATION,
  TOWER,
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
  color?: string
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
  // 上传所有点位
  const { run: stationItemsHandle } = useRequest(uploadAllFeature, { manual: true })

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
    setcurrentKvleve(1)
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

  /** 上传本地数据 **/
  const uploadLocalData = async () => {
    const pointData = getDrawPoints()
    const lineData = getDrawLines()
    if ((pointData && pointData.length) || (lineData && lineData.length)) {
      const powerSupplyList = pointData.filter(
        (item: { featureType: string }) => item.featureType === POWERSUPPLY
      )
      const transformerStationList = pointData.filter(
        (item: { featureType: string }) => item.featureType === TRANSFORMERSUBSTATION
      )
      const cableWellList = pointData.filter(
        (item: { featureType: string }) => item.featureType === CABLEWELL
      )
      const towerList = pointData.filter(
        (item: { featureType: string }) => item.featureType === TOWER
      )
      const boxTransformerList = pointData.filter(
        (item: { featureType: string }) => item.featureType === BOXTRANSFORMER
      )
      const ringNetworkCabinetList = pointData.filter(
        (item: { featureType: string }) => item.featureType === RINGNETWORKCABINET
      )
      const electricityDistributionRoomList = pointData.filter(
        (item: { featureType: string }) => item.featureType === ELECTRICITYDISTRIBUTIONROOM
      )
      const switchingStationList = pointData.filter(
        (item: { featureType: string }) => item.featureType === SWITCHINGSTATION
      )
      const columnCircuitBreakerList = pointData.filter(
        (item: { featureType: string }) => item.featureType === COLUMNCIRCUITBREAKER
      )
      const columnTransformerList = pointData.filter(
        (item: { featureType: string }) => item.featureType === COLUMNTRANSFORMER
      )
      const cableBranchBoxList = pointData.filter(
        (item: { featureType: string }) => item.featureType === CABLEBRANCHBOX
      )
      const lineElementRelationList = lineData.map((item: { lineType: string }) => {
        return {
          ...item,
          isOverhead: item.lineType === LINE,
        }
      })
      const transformerIntervalList = transformerStationList.map((item: { id: any }) => {
        return {
          id: createFeatureId(),
          transformerSubstationId: item.id,
          publicuse: 0,
          spare: 0,
          specialPurpose: 0,
          total: 0,
        }
      })
      await stationItemsHandle({
        towerList,
        switchingStationList,
        ringNetworkCabinetList,
        electricityDistributionRoomList,
        columnTransformerList,
        columnCircuitBreakerList,
        cableWellList,
        cableBranchBoxList,
        boxTransformerList,
        powerSupplyList,
        transformerStationList,
        lineElementRelationList,
        transformerIntervalList,
      })
    }
  }

  /* 切换tab **/
  const tabsOnChange = (value: string) => {
    setcurrentFeature(value)
    form.resetFields()
    // 上传本地绘制数据
    uploadLocalData()
    // 退出手动绘制
    clear()
  }

  /** 插入图元 */
  const createFeature = async () => {
    try {
      await form.validateFields()
      const formData = form.getFieldsValue()
      if (formData.featureType === TRANSFORMERSUBSTATION || formData.featureType === POWERSUPPLY) {
        setisRefresh(false)
      }

      let color

      if (formData.featureType === POWERSUPPLY) {
        color = '#4D3900'
      }
      if (formData.featureType === TRANSFORMERSUBSTATION) {
        const kv = KVLEVELOPTIONS.find((item) => item.kvLevel === currentKvleve)
        color = kv?.color[0].value
      }

      drawPoint(mapRef.map, {
        ...formData,
        color: color ? color : '#0000FF',
      })
    } catch (err) {}
  }

  /** 绘制线路 **/
  const createLine = async () => {
    try {
      await form.validateFields()
      const formData = form.getFieldsValue()

      let color
      if (formData.kvLevel === 3) {
        const kv = KVLEVELOPTIONS.find(
          (item: any) => formData.kvLevel === item.kvLevel
        )?.color.find((item) => item.value === formData.color)
        color = kv?.value
      } else {
        const kv = KVLEVELOPTIONS.find((item: any) => formData.kvLevel === item.kvLevel)
        color = kv?.color[0].value
      }

      drawLine(mapRef.map, {
        ...formData,
        color: color ? color : '#0000FF',
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
      // const reg = /^((\d|[123456789]\d)(\.\d+)?|100)$/ 0到100的正整数 包含0 和100
      if (!value) {
        return Promise.resolve()
      }
      const reg = /^([0]|[1-9][0-9]*)$/
      if (reg.test(value)) {
        return Promise.resolve()
      }
      return Promise.reject(new Error('请输入0或正整数'))
    },
  })

  const FormRuleslng = () => ({
    validator: (_: any, value: string, callback: any) => {
      const reg =
        /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,15})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,15}|180)$/
      if (value === '' || !value) {
        callback()
      } else {
        if (!reg.test(value)) {
          callback(new Error('经度范围：-180~180（保留小数点后十五位）'))
        }
        callback()
      }
    },
  })
  const FormRuleslat = () => ({
    validator: (_: any, value: string, callback: any) => {
      const reg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,15}|90\.0{0,15}|[0-8]?\d{1}|90)$/
      if (value === '' || !value) {
        callback()
      } else {
        if (!reg.test(value)) {
          callback(new Error('纬度范围：-90~90（保留小数点后十五位）'))
        }
        callback()
      }
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
                <Select
                  dropdownStyle={{ zIndex: 3000 }}
                  onChange={(value: number) => {
                    setcurrentKvleve(value)
                  }}
                >
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
              {/* {currentKvleve === 3 && currentFeatureType !== POWERSUPPLY && (
                <Form.Item name="color" label="颜色">
                  <Select allowClear>
                    <Option value="#00FFFF">青</Option>
                    <Option value="#1EB9FF">蓝</Option>
                    <Option value="#F2DA00">黄</Option>
                    <Option value="#FF3E3E">红</Option>
                    <Option value="#FF5ECF">洋红</Option>
                  </Select>
                </Form.Item>
              )} */}
              <Form.Item name="lng" label="经度" rules={[FormRuleslng]}>
                <Input />
              </Form.Item>
              <Form.Item name="lat" label="纬度" rules={[FormRuleslat]}>
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
              {/* {currentKvleve === 3 && (
                <Form.Item name="color" label="线路颜色">
                  <Select allowClear>
                    <Option value="#00FFFF">青</Option>
                    <Option value="#1EB9FF">蓝</Option>
                    <Option value="#F2DA00">黄</Option>
                    <Option value="#FF3E3E">红</Option>
                    <Option value="#FF5ECF">洋红</Option>
                  </Select>
                </Form.Item>
              )} */}
            </Form>
          )}
        </TabPane>
      </Tabs>
    </Drawer>
  )
}

export default DrawToolbar
