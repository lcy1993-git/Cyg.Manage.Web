import {
  deleteLine,
  getLineCompoment,
  getLineData,
  GetStationItems,
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
  LINE,
  LINEMODEL,
  TRANSFORMERSUBSTATION,
} from '../DrawToolbar/GridUtils'
import { getTotalLength, upateLineByMainLine } from '../GridMap/utils/initializeMap'
import { useTreeContext } from './TreeContext'

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
    onSuccess: () => {
      settreeLoading(true)
    },
    onError: () => {
      settreeLoading(true)
    },
  })
  const { isRefresh, setisRefresh, mapRef } = useMyContext()
  const { linesId, setlinesId, setsubStations, settreeLoading } = useTreeContext()
  const [form] = useForm()
  // 编辑线路模态框状态
  const [isModalVisible, setIsModalVisible] = useState(false)
  // 当前选中线路的电压等级
  const [currentLineKvLevel, setcurrentLineKvLevel] = useState<number>(1)
  // 当前选中的线路ID
  const [currentFeatureId, setcurrentFeatureId] = useState<string | undefined>('')
  // 当前线路类型
  const [selectLineType, setselectLineType] = useState('')

  /**所属厂站**/
  const [stationItemsData, setstationItemsData] = useState<BelongingLineType[]>([])
  const treeData = [
    {
      title: '变电站',
      type: 'Parent',
      key: '0=1',
      children: data?.map((item, index) => {
        return {
          ...item,
          title: item.name,
          key: `${item.id}_&${TRANSFORMERSUBSTATION}`,
          type: TRANSFORMERSUBSTATION,
          children: item.lineKVLevelGroups.map(
            (
              child: { kvLevel: number; lines: { name: string; id: string }[]; id: string },
              childIndex: number
            ) => {
              const childTitle = KVLEVELOPTIONS.find((kv) => kv.kvLevel === child.kvLevel)
              return {
                ...child,
                title: childTitle ? childTitle.label : '未知电压',
                type: 'KVLEVEL',
                key: `0=1=${index}=${childIndex}`,
                children: child.lines.map((children: { name: string; id: string }) => {
                  return {
                    ...children,
                    title: children.name,
                    type: LINE,
                    key: `${children.id}_&Line${item.id}_&${TRANSFORMERSUBSTATION}_KVLEVEL0=1=${index}=${childIndex}_&Parent0-1`,
                  }
                }),
              }
            }
          ),
        }
      }),
    },
  ]
  // 右键删除线路
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
            const currentSelectLineIds = linesId.filter((item) => item !== node.id)
            setlinesId(currentSelectLineIds)
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

  // 编辑线路属性
  const handleOk = async () => {
    try {
      await form.validateFields()
      setisRefresh(false)
      const formData = form.getFieldsValue()
      let color: string | undefined
      let styleColor: string | undefined
      if (formData.kvLevel === 3) {
        if (formData.color) {
          const kv = KVLEVELOPTIONS.find(
            (item: any) => formData.kvLevel === item.kvLevel
          )?.color.find((item) => item.value === formData.color)
          color = kv?.label
          styleColor = kv?.value
        } else {
          color = '红'
          styleColor = '#FF3E3E'
        }
      } else {
        const kv = KVLEVELOPTIONS.find((item: any) => formData.kvLevel === item.kvLevel)
        color = kv?.color[0].label
        styleColor = kv?.color[0].value
      }
      const upLoadparams = { ...formData, id: currentFeatureId, color }

      const drawParams = {
        ...formData,
        id: currentFeatureId,
        styleColor,
        lineModel: formData.conductorModel,
      }

      await modifyLine(upLoadparams)
      upateLineByMainLine(mapRef.map, drawParams)
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
      // @ts-ignore
      const length = getTotalLength(lines.lineRelationList)
      selectedNodes[0].kvLevel && setcurrentLineKvLevel(selectedNodes[0].kvLevel)
      setIsModalVisible(true)
      form.setFieldsValue({
        ...data,
        totalLength: length.toFixed(1),
        lineType: selectedNodes[0].isOverhead ? 'Line' : 'CableCircuit',
      })
    }
  }

  const getSubstationTreeData = async (checkedKeys: any, e: any) => {
    const SubstationIds = checkedKeys
      .map((item: string) => {
        const isSubstation = item.includes(`_&${TRANSFORMERSUBSTATION}`)
        if (isSubstation) {
          return item.split('_&')[0]
        }
        return undefined
      })
      .filter((item: string) => item)
    setsubStations(SubstationIds)

    const currentLineId = checkedKeys
      .map((item: string) => {
        const isSubstation = item.includes(`_&Line`)
        if (isSubstation) {
          return item
        }
        return undefined
      })
      .filter((item: string) => item)

    const currentLinesId = [...currentLineId, ...linesId]
    setlinesId([...new Set(currentLinesId)])

    if (!e.checked) {
      switch (e.node.type) {
        case TRANSFORMERSUBSTATION:
          setlinesId(
            currentLinesId.filter(
              (item) => !item.includes(`${e.node.id}_&${TRANSFORMERSUBSTATION}`)
            )
          )
          return
        case 'KVLEVEL':
          setlinesId(currentLinesId.filter((item) => !item.includes(`_KVLEVEL${e.node.key}`)))
          return
        case LINE:
          setlinesId(currentLinesId.filter((item) => !item.includes(e.node.id)))
          return
        case 'Parent':
          setlinesId(currentLinesId.filter((item) => !item.includes('_&Parent0-1')))
      }
    }
  }

  /** 选择线路型号 */
  const onChangeLineType = (value: string) => {
    setselectLineType(value)
    form.setFieldsValue({
      lineType: value,
      conductorModel: '',
      color: '',
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
              <Input disabled addonAfter="(kAV)" />
            </Form.Item>
            <Form.Item name="totalLength" label="线路总长度">
              <Input disabled addonAfter="(km)" />
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
          </Form>
        </div>
      </Modal>
    </>
  )
}
export default SubstationTree
