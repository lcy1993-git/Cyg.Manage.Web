import {
  deleteLine,
  featchSubstationTreeData,
  getLineCompoment,
  getLineData,
  GetStationItems,
  getSubStations,
  getTransformerSubstationMenu,
  modifyLine,
} from '@/services/grid-manage/treeMenu'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Form, Input, message, Modal, Select, Tree } from 'antd'
import { EventDataNode } from 'antd/es/tree'
import { Key, useEffect, useState } from 'react'
import { useMyContext } from '../Context'
import {
  CABLECIRCUITMODEL,
  KVLEVELOPTIONS,
  LINEMODEL,
  TRANSFORMERSUBSTATION,
} from '../DrawToolbar/GridUtils'
import { getTotalLength, loadMapLayers } from '../GridMap/utils/initializeMap'

interface infoType {
  event: React.MouseEvent<Element, MouseEvent>
  node: EventDataNode & {
    id?: string
    name?: string
  }
}

interface BelongingLineType {
  id: string
  name: string
  isOverhead: boolean
  isPower: boolean
}

interface TreeSelectType {
  event: 'select'
  selected: boolean
  node: EventDataNode
  selectedNodes: {
    title: string
    key: string
    name?: string
    kvLevel?: number
    isOverhead?: boolean
    id?: string
    children: any[] | undefined
  }[]
  nativeEvent: MouseEvent
}

const lineformLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
}

const { useForm } = Form
const { Option } = Select

const SubstationTree = () => {
  const { data, run: getTree } = useRequest(() => getTransformerSubstationMenu(), {
    manual: true,
  })
  const { mapRef, isRefresh, setisRefresh } = useMyContext()
  const [form] = useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentLineKvLevel, setcurrentLineKvLevel] = useState<number>(1)
  const [currentFeatureId, setcurrentFeatureId] = useState<string | undefined>('')
  const [selectLineType, setselectLineType] = useState('')
  const [allSubStations, setallSubStations] = useState<string[]>([])
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  /**所属厂站**/
  const [stationItemsData, setstationItemsData] = useState<BelongingLineType[]>([])
  const treeData = [
    {
      title: '变电站',
      key: '0=1',
      children: data?.map((item, index) => {
        return {
          ...item,
          title: item.name,
          key: `${item.id}_&${TRANSFORMERSUBSTATION}`,
          type: TRANSFORMERSUBSTATION,
          children: item.lineKVLevelGroups.map(
            (
              child: { kvLevel: number; lines: { name: string; id: string }[] },
              childIndex: number
            ) => {
              const childTitle = KVLEVELOPTIONS.find((kv) => kv.kvLevel === child.kvLevel)
              return {
                ...child,
                title: childTitle ? childTitle.label : '未知电压',
                key: `0=1=${index}=${childIndex}`,
                children: child.lines.map((children: { name: string; id: string }) => {
                  return {
                    ...children,
                    title: children.name,
                    key: `${children.id}_&Line`,
                  }
                }),
              }
            }
          ),
        }
      }),
    },
  ]

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

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleOk = async () => {
    try {
      setisRefresh(false)
      const formData = form.getFieldsValue()
      const params = { ...formData, id: currentFeatureId }
      await modifyLine(params)
      message.info('编辑成功')
      setIsModalVisible(false)
      setisRefresh(true)
    } catch (err) {
      message.error('编辑失败')
      setIsModalVisible(false)
    }
  }

  // 获取所有厂站
  const { data: stationItems, run: stationItemsHandle } = useRequest(GetStationItems, {
    manual: true,
    onSuccess: () => {
      stationItems && setstationItemsData(stationItems)
    },
  })

  // 获取所有厂站
  const { data: subStationsData, run: GetSubStations } = useRequest(
    () =>
      getSubStations({
        stationIds: allSubStations,
        powerIds: [],
      }),
    {
      manual: true,
      onSuccess: () => {
        getTreeData()
      },
    }
  )
  // 请求所有线路
  const { data: TreeData, run: getTreeData } = useRequest(
    () => featchSubstationTreeData(checkedKeys),
    {
      manual: true,
      onSuccess: () => {
        loadMapLayers(
          {
            ...TreeData,
            transformerSubstationList: allSubStations.length
              ? subStationsData?.transformerSubstationList
              : [],
          },
          mapRef.map
        )
      },
    }
  )

  useEffect(() => {
    allSubStations.length ? GetSubStations() : getTreeData()
    if (!allSubStations.length && checkedKeys.length) {
      getTreeData()
    }
  }, [GetSubStations, allSubStations, checkedKeys.length, getTreeData])

  useEffect(() => {
    stationItemsHandle()
  }, [stationItemsHandle])

  useEffect(() => {
    isRefresh && getTree()
  }, [getTree, isRefresh])

  // 点击左键，编辑线路数据
  const onSelect = async (_selectedKeys: Key[], info: TreeSelectType) => {
    const { selectedNodes } = info
    if (selectedNodes.length && !selectedNodes[0].children && selectedNodes[0].id) {
      setcurrentFeatureId(selectedNodes[0].id)
      const data = await getLineData(selectedNodes[0].id)
      const lines = await getLineCompoment([selectedNodes[0].id])
      const length = getTotalLength(lines.lineRelationList)
      selectedNodes[0].kvLevel && setcurrentLineKvLevel(selectedNodes[0].kvLevel)
      setIsModalVisible(true)
      form.setFieldsValue({
        ...data,
        totalLength: length.toFixed(2),
        lineType: selectedNodes[0].isOverhead ? 'Line' : 'CableCircuit',
      })
    }
  }

  const getSubstationTreeData = async (checkedKeys: any) => {
    const SubstationIds = checkedKeys
      .map((item: string) => {
        const isSubstation = item.includes(`_&${TRANSFORMERSUBSTATION}`)
        if (isSubstation) {
          return item.split('_&')[0]
        }
        return undefined
      })
      .filter((item: string) => item)
    setallSubStations(SubstationIds)
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

  /** 选择线路型号 */
  const onChangeLineType = (value: string) => {
    setselectLineType(value)
    form.setFieldsValue({
      lineType: value,
      conductorModel: '',
    })
  }

  return (
    <>
      <Tree
        checkable
        defaultExpandAll
        onCheck={getSubstationTreeData}
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
                <Option value="Line">架空线路</Option>
                <Option value="CableCircuit">电缆线路</Option>
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

            {/* <Form.Item name="totalLength" label="线路总长度">
                <Input disabled />
              </Form.Item>
              <Form.Item name="totalCapacity" label="配变总容量">
                <Input disabled />
              </Form.Item> */}
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
export default SubstationTree
