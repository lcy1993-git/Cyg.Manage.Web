import { getAllBelongingLineItem, uploadAllFeature } from '@/services/grid-manage/treeMenu'
import { useRequest, useUpdateEffect } from 'ahooks'
import {
  Button,
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
import { verificationLat, verificationLng, verificationNaturalNumber } from '../tools'
import {
  BELONGINGCAPACITY,
  BELONGINGLINE,
  BELONGINGMODEL,
  BELONGINGPROPERITIES,
  BOXTRANSFORMER,
  CABLEBRANCHBOX,
  CABLECIRCUITMODEL,
  CABLEWELL,
  COLORDEFAULT,
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

export interface BelongingLineType {
  id: string
  name: string
  kvLevel: number
  isOverhead: boolean
  isPower: boolean
  color?: string
  lineModel?: string
  lineNumber?: string
}

const DrawToolbar = () => {
  const {
    drawToolbarVisible,
    setdrawToolbarVisible,
    mapRef,
    isRefresh,
    zIndex,
    setzIndex,
  } = useMyContext()
  // 需要绘制的当前图元
  const [currentFeatureType, setcurrentFeatureType] = useState('PowerSupply')
  // 当前选中的是架空还是电缆线路
  const [selectLineType, setselectLineType] = useState('')
  // 当前的电压等级
  const [currentKvleve, setcurrentKvleve] = useState<number>()
  // Tab切换控制
  const [currentFeature, setcurrentFeature] = useState('feature')
  // 当前主线路的颜色
  const [currentColor, setcurrentColor] = useState<string | undefined>('')
  // 当前主线路的电压等级
  const [currentLineKvLevel, setcurrentLineKvLevel] = useState<number | undefined>()
  /**所属线路数据**/
  const [belongingLineData, setbelongingLineData] = useState<BelongingLineType[]>([])
  // 上传所有点位
  const { run: stationItemsHandle } = useRequest(uploadAllFeature, { manual: true })

  const [clickState, setClickState] = useState<boolean>(false)

  const [kelevelOptions, setkelevelOptions] = useState([
    ...KVLEVELOPTIONS.filter((item: KVLEVELTYPES) =>
      item.belonging.find((type: string) => type.includes(currentFeatureType))
    ),
  ])

  const [form] = useForm()
  const [lineForm] = useForm()
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
      setcurrentColor(currentLineData.color)
      setcurrentLineKvLevel(currentLineData?.kvLevel)
      setselectLineType(currentLineData.isOverhead ? 'Line' : 'CableCircuit')
      // 下面的图元无论主线路的电压等级是多少，都显示10KV
      const exist = [
        BOXTRANSFORMER,
        CABLEBRANCHBOX,
        COLUMNCIRCUITBREAKER,
        COLUMNTRANSFORMER,
        ELECTRICITYDISTRIBUTIONROOM,
        RINGNETWORKCABINET,
        SWITCHINGSTATION,
      ].includes(currentFeatureType)
      currentFeature === 'feature'
        ? form.setFieldsValue({
            lineId: currentLineData?.id,
            kvLevel: exist ? 3 : currentLineData?.kvLevel,
            lineType: currentLineData.isOverhead ? 'Line' : 'CableCircuit',
            lineModel: currentLineData.lineModel ? '111' : '',
          })
        : lineForm.setFieldsValue({
            lineId: currentLineData?.id,
            kvLevel: exist ? 3 : currentLineData?.kvLevel,
            lineType: currentLineData.isOverhead ? 'Line' : 'CableCircuit',
            lineModel: currentLineData.lineModel ? '111' : '',
          })
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

      let color
      if (formData.featureType === POWERSUPPLY) {
        color = '#4D3900'
      } else if (formData.featureType === TRANSFORMERSUBSTATION) {
        const kv = KVLEVELOPTIONS.find((item) => item.kvLevel === currentKvleve)
        color = kv?.color[0].value
      } else {
        const lineKv = KVLEVELOPTIONS.find((item) => item.kvLevel === currentLineKvLevel)
        if (lineKv) {
          const exist = lineKv.color.find((co) => co.label === currentColor)
          color = exist ? exist.value : ''
        }
      }

      drawPoint(
        mapRef.map,
        {
          ...formData,
          color: color ? color : COLORDEFAULT,
        },
        setClickState
      )
    } catch (err) {}
  }

  useUpdateEffect(() => {
    clickState && createFeature()
    setClickState(false)
  }, [clickState])

  /** 绘制线路 **/
  const createLine = async () => {
    try {
      await lineForm.validateFields()
      const formData = lineForm.getFieldsValue()

      let color
      if (currentLineKvLevel === 3) {
        const kv = KVLEVELOPTIONS.find(
          (item: any) => currentLineKvLevel === item.kvLevel
        )?.color.find((item) => item.label === currentColor)
        color = kv?.value
      } else {
        const kv = KVLEVELOPTIONS.find((item: any) => currentLineKvLevel === item.kvLevel)
        color = kv?.color[0].value
      }
      drawLine(mapRef.map, {
        ...formData,
        color: color ? color : COLORDEFAULT,
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
            <Form {...formItemLayout} style={{ marginTop: '10px' }} form={form}>
              <Form.Item name="featureType" label="绘制图符" initialValue="PowerSupply">
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
              {/* 杆塔 柱上断路器 柱上变压器*/}
              {BELONGINGLINE.includes(currentFeatureType) && (
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
              )}
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

              {/* 箱变 柱上变压器*/}
              {BELONGINGCAPACITY.includes(currentFeatureType) && (
                <>
                  <Form.Item
                    name="capacity"
                    label="容量"
                    rules={[{ required: true }, verificationNaturalNumber]}
                  >
                    <Input addonAfter="(kAV)" />
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
                <Form.Item name="properties" label={`配变性质`}>
                  <Select dropdownStyle={{ zIndex: 3000 }}>
                    <Option value="公变">公变</Option>
                    <Option value="专变">专变</Option>
                  </Select>
                </Form.Item>
              )}
              {currentFeatureType === RINGNETWORKCABINET && (
                <Form.Item name="properties" label={`性质`}>
                  <Select dropdownStyle={{ zIndex: 3000 }}>
                    <Option value="公用">公用</Option>
                    <Option value="专用">专用</Option>
                  </Select>
                </Form.Item>
              )}
              <Form.Item name="lng" label="经度" rules={[verificationLng]}>
                <Input />
              </Form.Item>
              <Form.Item name="lat" label="纬度" rules={[verificationLat]}>
                <Input />
              </Form.Item>
            </Form>
          )}
        </TabPane>
        <TabPane tab="绘制线段" key="drawline">
          {currentFeature === 'drawline' && (
            <Form
              {...lineformLayout}
              style={{ marginTop: '10px' }}
              form={lineForm}
              // initialValues={{ lineNumber: '1' }}
            >
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
              <Form.Item name="lineType" label="线路类型">
                <Select
                  allowClear
                  onChange={onChangeLineType}
                  dropdownStyle={{ zIndex: 3000 }}
                  disabled
                >
                  {[
                    { label: '架空线路', value: 'Line' },
                    { label: '电缆线路', value: 'CableCircuit' },
                  ].map((item) => (
                    <Option value={item.value} key={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="lineModel" label="线路型号">
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
              {/* <Form.Item name="lineNumber" label="线路回数">
                <Select allowClear dropdownStyle={{ zIndex: 3000 }}>
                  {[
                    { label: '1', value: '1' },
                    { label: '2', value: '2' },
                    { label: '3', value: '3' },
                    { label: '4', value: '4' },
                  ].map((item) => (
                    <Option value={item.value} key={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item> */}
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
              <Form.Item wrapperCol={{ offset: 6, span: 17 }}>
                <Button type="primary" onClick={createLine}>
                  绘制线路
                </Button>
              </Form.Item>
            </Form>
          )}
        </TabPane>
      </Tabs>
    </Drawer>
  )
}

export default DrawToolbar
