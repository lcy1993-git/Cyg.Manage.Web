import {
  deleteLine,
  featchPowerSupplyTreeData,
  fetchGridManageMenu,
} from '@/services/grid-manage/treeMenu'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { message, Modal, Tree } from 'antd'
import { EventDataNode } from 'antd/es/tree'
import { Key, useEffect, useState } from 'react'
import { useMyContext } from '../Context'
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
const PowerSupplyTree = () => {
  const { data, run: getTree } = useRequest(() => fetchGridManageMenu(), { manual: true })
  const { mapRef, isRefresh, setisRefresh } = useMyContext()
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
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
              key: child.id,
              children: child.lines.map((childrenItem: lineListItemType) => {
                return {
                  ...childrenItem,
                  title: childrenItem.name,
                  key: childrenItem.id,
                }
              }),
            }
          }),
        }
      }),
    },
  ]

  const { data: TreeData, run: getTreeData } = useRequest(
    () => featchPowerSupplyTreeData({ ids: checkedKeys }),
    {
      manual: true,
      onSuccess: () => {
        loadMapLayers(TreeData, mapRef.map)
      },
    }
  )
  useEffect(() => {
    isRefresh && getTree()
  }, [getTree, isRefresh])

  useEffect(() => {
    checkedKeys.length && getTreeData()
  }, [checkedKeys, getTreeData])

  const onSelect = (selectedKeys: Key[], info: TreeSelectType) => {
    const { selectedNodes } = info
    if (selectedNodes.length && !selectedNodes[0].children) {
      setisRefresh(false)
      Modal.confirm({
        title: '确认删除该条线路吗？',
        icon: <ExclamationCircleOutlined />,
        content: `${selectedNodes[0].name}`,
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          try {
            await deleteLine([selectedNodes[0].id])
            setisRefresh(true)
            message.info('删除成功')
            const currentSelectLineIds = checkedKeys.filter((item) => item !== selectedNodes[0].id)
            setCheckedKeys(currentSelectLineIds)
          } catch (err) {
            message.error('删除失败')
          }
        },
      })
    }
  }

  const getPowerSupplyTreeData = (checkedKeys: any) => {
    const checkedIds = checkedKeys.filter((item: string) => !item.includes('-'))
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
    <Tree
      checkable
      defaultExpandAll
      onCheck={getPowerSupplyTreeData}
      onSelect={onSelect}
      treeData={treeData}
    />
  )
}
export default PowerSupplyTree
