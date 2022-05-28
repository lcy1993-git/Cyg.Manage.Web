import { featchPowerSupplyTreeData, fetchGridManageMenu } from '@/services/grid-manage/treeMenu'
import { useRequest } from 'ahooks'
import { Tree } from 'antd'
import { useEffect, useState } from 'react'
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

const PowerSupplyTree = (props: { isRefresh: boolean }) => {
  const { isRefresh } = props
  const { data, run: getTree } = useRequest(() => fetchGridManageMenu(), { manual: true })
  const { mapRef } = useMyContext()
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

  return <Tree checkable defaultExpandAll onCheck={getPowerSupplyTreeData} treeData={treeData} />
}
export default PowerSupplyTree
