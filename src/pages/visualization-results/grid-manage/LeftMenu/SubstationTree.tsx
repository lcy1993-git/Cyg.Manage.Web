import {
  deleteLine,
  featchSubstationTreeData,
  getLineData,
  GetStationItems,
  getTransformerSubstationMenu,
  modifyLine,
} from '@/services/grid-manage/treeMenu'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Form, Input, message, Modal, Radio, Select, Tree } from 'antd'
import { EventDataNode } from 'antd/es/tree'
import { Key, useEffect, useState } from 'react'
import { useMyContext } from '../Context'
import { KVLEVELOPTIONS } from '../DrawToolbar/GridUtils'
import { loadMapLayers } from '../GridMap/utils/initializeMap'

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
          key: `0=1=${index}`,
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
                    key: children.id,
                  }
                }),
              }
            }
          ),
        }
      }),
    },
  ]

  const { data: TreeData, run: getTreeData } = useRequest(
    () => featchSubstationTreeData(checkedKeys),
    {
      manual: true,
      onSuccess: () => {
        loadMapLayers(TreeData, mapRef.map)
      },
    }
  )

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
      await modifyLine(formData)
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

  useEffect(() => {
    stationItemsHandle()
  }, [])

  useEffect(() => {
    isRefresh && getTree()
  }, [getTree, isRefresh])

  useEffect(() => {
    checkedKeys.length && getTreeData()
  }, [checkedKeys, getTreeData])

  // 点击左键，编辑线路数据
  const onSelect = async (selectedKeys: Key[], info: TreeSelectType) => {
    const { selectedNodes } = info
    if (selectedNodes.length && !selectedNodes[0].children) {
      const data = await getLineData(selectedNodes[0].id)
      setIsModalVisible(true)
      form.setFieldsValue({
        ...data,
      })
    }
  }

  const getSubstationTreeData = (checkedKeys: any) => {
    const checkedIds = checkedKeys.filter((item: string) => !item.includes('='))
    setCheckedKeys(checkedIds)
    if (!checkedIds.length) {
      loadMapLayers(
        {
          boxTransformerList: [], // 箱变列表
          cableBranchBoxList: [], // 电缆分支箱
          cableWellList: [], // 电缆井
          columnCircuitBreakerList: [], // 柱上断路器
          columnTransformerList: [], // 柱上变压器
          electricityDistributionRoomList: [], // 配电室
          lineRelationList: [], // 线路连接关系表
          ringNetworkCabinetList: [], // 环网柜
          switchingStationList: [], // 开闭所
          towerList: [], // 杆塔
          lineList: [], // 线路表
        },
        mapRef.map
      )
    }
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
            <Form.Item name="isOverhead" label="是否为架空" initialValue={true}>
              <Radio.Group>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  )
}
export default SubstationTree
