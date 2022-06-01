import {
  deleteLine,
  featchSubstationTreeData,
  fetchGridManageMenu,
  getLineData,
  GetStationItems,
  getSubStations,
  modifyLine,
} from '@/services/grid-manage/treeMenu'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Form, Input, message, Modal, Select, Tree } from 'antd'
import { EventDataNode } from 'antd/es/tree'
import { Key, useEffect, useState } from 'react'
import { useMyContext } from '../Context'
import { CABLECIRCUITMODEL, KVLEVELOPTIONS, LINEMODEL, POWERSUPPLY } from '../DrawToolbar/GridUtils'
import { loadMapLayers } from '../GridMap/utils/initializeMap'

interface lineListItemType {
  belonging: string
  color: string
  conductorModel: string
  id: string
  isOverhead: boolean
  kvLevel: number
  lineProperties: string
  name: string
  totalCapacity: number
  totalLength: number
}
interface PowerSupplyListType {
  companyId: string // 公司编号
  createdBy: string // 创建人
  geom: string // 经纬度坐标
  id: string
  installedCapacity: number // 装机容器
  kvLevel: number // 电压等级
  name: string // 厂站名称
  powerType: string // 电源类型
  schedulingMode: string // 调度方式
  lines: Array<lineListItemType>
}

interface infoType {
  event: React.MouseEvent<Element, MouseEvent>
  node: EventDataNode & {
    id?: string
    name?: string
  }
}

interface TreeSelectType {
  event: 'select'
  selected: boolean
  node: EventDataNode
  selectedNodes: {
    title: string
    key: string
    name?: string
    id?: string
    children: any[] | undefined
  }[]
  nativeEvent: MouseEvent
}
interface BelongingLineType {
  id: string
  name: string
  isOverhead: boolean
  isPower: boolean
}

const { useForm } = Form
const { Option } = Select

const lineformLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
}

