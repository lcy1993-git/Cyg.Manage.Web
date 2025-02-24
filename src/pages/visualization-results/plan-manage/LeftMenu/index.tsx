import {
  createLine,
  getlinesComponment,
  GetStationItems,
  getSubStations,
} from '@/services/grid-manage/treeMenu'
import { useRequest, useUpdateEffect } from 'ahooks'
import { Button, Divider, Form, Input, Modal, Select, Spin } from 'antd'
import { useEffect, useState } from 'react'
import PlanStandingBook from '../../components/plan-standing-book'
import { useMyContext } from '../Context'
import {
  CABLECIRCUITMODEL,
  createFeatureId,
  KVLEVELOPTIONS,
  LINE,
  LINEMODEL,
  POWERSUPPLY,
  TRANSFORMERSUBSTATION,
} from '../DrawToolbar/GridUtils'
import { changeLayer, loadMapLayers } from '../PlanMap/utils/initializeMap'
import { dataHandle, newData } from '../tools'
import DrawGridToolbar from './DrawGridToolbar'
import GridPowerSupplyTree from './GridPowerSupplyTree'
import GridSubstationTree from './GridSubstationTree'
import styles from './index.less'
import PlanPowerSupplyTree from './PlanPowerSupplyTree'
import PlanSubstationTree from './PlanSubstationTree'
import { TreeProvider } from './TreeContext'

interface BelongingLineType {
  id: string
  name: string
  isOverhead: boolean
  isPower: boolean
}
const { useForm } = Form
const { Option } = Select

const lineformLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 17 },
}

