import {
  deleteLine,
  fetchGridManageMenu,
  // getLineCompoment,
  GetStationItems,
  modifyLine,
} from '@/services/grid-manage/treeMenu'
import { ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Form, Input, message, Modal, Select, Tree } from 'antd'
import { EventDataNode } from 'antd/es/tree'
import { Key, useEffect, useState } from 'react'
import EquipLineList from '../../components/line-equip-list'
import { useMyContext } from '../Context'
import {
  CABLECIRCUITMODEL,
  KVLEVELOPTIONS,
  LINE,
  LINEMODEL,
  POWERSUPPLY,
  TRANSFORMERSUBSTATION,
} from '../DrawToolbar/GridUtils'
import { upateLineByMainLine } from '../GridMap/utils/initializeMap'
import { useTreeContext } from './TreeContext'

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
    kvLevel?: number
    id?: string
    isOverhead?: boolean
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
  const { isRefresh, setIsRefresh, mapRef, lineAssemble, companyId } = useMyContext()
  const {
    linesId,
    setlinesId,
    setpowerSupplyIds,
    settreeLoading,
    kvLevels,
    areasId,
    isFilterTree,
  } = useTreeContext()
  const [currentFeatureId, setcurrentFeatureId] = useState<string | undefined>('')
  const [selectLineType, setselectLineType] = useState('')
  const [form] = useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentLineKvLevel, setcurrentLineKvLevel] = useState<number>(1)
  /**所属厂站**/
  const [stationItemsData, setstationItemsData] = useState<BelongingLineType[]>([])

  const [currentLineId, setCurrentLineId] = useState<string>('')

  //当前点击线路标题
  const [lineTitle, setLineTitle] = useState<string>('')
  const { data, run: getTree } = useRequest(
    () => fetchGridManageMenu({ kvLevels: kvLevels, ...transformAreaId(areasId) }),
    {
      manual: true,
      onSuccess: () => {
        settreeLoading(true)
      },
      onError: () => {
        settreeLoading(true)
      },
    }
  )
  const transformAreaId = (areasId: any) => {
    const [province, city, county] = areasId
    return {
      province: !isNaN(province) ? province : '',
      city: !isNaN(city) ? city : '',
      area: !isNaN(county) ? county : '',
    }
  }
  const transformTreeData = (tree: any, key: any) => {
    return tree?.map((item: any, index: any) => {
      return {
        title: item.type,
        key: `0-0-${index}${key}`,
        type: 'PowerType',
        children: item.powerSupplySubList.map((child: PowerSupplyListType) => {
          return {
            ...child,
            title:
              companyId !== child.companyId ? (
                <>
                  <InfoCircleOutlined style={{ color: '#2d7de3' }} title="子公司项目" />
                  <span style={{ paddingLeft: '3px' }}> {child.name}</span>
                </>
              ) : (
                child.name
              ),
            key: `${child.id}_&${POWERSUPPLY}`,
            type: POWERSUPPLY,
            children: child.lines.map((childrenItem: lineListItemType) => {
              return {
                ...childrenItem,
                type: LINE,
                title: childrenItem.name,
                key: `${childrenItem.id}_&Line${child.id}_&${POWERSUPPLY}_&PowerType0-0-${index}${key}_&Parent0-0`,
              }
            }),
          }
        }),
      }
    })
  }
  const transformTreeStructure = (tree: any) => {
    return tree?.map((item: any) => {
      return {
        key: item.key,
        type: item.type,
        title: item.title,
        children:
          item.key === 'Province_Other'
            ? transformTreeData(item.data, item.key)
            : item.children.map((item: any) => {
                if (item.data && item.data.length > 0) {
                  return {
                    key: item.key,
                    title: item.title,
                    type: item.city,
                    children: transformTreeData(item.data, item.key),
                  }
                }
                return {
                  key: item.key,
                  type: item.type,
                  title: item.title,
                  children: item.children.map((item: any) => {
                    return {
                      key: item.key,
                      type: item.type,
                      title: item.title,
                      children: transformTreeData(item.data, item.key),
                    }
                  }),
                }
              }),
      }
    })
  }

  const treeData = [
    {
      title: '电源',
      key: '0-0',
      type: 'Parent',
      children: transformTreeStructure(data),
    },
  ]

  const handleOk = async () => {
    try {
      await form.validateFields()
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
      const upLoadparams = {
        ...formData,
        id: currentFeatureId,
        color,
        isOverhead: formData.lineType === 'Line',
      }

      const drawParams = {
        ...formData,
        id: currentFeatureId,
        color: styleColor,
        lineModel: formData.conductorModel,
        isOverhead: formData.lineType === 'Line',
      }
      await modifyLine(upLoadparams)
      upateLineByMainLine(mapRef.map, drawParams)
      setIsModalVisible(false)
      setIsRefresh(!isRefresh)
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
      color: '',
    })
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }

  useEffect(() => {
    getTree()
  }, [getTree, isRefresh, isFilterTree])

  // 点击右键，删除线路数据
  const onRightClick = (info: infoType) => {
    const { node } = info
    if (node && !node.children) {
      Modal.confirm({
        title: '确认删除该条线路吗？',
        icon: <ExclamationCircleOutlined />,
        content: `${node.name}`,
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          try {
            await deleteLine([node.id])
            setIsRefresh(!isRefresh)
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

  // 点击左键，编辑线路数据
  const onSelect = async (selectedKeys: Key[], info: TreeSelectType) => {
    const { selectedNodes } = info

    if (selectedNodes.length && !selectedNodes[0].children && selectedNodes[0].id) {
      //   setcurrentFeatureId(selectedNodes[0].id)
      //   const data = await getLineData(selectedNodes[0].id)
      //   const lines = await getLineCompoment({ lineIds: selectedNodes[0].id, kvLevels: [] })
      //   // @ts-ignore 计算线路总长度
      //   const length = getTotalLength(lines.lineRelationList)
      //   selectedNodes[0].kvLevel && setcurrentLineKvLevel(selectedNodes[0].kvLevel)
      const lineIdStr = selectedNodes[0].key

      const end = lineIdStr.indexOf('_&Line')
      if (end !== -1) {
        setCurrentLineId(lineIdStr.substring(0, end))
      }
      setLineTitle(selectedNodes[0].title)
      setIsModalVisible(true)
      // form.setFieldsValue({
      //   ...data,
      //   totalLength: length.toFixed(1),
      //   lineType: selectedNodes[0].isOverhead ? 'Line' : 'CableCircuit',
      // })
      // setselectLineType(selectedNodes[0].isOverhead ? 'Line' : 'CableCircuit')
    }
  }
  // checkbox状态改变触发
  const getPowerSupplyTreeData = (checkedKeys: any, e: any) => {
    const PowerSupplyIds: string[] = checkedKeys
      .map((item: string) => {
        const start = item.indexOf('_&Line')
        const end = item.indexOf('_&PowerSupply')
        if (start !== -1 && end !== -1) {
          return item.substring(start + 6, end)
        }
        const idStr = item.indexOf('_&PowerSupply')
        if (idStr !== -1) {
          return item.split('_&')[0]
        }
        return undefined
      })
      .filter(Boolean)
    setpowerSupplyIds([...new Set(PowerSupplyIds)])
    const currentLineId = checkedKeys
      .map((item: string) => {
        const isSubstation = item.includes(`_&Line`)
        if (isSubstation) {
          return item
        }
        return undefined
      })
      .filter((item: string) => item)

    const currentLinesId = [
      ...currentLineId,
      ...linesId.filter((item) => item.indexOf(TRANSFORMERSUBSTATION) !== -1),
    ]
    setlinesId([...new Set(currentLinesId)])
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
  }, [stationItemsHandle, lineAssemble])

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
            {/* <Form.Item name="isOverhead" label="是否为架空" initialValue={true}>
              <Radio.Group>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </Form.Item> */}
          </Form>
        </div>
      </Modal>
      <EquipLineList
        visible={isModalVisible}
        onChange={setIsModalVisible}
        lineTitle={lineTitle}
        lineId={currentLineId}
      />
    </>
  )
}
export default PowerSupplyTree