const PowerSupplyTree = () => {
  const { data, run: getTree } = useRequest(() => fetchGridManageMenu(), { manual: true })
  const { mapRef, isRefresh, setisRefresh } = useMyContext()
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  const [PowerSupplyIds, setPowerSupplyIds] = useState<string[]>([])
  const [currentFeatureId, setcurrentFeatureId] = useState<string | undefined>('')
  const [selectLineType, setselectLineType] = useState('')
  const [form] = useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentLineKvLevel, setcurrentLineKvLevel] = useState<number>(1)
  /**所属厂站**/
  const [stationItemsData, setstationItemsData] = useState<BelongingLineType[]>([])
  // console.log(data, '数据')
  const treeData = [
    {
      title: '电源',
      key: '0-0',
      children: data?.map((item, index) => {
        return {
          title: item.type,
          key: `0-0-${index}`,
          children: item.powerSupplySubList.map((child: PowerSupplyListType) => {
            return {
              ...child,
              title: child.name,
              key: `${child.id}_&${POWERSUPPLY}`,
              type: POWERSUPPLY,
              children: child.lines.map((childrenItem: lineListItemType) => {
                return {
                  ...childrenItem,
                  type: 'line',
                  title: childrenItem.name,
                  key: `${childrenItem.id}_&Line`,
                }
              }),
            }
          }),
        }
      }),
    },
  ]
  // 获取所有电源
  const { data: subStationsData, run: GetSubStations } = useRequest(
    () =>
      getSubStations({
        stationIds: [],
        powerIds: PowerSupplyIds,
      }),
    {
      manual: true,
      onSuccess: () => {
        getTreeData()
      },
    }
  )

  const { data: TreeData, run: getTreeData } = useRequest(
    () => featchSubstationTreeData(checkedKeys),
    {
      manual: true,
      onSuccess: () => {
        loadMapLayers(
          {
            ...TreeData,
            powerSupplyList: PowerSupplyIds.length ? subStationsData?.powerSupplyList : [],
          },
          mapRef.map
        )
      },
    }
  )

  const handleOk = async () => {
    try {
      setisRefresh(false)
      const formData = form.getFieldsValue()
      const params = { ...formData, id: currentFeatureId }
      await modifyLine(params)
      setIsModalVisible(false)
      setisRefresh(true)
      message.info('编辑成功')
    } catch (err) {
      message.error('编辑失败')
      setIsModalVisible(false)
    }
  }
  /** 选择线路型号 */
  const onChangeLineType = (value: string) => {
    setselectLineType(value)
    form.setFieldsValue({
      lineType: value,
      conductorModel: '',
    })
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }

  useEffect(() => {
    isRefresh && getTree()
  }, [getTree, isRefresh])

  useEffect(() => {
    PowerSupplyIds.length ? GetSubStations() : getTreeData()

    if (!PowerSupplyIds.length && checkedKeys.length) {
      getTreeData()
    }
  }, [GetSubStations, PowerSupplyIds, checkedKeys.length, getTreeData])

  // 点击右键，删除线路数据
  const onRightClick = (info: infoType) => {
    const { node } = info
    if (node && !node.children) {
      setisRefresh(false)
      Modal.confirm({
        title: '确认删除该条线路吗？',
        icon: <ExclamationCircleOutlined />,
        content: `${node.name}`,
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          try {
            await deleteLine([node.id])
            setisRefresh(true)
            message.info('删除成功')
            const currentSelectLineIds = checkedKeys.filter((item) => item !== node.id)
            setCheckedKeys(currentSelectLineIds)
          } catch (err) {
            message.error('删除失败')
          }
        },
      })
    }
  }

  // 点击左键，编辑线路数据
  const onSelect = async (selectedKeys: Key[], info: TreeSelectType) => {
    const { selectedNodes } = info
    if (selectedNodes.length && !selectedNodes[0].children && selectedNodes[0].id) {
      setcurrentFeatureId(selectedNodes[0].id)
      const data = await getLineData(selectedNodes[0].id)
      // const lines = await getLineCompoment([selectedNodes[0].id])
      // // !! 线路总长度
      // console.log(lines, '123456')
      // const length = getTotalLength()
      setIsModalVisible(true)
      form.setFieldsValue({
        ...data,
      })
    }
  }

  const getPowerSupplyTreeData = (checkedKeys: any) => {
    const PowerSupplyIds = checkedKeys
      .map((item: string) => {
        const isSubstation = item.includes(`_&${POWERSUPPLY}`)
        if (isSubstation) {
          return item.split('_&')[0]
        }
        return undefined
      })
      .filter((item: string) => item)
    setPowerSupplyIds(PowerSupplyIds)
    const lineIds = checkedKeys
      .map((item: string) => {
        const isSubstation = item.includes(`_&Line`)
        if (isSubstation) {
          return item.split('_&')[0]
        }
        return undefined
      })
      .filter((item: string) => item)
    setCheckedKeys(lineIds)
  }

  // 获取所有厂站
  const { data: stationItems, run: stationItemsHandle } = useRequest(GetStationItems, {
    manual: true,
    onSuccess: () => {
      stationItems && setstationItemsData(stationItems)
    },
  })

  useEffect(() => {
    stationItemsHandle()
  }, [])

  return (
    <>
      <Tree
        checkable
        defaultExpandAll
        onCheck={getPowerSupplyTreeData}
        onRightClick={onRightClick}
        onSelect={onSelect}
        treeData={treeData}
      />
      <Modal title="编辑线路属性" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <div className="editTransformerSubstation">
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
              <Select allowClear>
                {stationItemsData.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="totalCapacity" label="配变总容量">
              <Input disabled />
            </Form.Item>
            <Form.Item name="totalLength" label="线路总长度">
              <Input disabled />
            </Form.Item>
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
                <Option value="CableCircuit">电缆线路</Option>
                <Option value="Line">架空线路</Option>
              </Select>
            </Form.Item>
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
        </div>
      </Modal>
    </>
  )
}
export default PowerSupplyTree
