import { getAllBelongingLineItem, uploadAllFeature } from '@/services/grid-manage/treeMenu'
import { useRequest } from 'ahooks'
import {
  Button,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Radio,
  RadioChangeEvent,
  Row,
  Select,
  Tabs,
  Cascader,
} from 'antd'
import React, { useEffect, useState } from 'react'
import { useMyContext } from '../Context'
import {
  clear,
  drawLine,
  drawPoint,
  getDrawLines,
  getDrawPoints,
} from '../GridMap/utils/initializeMap'
import { companyId } from '../GridMap/utils/utils'
import {
  verificationLat,
  verificationLng,
  verificationNaturalNumber,
  transformArrtToAreaData,
} from '../tools'
import {
  BELONGINGCAPACITY,
  BELONGINGLINE,
  BELONGINGMODEL,
  BELONGINGPROPERITIES,
  BELONGINGCAREA,
  BOXTRANSFORMER,
  CABLEBRANCHBOX,
  CABLECIRCUITMODEL,
  CABLEWELL,
  COLORDEFAULT,
  COLUMNCIRCUITBREAKER,
  COLUMNTRANSFORMER,
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
    setIsRefresh,
    areaData,
    areaMap,
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
  /**所属线路数据回数**/
  const [lineNumber, setLineNumber] = useState<string>('1')
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
  /** 转换绘制线路多个回数数据 **/
  const transformLines = (formData: any) => {
    const arr = []
    const lineNumber = Number(formData.lineNumber)
    for (let i = 0; i < lineNumber; i++) {
      const kvLevel = `kvLevel_${i + 1}`
      const lineType = `lineType_${i + 1}`
      const lineModel = `lineModel_${i + 1}`
      const lineId = `lineId_${i + 1}`
      let color
      const lineData = belongingLineData.find((item) => item.id === formData[lineId])
      const lineKvLevel = lineData?.kvLevel
      const lineColor = lineData?.color
      if (lineKvLevel === 3) {
        const kv = KVLEVELOPTIONS.find((item: any) => lineKvLevel === item.kvLevel)?.color.find(
          (item) => item.label === lineColor
        )
        color = kv?.value
      } else {
        const kv = KVLEVELOPTIONS.find((item: any) => lineKvLevel === item.kvLevel)
        color = kv?.color[0].value
      }
      const item = {
        kvLevel: formData[kvLevel],
        lineType: formData[lineType],
        lineModel: formData[lineModel],
        lineId: formData[lineId],
        color,
      }
      arr.push(item)
    }
    return {
      LoopNumber: lineNumber,
      data: arr,
    }
  }
  const selectLine = (value: string, option: any) => {
    // 设置key时添加当前select标识，在key中获取
    const selectNumber = option.key.split('__')[1]
    const currentLineData = belongingLineData.find((item) => item.id === value)
    if (currentLineData) {
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
      const data = {
        [`kvLevel_${selectNumber}`]: exist ? 3 : currentLineData?.kvLevel,
        [`lineType_${selectNumber}`]: currentLineData.isOverhead ? 'Line' : 'CableCircuit',
        [`lineModel_${selectNumber}`]: currentLineData.lineModel ? '111' : '',
      }
      lineForm.setFieldsValue(data)
    }
  }
  /** 线路回数个数改变渲染多个线路回路表单项 **/
  const renderLines = () => {
    const lines = []
    for (let i = 0; i < Number(lineNumber); i++) {
      lines.push({ value: i + 1 })
    }
    return lines.map((line) => {
      return (
        <React.Fragment key={line.value}>
          <Form.Item
            name={`lineId_${line.value}`}
            label={`所属线路${line.value}`}
            rules={[{ required: true, message: '请选择所属线路' }]}
          >
            <Select dropdownStyle={{ zIndex: 3000 }} onChange={selectLine}>
              {belongingLineData.map((item) => (
                <Option value={item.id} key={`${item.id}__${line.value}`}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name={`lineType_${line.value}`} label={`线路类型${line.value}`}>
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
          <Form.Item name={`lineModel_${line.value}`} label={`线路型号${line.value}`}>
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
            name={`kvLevel_${line.value}`}
            label={`电压等级${line.value}`}
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
        </React.Fragment>
      )
    })
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
    clear()
    setClickState(false)
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
      form.setFieldsValue({
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

      // const transformerIntervalList = transformerStationList.map((item: { id: any }) => {
      //   return {
      //     id: createFeatureId(),
      //     transformerSubstationId: item.id,
      //     publicuse: 0,
      //     spare: 0,
      //     specialPurpose: 0,
      //     total: 0,
      //   }
      // })
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
        // transformerIntervalList,
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
      if (BELONGINGCAREA.includes(formData.featureType)) {
        // 电源和变电站需传递区域信息
        const { areas } = formData
        drawPoint(
          mapRef.map,
          {
            ...formData,
            companyId: companyId,
            color: color ? color : COLORDEFAULT,
            ...transformArrtToAreaData(areas, areaMap),
          },
          setClickState
        )
      } else {
        drawPoint(
          mapRef.map,
          {
            ...formData,
            companyId: companyId,
            color: color ? color : COLORDEFAULT,
          },
          setClickState
        )
      }
    } catch (err) {}
  }

  // useUpdateEffect(() => {
  //   setClickState(false)
  // }, [clickState])

  /** 绘制线路 **/
  const createLine = async () => {
    try {
      await lineForm.validateFields()
      let formData = lineForm.getFieldsValue()
      formData = transformLines(formData)
      // todo 多回路开发数据结构改变。这里的color可能应该去掉
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
        companyId: companyId,
        name: '',
        color: color ? color : COLORDEFAULT,
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

  const formChange = async (changeValues: any, allvalues: any) => {
    if (changeValues['featureType']) {
      return
    }
    if (clickState) {
      await uploadLocalData()
      clear()
      setIsRefresh(!isRefresh)
      message.info('数据已上传，请重新插入图符')
      setClickState(false)
    }
  }

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
              onValuesChange={formChange}
              initialValues={{ areas: [] }}
            >
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
              {BELONGINGCAREA.includes(currentFeatureType) && (
                <Form.Item name="areas" label={`区域`}>
                  <Cascader options={areaData} />
                </Form.Item>
              )}
            </Form>
          )}
        </TabPane>
        <TabPane tab="绘制线段" key="drawline">
          {currentFeature === 'drawline' && (
            <Form
              {...lineformLayout}
              style={{ marginTop: '10px' }}
              form={lineForm}
              initialValues={{ lineNumber: '1' }}
            >
              <Form.Item name="lineNumber" label="线路回数">
                <Select
                  allowClear
                  dropdownStyle={{ zIndex: 3000 }}
                  onChange={(val: string) => {
                    setLineNumber(val)
                  }}
                >
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
              </Form.Item>
              {renderLines()}
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