const LeftMenu = () => {
  const [form] = useForm()
  const [visible, setVisible] = useState(false)
  const [currentLineKvLevel, setcurrentLineKvLevel] = useState<number>(1)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [standingBookVisible, setStandingBookVisible] = useState(false)
  const {
    setIsRefresh,
    mapRef,
    lineAssemble,
    setcheckLineIds,
    isRefresh,
    setMapLoading,
    checkLineIds,
    checkPlanLineIds,
    setCheckPlanLineIds,
    checkedLayers,
  } = useMyContext()
  const [selectLineType, setselectLineType] = useState('')
  const [kvLevels, setKvLevels] = useState<number[]>([])
  const [areasId, setAreasId] = useState<string[]>([])
  const [isFilterTree, setIsFilterTree] = useState(true)

  // 线路ID集合
  const [linesId, setlinesId] = useState<string[]>([])

  // 规划线路ID集合
  const [planLinesId, setPlanLinesId] = useState<string[]>([])
  // 电源集合
  const [powerSupplyIds, setpowerSupplyIds] = useState<string[]>([])
  // 变电站 id集合
  const [subStations, setsubStations] = useState<string[]>([])
  // 规划电源集合
  const [planPowerIds, setPlanPowerIds] = useState<string[]>([])
  // 规划变电站 id集合
  const [planSubStations, setPlanSubStations] = useState<string[]>([])
  // tree loading
  const [treeLoading, settreeLoading] = useState<boolean>(false)
  /**所属厂站**/
  const [stationItemsData, setstationItemsData] = useState<BelongingLineType[]>([])
  // 所属厂站表单项select当前选中值
  const [belonging, setBelonging] = useState<string | undefined>()
  // 终点厂站表单项select当前选中值
  const [endBelonging, setEndBelonging] = useState<string | undefined>()
  const showModal = () => {
    // setIsRefresh(!isRefresh)
    setcurrentLineKvLevel(1)
    setBelonging(undefined)
    setEndBelonging(undefined)
    setVisible(true)
  }
  // 新增线路弹窗，可以展示终点厂站的电压等级数组集合
  const showEndBelongingKvLevels = KVLEVELOPTIONS.filter(
    (level) => level.belonging.includes('Line') && level.kvLevel !== 3
  ).map((item) => item.kvLevel)
  //打开网架台账信息
  const showStandingBook = () => {
    setStandingBookVisible(true)
  }

  const handleOk = async () => {
    try {
      await form.validateFields()
      setConfirmLoading(true)
      const formData = form.getFieldsValue()
      let color: string | undefined
      if (formData.kvLevel === 3) {
        if (formData.color) {
          const kv = KVLEVELOPTIONS.find(
            (item: any) => formData.kvLevel === item.kvLevel
          )?.color.find((item) => item.value === formData.color)
          color = kv?.label
        } else {
          color = '红'
        }
      } else {
        const kv = KVLEVELOPTIONS.find((item: any) => formData.kvLevel === item.kvLevel)
        color = kv?.color[0].label
      }

      const params = {
        ...formData,
        isOverhead: formData.lineType === LINE,
        id: createFeatureId(),
        color,
        gridDataType: 1,
      }
      createLineItem(params)
    } catch (err) {}
  }

  // 创建线路
  const { run: createLineItem } = useRequest(createLine, {
    manual: true,
    onSuccess: () => {
      setVisible(false)
      setConfirmLoading(false)
      setIsRefresh(!isRefresh)
      form.resetFields()
    },
  })

  // 获取所有厂站
  const { data: stationItems, run: stationItemsHandle } = useRequest(GetStationItems, {
    manual: true,
    onSuccess: () => {
      stationItems && setstationItemsData(stationItems)
    },
  })

  /** 选择线路型号 */
  const onChangeLineType = (value: string) => {
    setselectLineType(value)
    form.setFieldsValue({
      lineType: value,
      conductorModel: '',
    })
  }

  //历史
  const { data: subStationsData, run: GetSubStations } = useRequest(
    () => {
      setMapLoading(true)
      return getSubStations({
        stationIds: subStations,
        powerIds: powerSupplyIds,
      })
    },
    {
      manual: true,
      onSuccess: () => {
        getTreeData()
      },
    }
  )

  //规划
  const { data: planSubStationsData, run: GetPlanSubStations } = useRequest(
    () => {
      setMapLoading(true)
      return getSubStations({
        stationIds: planSubStations,
        powerIds: planPowerIds,
      })
    },
    {
      manual: true,
      onSuccess: () => {
        getPlanTreeData()
      },
    }
  )

  //获取规划网架数据
  const { data: PlanTreeData, run: getPlanTreeData } = useRequest(
    () => {
      const ids = [...new Set(planLinesId)]
      const lineIds: string[] = ids
        .map((item: string) => {
          const exist = item.includes('_&Line')
          if (exist) {
            return item.split('_&Line')[0]
          }
          return ''
        })
        .filter((item: string) => item)
      return getlinesComponment({
        lineIds,
        kvLevels: [],
        gridDataType: 1,
      })
    },
    {
      manual: true,
      onSuccess: () => {
        const treeDatas = dataHandle(PlanTreeData)
        let lineList: any[] = []
        let powerSupplyList: any[] = []
        // let lineRelationList = [];
        if (planPowerIds.length) {
          // @ts-ignore
          powerSupplyList = planSubStationsData?.powerSupplyList.map((item) => {
            return {
              ...item,
              color: '#4D3900',
            }
          })
        }
        const filterLineIds: any[] = []
        // @ts-ignore
        const subStationList = newData(planSubStationsData?.transformerSubstationList)
        if (planPowerIds.length || planSubStations.length) {
          const line = treeDatas.lineRelationList.filter(
            (item: any) =>
              item.endTypeText === POWERSUPPLY ||
              item.endTypeText === TRANSFORMERSUBSTATION ||
              item.startTypeText === POWERSUPPLY ||
              item.startTypeText === TRANSFORMERSUBSTATION
          )

          line.forEach((item: any) => {
            const exist = powerSupplyList.find(
              (ndoe: any) => item.startId === ndoe.id || item.endId === ndoe.id
            )
            if (!exist) {
              const sub = subStationList.find(
                (ndoe: any) => item.startId === ndoe.id || item.endId === ndoe.id
              )
              if (!sub) {
                filterLineIds.push(item.id)
              }
            }
          })
        }

        if (filterLineIds.length) {
          lineList = treeDatas.lineRelationList
            .map((item: any) => {
              const exist = filterLineIds.find((line) => line === item.id)
              if (!exist) {
                return item
              }
              return undefined
            })
            .filter((item) => item)
        }

        loadMapLayers(
          {
            ...treeDatas,
            lineRelationList: lineList.length ? lineList : treeDatas.lineRelationList,
            powerSupplyList,
            transformerSubstationList: planSubStations.length
              ? // @ts-ignore
                newData(planSubStationsData?.transformerSubstationList)
              : [],
          },
          mapRef.map,
          checkPlanLineIds,
          'plan'
        )

        setMapLoading(false)
      },
    }
  )

  //获取历史网架数据
  const { data: TreeData, run: getTreeData } = useRequest(
    () => {
      const ids = [...new Set(linesId)]
      const lineIds: string[] = ids
        .map((item: string) => {
          const exist = item.includes('_&Line')
          if (exist) {
            return item.split('_&Line')[0]
          }
          return ''
        })
        .filter((item: string) => item)
      return getlinesComponment({
        lineIds,
        kvLevels: [],
      })
    },
    {
      manual: true,
      onSuccess: () => {
        const treeDatas = dataHandle(TreeData)
        let lineList: any[] = []
        let powerSupplyList: any[] = []
        // let lineRelationList = [];
        if (powerSupplyIds.length) {
          // @ts-ignore
          powerSupplyList = subStationsData?.powerSupplyList.map((item) => {
            return {
              ...item,
              color: '#4D3900',
            }
          })
        }
        const filterLineIds: any[] = []
        // @ts-ignore
        const subStationList = newData(subStationsData?.transformerSubstationList)
        if (powerSupplyIds.length || subStations.length) {
          const line = treeDatas.lineRelationList.filter(
            (item: any) =>
              item.endTypeText === POWERSUPPLY ||
              item.endTypeText === TRANSFORMERSUBSTATION ||
              item.startTypeText === POWERSUPPLY ||
              item.startTypeText === TRANSFORMERSUBSTATION
          )

          line.forEach((item: any) => {
            const exist = powerSupplyList.find(
              (ndoe: any) => item.startId === ndoe.id || item.endId === ndoe.id
            )
            if (!exist) {
              const sub = subStationList.find(
                (ndoe: any) => item.startId === ndoe.id || item.endId === ndoe.id
              )
              if (!sub) {
                filterLineIds.push(item.id)
              }
            }
          })
        }

        if (filterLineIds.length) {
          lineList = treeDatas.lineRelationList
            .map((item: any) => {
              const exist = filterLineIds.find((line) => line === item.id)
              if (!exist) {
                return item
              }
              return undefined
            })
            .filter((item) => item)
        }

        loadMapLayers(
          {
            ...treeDatas,
            lineRelationList: lineList.length ? lineList : treeDatas.lineRelationList,
            powerSupplyList,
            transformerSubstationList: subStations.length
              ? // @ts-ignore
                newData(subStationsData?.transformerSubstationList)
              : [],
          },
          mapRef.map,
          checkLineIds,
          'history'
        )

        setMapLoading(false)
      },
    }
  )

  useUpdateEffect(() => {
    if (checkedLayers.length === 0 && checkedLayers) {
      changeLayer(mapRef.map, 'none')
    }
    if (checkedLayers.length === 1 && checkedLayers.includes('plan')) {
      // if (planLinesId.length > 0) {

      GetPlanSubStations()
      changeLayer(mapRef.map, 'plan')
      return
      // }
      // changeLayer(mapRef.map, 'none')
    }
    if (checkedLayers.length === 1 && checkedLayers.includes('history')) {
      // if (linesId.length > 0) {
      GetSubStations()
      changeLayer(mapRef.map, 'history')
      return
      // }
      // changeLayer(mapRef.map, 'none')
    }
    if (checkedLayers.length === 2) {
      GetSubStations()
      GetPlanSubStations()
      changeLayer(mapRef.map, 'all')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    powerSupplyIds,
    subStations,
    linesId,
    planLinesId,
    planPowerIds,
    planSubStations,
    checkedLayers,
  ])

  useEffect(() => {
    stationItemsHandle({ GridDataType: 1 })
  }, [lineAssemble, isRefresh, stationItemsHandle])

  useEffect(() => {
    setcheckLineIds(linesId)
  }, [linesId, setcheckLineIds])

  useEffect(() => {
    setCheckPlanLineIds(planLinesId)
  }, [planLinesId, setCheckPlanLineIds])

  return (
    <div className="w-full h-full bg-white flex flex-col">
      <TreeProvider
        value={{
          linesId,
          setlinesId,
          //历史网架
          powerSupplyIds,
          setpowerSupplyIds,
          subStations,
          setsubStations,
          //规划网架
          planLinesId,
          setPlanLinesId,
          planPowerIds,
          setPlanPowerIds,
          planSubStations,
          setPlanSubStations,
          settreeLoading,
          treeLoading,
          kvLevels,
          setKvLevels,
          areasId,
          setAreasId,
          isFilterTree,
          setIsFilterTree,
        }}
      >
        <div className="w-full flex-none" style={{ height: '50px' }}>
          <DrawGridToolbar />
        </div>
        <div className={`w-full flex-1 flex flex-col overflow-y-auto ${styles.customScroll}`}>
          <Spin spinning={!treeLoading}>
            <Divider orientation="left" plain>
              规划网架
            </Divider>
            <div className={`w-full flex-none`}>
              <PlanSubstationTree />
            </div>
            <div className={`w-full flex-1`}>
              <PlanPowerSupplyTree />
            </div>
            <Divider orientation="left" plain>
              历史网架
            </Divider>
            <div className={`w-full flex-1`}>
              <GridSubstationTree />
            </div>
            <div className={`w-full flex-1`}>
              <GridPowerSupplyTree />
            </div>
            <div className={`w-full flex-1`}></div>
          </Spin>
        </div>
      </TreeProvider>
      <div
        className="w-full flex-none flex items-center"
        style={{ height: '50px', paddingRight: '10px' }}
      >
        <Button type="primary" block onClick={showStandingBook} className="mr7">
          台账信息
        </Button>
        <Button type="primary" block onClick={showModal}>
          新增线路
        </Button>
      </div>

      <Modal
        title="新增线路"
        destroyOnClose
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={() => {
          form.resetFields()
          setVisible(false)
          setselectLineType('')
        }}
      >
        <Form {...lineformLayout} style={{ marginTop: '10px' }} form={form}>
          <Form.Item
            name="name"
            label="线路名称"
            rules={[{ required: true, message: '请输入线路名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="belonging"
            label="所属厂站"
            rules={[{ required: true, message: '请选择所属厂站' }]}
          >
            <Select
              allowClear
              onChange={(value: string | undefined) => {
                setBelonging(value)
              }}
            >
              {stationItemsData
                .filter((item) => item.id !== endBelonging)
                .map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          {showEndBelongingKvLevels.includes(currentLineKvLevel) && (
            <Form.Item
              name="endBelonging"
              label="终点厂站"
              rules={[{ required: true, message: '请选择终点厂站' }]}
            >
              <Select
                allowClear
                onChange={(value: string | undefined) => {
                  setEndBelonging(value)
                }}
              >
                {stationItemsData
                  .filter((item) => item.id !== belonging)
                  .map((item) => (
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
            rules={[{ required: true, message: '请选择电压等级' }]}
          >
            <Select
              onChange={(value: number) => {
                setcurrentLineKvLevel(value)
              }}
            >
              {KVLEVELOPTIONS.filter((level) => level.belonging.includes('Line')).map((item) => (
                <Option key={item.kvLevel} value={item.kvLevel}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="lineType"
            label="线路类型"
            rules={[{ required: true, message: '请选择线路类型' }]}
          >
            <Select allowClear onChange={onChangeLineType} dropdownStyle={{ zIndex: 3000 }}>
              <Option value="Line">架空线路</Option>
              <Option value="CableCircuit">电缆线路</Option>
            </Select>
          </Form.Item>

          {selectLineType === 'CableCircuit' && (
            <>
              <Form.Item name="channelType" label="通道类型">
                <Input placeholder="请输入通道类型" />
              </Form.Item>
              <Form.Item name="channelModel" label="通道型号">
                <Input placeholder="请输入通道型号" />
              </Form.Item>
              <Form.Item name="cableCapacity" label="电缆容量">
                <Input placeholder="请输入电缆容量" />
              </Form.Item>
            </>
          )}

          <Form.Item
            name="conductorModel"
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
            name="lineProperties"
            label="线路性质"
            rules={[{ required: true, message: '请选择线路性质' }]}
          >
            <Select>
              <Option value="公用">公用</Option>
              <Option value="专用">专用</Option>
            </Select>
          </Form.Item>

          {currentLineKvLevel === 3 && (
            <Form.Item
              name="color"
              label="线路颜色"
              rules={[{ required: true, message: '请选择线路颜色' }]}
            >
              <Select allowClear>
                <Option value="#00FFFF">青</Option>
                <Option value="#1EB9FF">蓝</Option>
                <Option value="#F2DA00">黄</Option>
                <Option value="#FF3E3E">红</Option>
                <Option value="#FF5ECF">洋红</Option>
              </Select>
            </Form.Item>
          )}
          {/* <Form.Item name="isOverhead" label="是否为架空" initialValue={true}>
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item> */}
        </Form>
      </Modal>
      <PlanStandingBook visible={standingBookVisible} onChange={setStandingBookVisible} />
    </div>
  )
}
export default LeftMenu
